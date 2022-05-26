package server

import (
	"encoding/json"
	"log"
)

type Room struct {
	roomSettings RoomSettings
	boardData    BoardData
	clients      map[*Client]bool
	gameOn       bool
	gameData     map[string]UserGameState
	broadcast    chan [][]byte
	register     chan *Client
	unregister   chan *Client
}

type RoomSettings struct {
	Name       string `json:"name"`
	Password   string `json:"password"`
	Admin      string `json:"admin"`
	MaxPlayers int    `json:"maxPlayers"`
	IsPrivate  bool   `json:"isPrivate"`
	TimeLimit  int    `json:"timeLimit"`
}

type ResponeMessage struct {
	Respone string `json:"response"`
	Error   string `json:"error"`
	Payload interface{}
}

// Message for clients in lobby
type RoomForBroadcast struct {
	Name       string `json:"name"`
	NumPlayers int    `json:"numPlayers"`
	MaxPlayers int    `json:"maxPlayers"`
	IsPrivate  bool   `json:"isPrivate"`
	BoardSize  int    `json:"boardSize"`
	Difficulty int    `json:"difficulty"`
	GameOn     bool   `json:"gameOn"`
}

// Message for clients in room
type RoomForMulticast struct {
	Name       string `json:"name"`
	Admin      string `json:"admin"`
	Players    interface{}
	MaxPlayers int  `json:"maxPlayers"`
	IsPrivate  bool `json:"isPrivate"`
	BoardSize  int  `json:"boardSize"`
	Difficulty int  `json:"difficulty"`
	GameOn     bool `json:"gameOn"`
}

// JSON structure for actions such as create room and edit room are identical
type InboundCreateEditRoom struct {
	Action                    string                    `json:"action"`
	InboundCreateEditRoomData InboundCreateEditRoomData `json:"data"`
}

type InboundCreateEditRoomData struct {
	Name       string `json:"name"`
	Password   string `json:"password"`
	MaxPlayers int    `json:"maxPlayers"`
	IsPrivate  bool   `json:"isPrivate"`
	TimeLimit  int    `json:"timeLimit"`
	Difficulty int    `json:"difficulty"`
	BoardSize  int    `json:"boardSize"`
}

// JSON structure for actions such as start game, finish game and delete room are identical
type InboundRoom struct {
	Action          string          `json:"action"`
	InboundRoomData InboundRoomData `json:"data"`
}

type InboundRoomData struct {
	RoomName string `json:"roomName"`
}

type InboundChangeName struct {
	Action                string                `json:"action"`
	InboundChangeNameData InboundChangeNameData `json:"data"`
}

type InboundChangeNameData struct {
	NewName string `json:"newName"`
}

type InboundKickUser struct {
	Action              string              `json:"action"`
	InboundKickUserData InboundKickUserData `json:"data"`
}

type InboundKickUserData struct {
	UserToKick string `json:"userToKick"`
}

type InboundChangeRoom struct {
	Action                string                `json:"action"`
	InboundChangeRoomData InboundChangeRoomData `json:"data"`
}

type InboundChangeRoomData struct {
	RoomName string `json:"roomName"`
	Password string `json:"password"`
}

// Creates room with given roomSettings
func newRoom(roomSettings RoomSettings) *Room {
	return &Room{
		roomSettings: roomSettings,
		boardData:    BoardData{BoardSettings: BoardSettings{}},
		gameOn:       false,
		gameData:     nil,
		broadcast:    make(chan [][]byte),
		register:     make(chan *Client),
		unregister:   make(chan *Client),
		clients:      make(map[*Client]bool),
	}
}

// Creates room with given parameters and adds client to it
func addRoom(icerd InboundCreateEditRoomData, c *Client) {
	if c.room.roomSettings.Name != "lobby" {
		rm := ResponeMessage{Respone: "CreateRoom", Error: "Client must be in lobby to create room"}
		sendToClient(c, rm)
		return
	}
	roomSettings := RoomSettings{}
	roomSettings.Name = icerd.Name
	roomSettings.Password = icerd.Password
	roomSettings.Admin = c.uuid
	roomSettings.MaxPlayers = icerd.MaxPlayers
	roomSettings.IsPrivate = icerd.IsPrivate
	roomSettings.TimeLimit = icerd.TimeLimit
	if _, ok := roomsMap[roomSettings.Name]; ok {
		rm := ResponeMessage{Respone: "CreateRoom", Error: "Room exists"}
		sendToClient(c, rm)
		return
	}
	r := newRoom(roomSettings)
	r.boardData.BoardSettings.BoardSize = icerd.BoardSize
	r.boardData.BoardSettings.Difficulty = icerd.Difficulty
	roomsMap[roomSettings.Name] = r
	// delete client from lobby and add to current room
	lobby := roomsMap["lobby"]
	delete(lobby.clients, c)
	c.room = r
	r.clients[c] = true
	go r.run()
	rm := ResponeMessage{Respone: "CreateRoom", Payload: r.roomSettings}
	sendToClient(c, rm)
	updatedRoomMulticast(r)
	stateRm := ResponeMessage{Respone: "IsAdmin"}
	sendToClient(c, stateRm)
	stateRm = ResponeMessage{Respone: "InWaitingRoom"}
	sendToClient(c, stateRm)

	// if it is singleplayer game
	if r.roomSettings.MaxPlayers == 1 {
		startGame(InboundRoomData{RoomName: r.roomSettings.Name}, c, r)
	}
	lobbyBroadcast()
}

