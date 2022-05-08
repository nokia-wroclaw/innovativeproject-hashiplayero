package server

import (
	"encoding/json"
	"innovativeproject-hashiplayero/hashi"
	"log"
)

type Room struct {
	roomSettings RoomSettings
	boardData    BoardData
	clients      map[*Client]bool
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
}

type BoardSize int

const (
	SmallSize  BoardSize = 7
	MediumSize BoardSize = 10
	BigSize    BoardSize = 15
)

type Difficulty int

const (
	Easy Difficulty = iota
	Medium
	Hard
)

type BoardSettings struct {
	Difficulty int `json:"difficulty"`
	BoardSize  int `json:"size"`
}

type BoardData struct {
	BoardSettings `json:"settings"`
	Array         []int `json:"array"`
}

// Creates room with given roomSettings
func newRoom(roomSettings RoomSettings) *Room {
	return &Room{
		roomSettings: roomSettings,
		boardData:    BoardData{BoardSettings: BoardSettings{}},
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
	roomsMap[roomSettings.Name] = room
	// delete client from lobby and add to current room
	r := roomsMap["lobby"]
	delete(r.clients, c)
	c.room = room
	room.clients[c] = true
	go room.run()
	rm := ResponeMessage{Respone: "CreateRoom", Payload: room.roomSettings}
	createBoard(data)
	sendToClient(c, rm)
	updatedRoomBroadcast(room)
	lobbyBroadcast()
}

// Edit room with given parameters
func editRoom(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	room := roomsMap[c.room.roomSettings.Name]
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
	rm := ResponeMessage{Respone: "EditRoom", Payload: roomSettings}
	createBoard(data)
	sendToClient(c, rm)
	updatedRoomBroadcast(room)
	lobbyBroadcast()
}

// Creates board with given parameters and adds it to given room, returns json with boardData
func createBoard(data interface{}) {
	room := roomsMap[data.(map[string]interface{})["name"].(string)]
	room.boardData.BoardSettings.Difficulty = int(data.(map[string]interface{})["difficulty"].(float64))
	size := int(data.(map[string]interface{})["boardSize"].(float64))
	room.boardData.BoardSettings.BoardSize = size
	board := hashi.GenerateBoard(int(size), int(size), int((size*size)/2), 0.5)
	boardArray := make([]int, size*size)
	for i, n := range board.Nodes {
		boardArray[i] = n.Bridges
	}
	room.boardData.Array = boardArray
	rm := ResponeMessage{Respone: "CreateBoard", Payload: room.boardData}
	j, _ := json.MarshalIndent(rm, "", "  ")
	roomBroadcast(room, j)
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
	}
	delete(roomsMap, room.roomSettings.Name)
	lobbyBroadcast()
}

// give admin to another user in this room if exist, if not then delete room
// return false if room is deleted
func changeAdmin(roomName string, userUuid interface{}) bool {
	room := roomsMap[roomName]
	if len(room.clients) == 0 {
		deleteRoom(roomName, userUuid)
		return false
	}
	for client := range room.clients {
		if client.uuid == room.roomSettings.Admin {
			continue
		}
		room.roomSettings.Admin = client.uuid
		break
	}
	return true
}

// Send given json to all clients in given room
func roomBroadcast(room *Room, j []byte) {
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
func updatedRoomBroadcast(room *Room) {
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
	rm := ResponeMessage{Respone: "UpdateRoom", Payload: roomJson}
	j, _ := json.MarshalIndent(rm, "", "  ")
	roomBroadcast(room, j)
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
	for key, val := range roomsMap {
		if key == "lobby" {
			continue
		}
		roomJson.Name = val.roomSettings.Name
		roomJson.NumPlayers = len(val.clients)
		roomJson.MaxPlayers = val.roomSettings.MaxPlayers
		roomJson.IsPrivate = val.roomSettings.IsPrivate
		roomJson.BoardSize = int(val.boardData.BoardSize)
		roomJson.Difficulty = int(val.boardData.Difficulty)
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

// moves client to given room
func changeRoom(data interface{}, userUuid interface{}) {
	roomName := data.(map[string]interface{})["roomName"].(string)
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
	delete(oldRoom.clients, c)
	newRoom.clients[c] = true
	c.room = newRoom
	if newRoom.roomSettings.Name != "lobby" {
		updatedRoomBroadcast(newRoom)
	}
	if oldRoom.roomSettings.Admin == c.uuid {
		oldRoomExist = changeAdmin(oldRoom.roomSettings.Name, c.uuid)
	}
	if !oldRoomExist {
		// return to prevent double lobbyBroadcast because it is called in deleteRoom
		return
	} else if oldRoom.roomSettings.Name != "lobby" {
		updatedRoomBroadcast(oldRoom)
	}
	lobbyBroadcast()
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
					updatedRoomBroadcast(r)
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
				createBoard(payload["data"])
			case "changeRoom":
				changeRoom(payload["data"], payload["userUuid"])
			case "deleteRoom":
				deleteRoom(payload["data"].(map[string]interface{})["roomName"].(string), payload["userUuid"])
			case "editRoom":
				editRoom(payload["data"], payload["userUuid"])
			case "changeName":
				changeName(payload["data"], payload["userUuid"])
			default:
				rm := ResponeMessage{Respone: "Error", Error: "Wrong response"}
				sendToClient(clientsMap[cid.Uuid], rm)
			}
		}
	}
}
