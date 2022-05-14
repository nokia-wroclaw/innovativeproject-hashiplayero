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
func addRoom(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	if c.room.roomSettings.Name != "lobby" {
		rm := ResponeMessage{Respone: "CreateRoom", Error: "Client must be in lobby to create room"}
		sendToClient(c, rm)
		return
	}
	roomSettings := RoomSettings{}
	roomSettings.Name = data.(map[string]interface{})["name"].(string)
	roomSettings.Password = data.(map[string]interface{})["password"].(string)
	roomSettings.Admin = userUuid.(string)
	roomSettings.MaxPlayers = int(data.(map[string]interface{})["maxPlayers"].(float64))
	roomSettings.IsPrivate = data.(map[string]interface{})["isPrivate"].(bool)
	roomSettings.TimeLimit = int(data.(map[string]interface{})["timeLimit"].(float64))
	if _, ok := roomsMap[roomSettings.Name]; ok {
		rm := ResponeMessage{Respone: "CreateRoom", Error: "Room exists"}
		sendToClient(c, rm)
		return
	}
	room := newRoom(roomSettings)
	room.boardData.BoardSettings.BoardSize = int(data.(map[string]interface{})["boardSize"].(float64))
	room.boardData.BoardSettings.Difficulty = int(data.(map[string]interface{})["difficulty"].(float64))
	roomsMap[roomSettings.Name] = room
	// delete client from lobby and add to current room
	r := roomsMap["lobby"]
	delete(r.clients, c)
	c.room = room
	room.clients[c] = true
	go room.run()
	rm := ResponeMessage{Respone: "CreateRoom", Payload: room.roomSettings}
	sendToClient(c, rm)
	updatedRoomMulticast(room)
	stateRm := ResponeMessage{Respone: "IsAdmin"}
	sendToClient(c, stateRm)
	stateRm = ResponeMessage{Respone: "InWaitingRoom"}
	sendToClient(c, stateRm)
	// if it is singleplayer game
	if room.roomSettings.MaxPlayers == 1 {
		startGame(data, userUuid)
	}
	lobbyBroadcast()
}

// Edit room with given parameters
func editRoom(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	room := roomsMap[c.room.roomSettings.Name]
	if room.gameOn {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Room can't be edited during the game"}
		sendToClient(c, rm)
		return
	}
	roomSettings := RoomSettings{}
	roomSettings.Name = data.(map[string]interface{})["name"].(string)
	roomSettings.Password = data.(map[string]interface{})["password"].(string)
	roomSettings.Admin = userUuid.(string)
	roomSettings.MaxPlayers = int(data.(map[string]interface{})["maxPlayers"].(float64))
	roomSettings.IsPrivate = data.(map[string]interface{})["isPrivate"].(bool)
	roomSettings.TimeLimit = int(data.(map[string]interface{})["timeLimit"].(float64))
	if room.roomSettings.Name != roomSettings.Name {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Wrong room name"}
		sendToClient(c, rm)
		return
	}
	if room.roomSettings.Admin != c.uuid {
		rm := ResponeMessage{Respone: "EditRoom", Error: "Client must be admin to edit room"}
		sendToClient(c, rm)
		return
	}
	room.roomSettings = roomSettings
	room.boardData.BoardSettings.BoardSize = int(data.(map[string]interface{})["boardSize"].(float64))
	room.boardData.BoardSettings.Difficulty = int(data.(map[string]interface{})["difficulty"].(float64))
	rm := ResponeMessage{Respone: "EditRoom", Payload: roomSettings}
	sendToClient(c, rm)
	updatedRoomMulticast(room)
	lobbyBroadcast()
}

// Moves clients from room to lobby and removes the room
func deleteRoom(roomName string, userUuid interface{}) {
	room, ok := roomsMap[roomName]
	if !ok {
		rm := ResponeMessage{Respone: "deleteRoom", Error: "Room does not exist"}
		sendToClient(clientsMap[userUuid.(string)], rm)
		return
	}
	lobby := roomsMap["lobby"]
	if userUuid.(string) != room.roomSettings.Admin {
		rm := ResponeMessage{Respone: "deleteRoom", Error: "User is not admin"}
		sendToClient(clientsMap[userUuid.(string)], rm)
		return
	}
	for client := range room.clients {
		client.room = lobby
		lobby.clients[client] = true
		stateRm := ResponeMessage{Respone: "ExitWaitingRoom"}
		sendToClient(client, stateRm)
	}
	delete(roomsMap, room.roomSettings.Name)
	stateRm := ResponeMessage{Respone: "ExitAdmin"}
	sendToClient(clientsMap[userUuid.(string)], stateRm)
	lobbyBroadcast()
}