// Edit room with given parameters
func editRoom(icerd InboundCreateEditRoomData, c *Client, clientRoom *Room) {
	if clientRoom.roomSettings.Admin != c.uuid {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Client must be admin to edit room"}
		sendToClient(c, rm)
		return
	}
	if clientRoom.gameOn {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Room can't be edited during the game"}
		sendToClient(c, rm)
		return
	}
	if clientRoom.roomSettings.Name != icerd.Name {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Wrong room name"}
		sendToClient(c, rm)
		return
	}
	roomSettings := RoomSettings{}
	roomSettings.Name = icerd.Name
	roomSettings.Password = icerd.Password
	roomSettings.Admin = c.uuid
	roomSettings.MaxPlayers = icerd.MaxPlayers
	roomSettings.IsPrivate = icerd.IsPrivate
	roomSettings.TimeLimit = icerd.TimeLimit
	clientRoom.roomSettings = roomSettings
	clientRoom.boardData.BoardSettings.BoardSize = icerd.BoardSize
	clientRoom.boardData.BoardSettings.Difficulty = icerd.Difficulty
	rm := ResponeMessage{Respone: "EditRoom", Payload: roomSettings}
	sendToClient(c, rm)
	updatedRoomMulticast(clientRoom)
	lobbyBroadcast()
}

// Moves clients from room to lobby and removes the room
func deleteRoom(ird InboundRoomData, c *Client) {
	roomToDelete, ok := roomsMap[ird.RoomName]
	if !ok {
		rm := ResponeMessage{Respone: "deleteRoom", Error: "Room does not exist"}
		sendToClient(c, rm)
		return
	}
	lobby := roomsMap["lobby"]
	if c.uuid != roomToDelete.roomSettings.Admin {
		rm := ResponeMessage{Respone: "deleteRoom", Error: "User is not admin"}
		sendToClient(c, rm)
		return
	}
	for client := range roomToDelete.clients {
		client.room = lobby
		lobby.clients[client] = true
		stateRm := ResponeMessage{Respone: "ExitWaitingRoom"}
		sendToClient(client, stateRm)
	}
	delete(roomsMap, roomToDelete.roomSettings.Name)
	stateRm := ResponeMessage{Respone: "ExitAdmin"}
	sendToClient(c, stateRm)
	lobbyBroadcast()
}

// moves client to given room
func changeRoom(icrd InboundChangeRoomData, c *Client, oldRoom *Room) {
	if c.room.roomSettings.Name == icrd.RoomName {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Client already is in this room"}
		sendToClient(c, rm)
		return
	}
	if c.room.roomSettings.Name != "lobby" && icrd.RoomName != "lobby" {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Client must be in lobby to enter to the room"}
		sendToClient(c, rm)
		return
	}
	var oldRoomExist bool = true
	newRoom, ok := roomsMap[icrd.RoomName]
	if !ok {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Room does not exist"}
		sendToClient(c, rm)
		return
	}
	if newRoom.roomSettings.Password != icrd.Password {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Wrong password"}
		sendToClient(c, rm)
		return
	}
	if len(newRoom.clients) == newRoom.roomSettings.MaxPlayers && newRoom.roomSettings.Name != "lobby" {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Max players in room"}
		sendToClient(c, rm)
		return
	}
	if newRoom.gameOn {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Room has an active game"}
		sendToClient(c, rm)
		return
	}
	if oldRoom.gameOn {
		userFinished(InboundRoomData{oldRoom.roomSettings.Name}, c, oldRoom)
	}
	delete(oldRoom.clients, c)
	newRoom.clients[c] = true
	c.room = newRoom
	if oldRoom.roomSettings.Admin == c.uuid {
		oldRoomExist = changeAdmin(c, oldRoom)
	}
	if oldRoom.roomSettings.Name != "lobby" && oldRoomExist {
		updatedRoomMulticast(oldRoom)
	}
	// to prevent double lobbyBroadcast because it is called in deleteRoom
	if oldRoomExist {
		lobbyBroadcast()
	}
	if newRoom.roomSettings.Name == "lobby" {
		stateRm := ResponeMessage{Respone: "ExitWaitingRoom"}
		sendToClient(c, stateRm)
	} else {
		updatedRoomMulticast(newRoom)
		stateRm := ResponeMessage{Respone: "InWaitingRoom"}
		sendToClient(c, stateRm)
	}
}