// moves client to given room
func changeRoom(data interface{}, userUuid interface{}) {
	roomName := data.(map[string]interface{})["roomName"].(string)
	roomPassword := data.(map[string]interface{})["password"].(string)
	c := clientsMap[userUuid.(string)]
	if c.room.roomSettings.Name == roomName {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Client already is in this room"}
		sendToClient(c, rm)
		return
	}
	if c.room.roomSettings.Name != "lobby" && roomName != "lobby" {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Client must be in lobby to enter to the room"}
		sendToClient(c, rm)
		return
	}
	oldRoom := c.room
	var oldRoomExist bool = true
	newRoom, ok := roomsMap[roomName]
	if !ok {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Room does not exist"}
		sendToClient(c, rm)
		return
	}
	if newRoom.roomSettings.Password != roomPassword {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Wrong password"}
		sendToClient(c, rm)
		return
	}
	if len(newRoom.clients) == newRoom.roomSettings.MaxPlayers {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Max players in room"}
		sendToClient(c, rm)
		return
	}
	if newRoom.gameOn {
		rm := ResponeMessage{Respone: "changeRoom", Error: "Room has an active game"}
		sendToClient(c, rm)
		return
	}
	delete(oldRoom.clients, c)
	newRoom.clients[c] = true
	c.room = newRoom
	if oldRoom.roomSettings.Admin == c.uuid {
		oldRoomExist = changeAdmin(oldRoom.roomSettings.Name, c.uuid)
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
func changeAdmin(roomName string, userUuid interface{}) bool {
	room := roomsMap[roomName]
	if userUuid.(string) != room.roomSettings.Admin {
		rm := ResponeMessage{Respone: "changeAdmin", Error: "User is not admin"}
		sendToClient(clientsMap[userUuid.(string)], rm)
		return true
	}
	oldAdmin := clientsMap[userUuid.(string)]
	if len(room.clients) == 0 {
		deleteRoom(roomName, userUuid)
		return false
	}
	for client := range room.clients {
		if client.uuid == oldAdmin.uuid {
			continue
		}
		room.roomSettings.Admin = client.uuid
		break
	}
	stateRm := ResponeMessage{Respone: "ExitAdmin"}
	sendToClient(oldAdmin, stateRm)
	stateRm = ResponeMessage{Respone: "IsAdmin"}
	sendToClient(clientsMap[room.roomSettings.Admin], stateRm)
	return true
}

// kick user from room to lobby
func kickUser(data interface{}, userUuid interface{}) {
	userToKick := data.(map[string]interface{})["userToKick"].(string)
	c := clientsMap[userUuid.(string)]
	r := c.room
	if c.uuid != r.roomSettings.Admin {
		rm := ResponeMessage{Respone: "kickUser", Error: "Only admin can kick users"}
		sendToClient(c, rm)
		return
	}
	for _, client := range clientsMap {
		if client.name == userToKick && client.room.roomSettings.Name == r.roomSettings.Name {
			kick := ClientKick{RoomName: "lobby",
				Password: ""}
			info, _ := json.MarshalIndent(kick, "", "  ")
			var payload map[string]interface{}
			_ = json.Unmarshal(info, &payload)
			changeRoom(payload, client.uuid)
			rm := ResponeMessage{Respone: "kickUser", Error: "You have been kicked from the room"}
			sendToClient(client, rm)
			return
		}
	}
	rm := ResponeMessage{Respone: "kickUser", Error: "Wrong user name"}
	sendToClient(c, rm)
}

// Send given json to all clients in given room
func roomBroadcast(room *Room, rm ResponeMessage) {
	j, _ := json.MarshalIndent(rm, "", "  ")
	for client := range room.clients {
		select {
		case client.send <- j:
		default:
			close(client.send)
			delete(room.clients, client)
		}
	}
}

// Send given json to given client
func sendToClient(client *Client, rm ResponeMessage) {
	j, _ := json.MarshalIndent(rm, "", "  ")
	select {
	case client.send <- j:
	default:
		close(client.send)
		delete(client.room.clients, client)
	}
}

// Message with informations about room and players in room
func updatedRoomMulticast(room *Room) {
	var roomJson RoomForMulticast
	var structTable []ClientIdData
	for _, val := range clientsMap {
		if val.room == room {
			structTable = append(structTable, ClientIdData{val.uuid, val.name})
		}
	}
	roomJson.Name = room.roomSettings.Name
	roomJson.Admin = room.roomSettings.Admin
	roomJson.Players = structTable
	roomJson.MaxPlayers = room.roomSettings.MaxPlayers
	roomJson.IsPrivate = room.roomSettings.IsPrivate
	roomJson.BoardSize = int(room.boardData.BoardSize)
	roomJson.Difficulty = int(room.boardData.Difficulty)
	roomJson.GameOn = room.gameOn
	rm := ResponeMessage{Respone: "UpdateRoom", Payload: roomJson}
	roomBroadcast(room, rm)
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
				delete(r.clients, client)
				if client.room.roomSettings.Admin == client.uuid && client.room.roomSettings.Name != "lobby" {
					changeAdmin(client.room.roomSettings.Name, client.uuid)
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
			// this allows us to read json with action and user fields and arbitrary data
			var payload map[string]interface{}
			err := json.Unmarshal(message[1], &payload)
			if err != nil {
				log.Print("Error during Unmarshal(): ", err)
				rm := ResponeMessage{Respone: "Error", Error: err.Error()}
				sendToClient(clientsMap[cid.Uuid], rm)
				break
			}
			// check if user uuid from frontend is valid
			if cid.Uuid != payload["userUuid"] {
				rm := ResponeMessage{Respone: "Error", Error: "Wrong user uuid"}
				sendToClient(clientsMap[cid.Uuid], rm)
				break
			}
			switch payload["action"] {
			case "createRoom":
				addRoom(payload["data"], payload["userUuid"])
			case "generateBoard":
				createBoard(payload["data"], payload["userUuid"])
			case "changeRoom":
				changeRoom(payload["data"], payload["userUuid"])
			case "deleteRoom":
				deleteRoom(payload["data"].(map[string]interface{})["roomName"].(string), payload["userUuid"])
			case "editRoom":
				editRoom(payload["data"], payload["userUuid"])
			case "changeName":
				changeName(payload["data"], payload["userUuid"])
			case "startGame":
				startGame(payload["data"], payload["userUuid"])
			case "checkBoard":
				checkBoard(payload["data"], payload["userUuid"])
			case "finishGame":
				userFinished(payload["data"], payload["userUuid"])
			case "kickUser":
				kickUser(payload["data"], payload["userUuid"])
			default:
				rm := ResponeMessage{Respone: "Error", Error: "Wrong response"}
				sendToClient(clientsMap[cid.Uuid], rm)
			}
		}
	}
}