// give admin to another user in this room if exist, if not then delete room
// return false if room is deleted
func changeAdmin(c *Client, r *Room) bool {
	if c.uuid != r.roomSettings.Admin {
		rm := ResponeMessage{Respone: "changeAdmin", Error: "User is not admin"}
		sendToClient(c, rm)
		return true
	}
	oldAdmin := c
	if len(r.clients) == 0 {
		deleteRoom(InboundRoomData{RoomName: r.roomSettings.Name}, c)
		return false
	}
	for client := range r.clients {
		if client.uuid == oldAdmin.uuid {
			continue
		}
		r.roomSettings.Admin = client.uuid
		break
	}
	stateRm := ResponeMessage{Respone: "ExitAdmin"}
	sendToClient(oldAdmin, stateRm)
	stateRm = ResponeMessage{Respone: "IsAdmin"}
	sendToClient(clientsMap[r.roomSettings.Admin], stateRm)
	return true
}

// kick user from room to lobby
func kickUser(ikud InboundKickUserData, c *Client, r *Room) {
	usernameToKick := ikud.UserToKick
	if c.uuid != r.roomSettings.Admin {
		rm := ResponeMessage{Respone: "kickUser", Error: "Only admin can kick users"}
		sendToClient(c, rm)
		return
	}
	clientToKick := clientsMap[usernameToKick]
	if clientToKick.room.roomSettings.Name == r.roomSettings.Name {
		changeRoom(InboundChangeRoomData{RoomName: "lobby"}, c, r)
		rm := ResponeMessage{Respone: "kickUser", Error: "You have been kicked from the room"}
		sendToClient(clientToKick, rm)
		return
	}
	rm := ResponeMessage{Respone: "kickUser", Error: "Wrong user name"}
	sendToClient(c, rm)
}

// Send given json to all clients in given room
func roomBroadcast(r *Room, rm ResponeMessage) {
	j, _ := json.MarshalIndent(rm, "", "  ")
	for client := range r.clients {
		select {
		case client.send <- j:
		default:
			close(client.send)
			delete(r.clients, client)
		}
	}
}

// Send given json to given client
func sendToClient(c *Client, rm ResponeMessage) {
	j, _ := json.MarshalIndent(rm, "", "  ")
	select {
	case c.send <- j:
	default:
		close(c.send)
		delete(c.room.clients, c)
	}
}

// Message with informations about room and players in room
func updatedRoomMulticast(r *Room) {
	var roomJson RoomForMulticast
	var structTable []ClientIdData
	for _, val := range clientsMap {
		if val.room == r {
			structTable = append(structTable, ClientIdData{val.uuid, val.name})
		}
	}
	roomJson.Name = r.roomSettings.Name
	roomJson.Admin = r.roomSettings.Admin
	roomJson.Players = structTable
	roomJson.MaxPlayers = r.roomSettings.MaxPlayers
	roomJson.IsPrivate = r.roomSettings.IsPrivate
	roomJson.BoardSize = int(r.boardData.BoardSize)
	roomJson.Difficulty = int(r.boardData.Difficulty)
	roomJson.GameOn = r.gameOn
	rm := ResponeMessage{Respone: "UpdateRoom", Payload: roomJson}
	roomBroadcast(r, rm)
}

// Send update about rooms to clients in lobby
func lobbyBroadcast() {
	rm := collectDataForLobbyBroadcast()
	j, _ := json.MarshalIndent(rm, "", "  ")
	// send json for all clients in lobby
	for client := range roomsMap["lobby"].clients {
		select {
		case client.send <- j:
		default:
			close(client.send)
			delete(roomsMap["lobby"].clients, client)
		}
	}
}

func collectDataForLobbyBroadcast() ResponeMessage {
	var roomJson RoomForBroadcast
	var structTable []RoomForBroadcast

	// Iterate over all keys except lobby
	for roomName, room := range roomsMap {
		if roomName == "lobby" || room.roomSettings.MaxPlayers == 1 {
			continue
		}
		roomJson.Name = room.roomSettings.Name
		roomJson.NumPlayers = len(room.clients)
		roomJson.MaxPlayers = room.roomSettings.MaxPlayers
		roomJson.IsPrivate = room.roomSettings.IsPrivate
		roomJson.BoardSize = int(room.boardData.BoardSize)
		roomJson.Difficulty = int(room.boardData.Difficulty)
		roomJson.GameOn = room.gameOn
		structTable = append(structTable, roomJson)
	}
	rm := ResponeMessage{Respone: "RoomsList"}
	if len(structTable) == 0 {
		rm.Error = "No rooms"
	} else {
		rm.Payload = structTable
	}
	return rm
}

func (r *Room) run() {
	for {
		select {
		// when the client connected to the server
		case client := <-r.register:
			rm := ResponeMessage{Respone: "CreateUser", Payload: ClientIdData{Uuid: client.uuid, Name: client.name}}
			sendToClient(client, rm)
			sendToClient(client, collectDataForLobbyBroadcast())
			r.clients[client] = true
		// when the client disconnected to the server
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				if r.gameOn {
					userFinished(InboundRoomData{r.roomSettings.Name}, client, r)
				}
				delete(r.clients, client)
				if client.room.roomSettings.Admin == client.uuid && client.room.roomSettings.Name != "lobby" {
					changeAdmin(client, client.room)
				} else if client.room != roomsMap["lobby"] {
					delete(clientsMap, client.uuid)
					updatedRoomMulticast(r)
					lobbyBroadcast()
				}
				close(client.send)
			}
		// when client will get the message
		case message := <-r.broadcast:
			cid := ClientIdData{}
			json.Unmarshal(message[0], &cid)
			c := clientsMap[cid.Uuid]
			clientRoom := roomsMap[c.room.roomSettings.Name]
			// this allows us to read json with action and user fields and arbitrary data
			var payload map[string]interface{}
			err := json.Unmarshal(message[1], &payload)
			if err != nil {
				log.Print("Error during Unmarshal(): ", err)
				rm := ResponeMessage{Respone: "Error", Error: err.Error()}
				sendToClient(c, rm)
				break
			}
			// check if user uuid from frontend is valid
			// if cid.Uuid != payload["userUuid"] {
			// 	rm := ResponeMessage{Respone: "Error", Error: "Wrong user uuid"}
			// 	sendToClient(c, rm)
			// 	break
			// }
			switch payload["action"] {
			case "createRoom":
				var icer InboundCreateEditRoom
				err := json.Unmarshal(message[1], &icer)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				addRoom(icer.InboundCreateEditRoomData, c)
			case "editRoom":
				var icer InboundCreateEditRoom
				err := json.Unmarshal(message[1], &icer)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				editRoom(icer.InboundCreateEditRoomData, c, clientRoom)
			case "deleteRoom":
				var ir InboundRoom
				err := json.Unmarshal(message[1], &ir)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				deleteRoom(ir.InboundRoomData, c)
			case "changeRoom":
				var icr InboundChangeRoom
				err := json.Unmarshal(message[1], &icr)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				changeRoom(icr.InboundChangeRoomData, c, clientRoom)
			case "changeName":
				var icn InboundChangeName
				err := json.Unmarshal(message[1], &icn)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				changeName(icn.InboundChangeNameData, c)
			case "kickUser":
				var iku InboundKickUser
				err := json.Unmarshal(message[1], &iku)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				kickUser(iku.InboundKickUserData, c, r)
			case "generateBoard":
				var icb InboundCreateBoard
				err := json.Unmarshal(message[1], &icb)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				createBoard(icb.InboundCreateBoardData, c, clientRoom)
			case "startGame":
				var ir InboundRoom
				err := json.Unmarshal(message[1], &ir)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				startGame(ir.InboundRoomData, c, r)
			case "checkBoard":
				var icb InboundCheckBoard
				err := json.Unmarshal(message[1], &icb)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				checkBoard(icb.InboundCheckBoardData, c, r)
			case "finishGame":
				var ir InboundRoom
				err := json.Unmarshal(message[1], &ir)
				if err != nil {
					log.Print("Error during Unmarshal(): ", err)
					rm := ResponeMessage{Respone: "Error", Error: err.Error()}
					sendToClient(c, rm)
					break
				}
				userFinished(ir.InboundRoomData, c, r)
			default:
				rm := ResponeMessage{Respone: "Error", Error: "Wrong response"}
				sendToClient(c, rm)
			}
		}
	}
}
