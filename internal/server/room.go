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
	broadcast    chan []byte
	register     chan *Client
	unregister   chan *Client
}

type RoomSettings struct {
	Name       string `json:"name"`
	Password   string `json:"password"`
	MaxPlayers int    `json:"maxPlayers"`
	IsPrivate  bool   `json:"isPrivate"`
	TimeLimit  int    `json:"timeLimit"`
}

type RoomForBroadcast struct {
	Name       string `json:"name"`
	NumPlayers int    `json:"numPlayers"`
	MaxPlayers int    `json:"maxPlayers"`
	IsPrivate  bool   `json:"isPrivate"`
	BoardSize  int    `json:"boardSize"`
	Difficulty int    `json:"difficulty"`
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
		broadcast:    make(chan []byte),
		register:     make(chan *Client),
		unregister:   make(chan *Client),
		clients:      make(map[*Client]bool),
	}
}

// Creates room with given parameters and adds client to it
func addRoom(data interface{}, userUuid interface{}) {
	var j []byte
	roomSettings := RoomSettings{}
	roomSettings.Name = data.(map[string]interface{})["name"].(string)
	roomSettings.Password = data.(map[string]interface{})["password"].(string)
	roomSettings.MaxPlayers = int(data.(map[string]interface{})["maxPlayers"].(float64))
	roomSettings.IsPrivate = data.(map[string]interface{})["isPrivate"].(bool)
	roomSettings.TimeLimit = int(data.(map[string]interface{})["timeLimit"].(float64))
	room := newRoom(roomSettings)
	roomsMap[roomSettings.Name] = room
	// delete client from lobby and add to current room
	c := clientsMap[userUuid.(string)]
	r := roomsMap["lobby"]
	delete(r.clients, c)
	c.room = room
	room.clients[c] = true
	go room.run()
	j, _ = json.MarshalIndent(room.roomSettings, "", "  ")
	createBoard(data)
	roomBroadcast(room, j)
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
	j, _ := json.MarshalIndent(room.boardData, "", "  ")
	roomBroadcast(room, j)
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

func updatedRoomBroadcast(room *Room) {
	var roomJson RoomForBroadcast
	roomJson.Name = room.roomSettings.Name
	roomJson.NumPlayers = len(room.clients)
	roomJson.MaxPlayers = room.roomSettings.MaxPlayers
	roomJson.IsPrivate = room.roomSettings.IsPrivate
	roomJson.BoardSize = int(room.boardData.BoardSize)
	roomJson.Difficulty = int(room.boardData.Difficulty)
	j, _ := json.MarshalIndent(roomJson, "", "  ")
	roomBroadcast(room, j)
}

// Send update about rooms to clients in lobby
func lobbyBroadcast() {
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
	j, _ := json.MarshalIndent(structTable, "", "  ")
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

func (r *Room) run() {
	for {
		select {
		// when client wants to join this room
		case client := <-r.register:
			j, _ := json.MarshalIndent(ClientIdData{Uuid: client.uuid, Name: client.name}, "", "  ")
			client.send <- j
			r.clients[client] = true
		// when client wants to quit this room
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				delete(r.clients, client)
				if client.room != roomsMap["lobby"] {
					updatedRoomBroadcast(client.room)
				}
				lobbyBroadcast()
				close(client.send)
			}
		// when client will get the message
		case message := <-r.broadcast:
			// this allows us to read json with action and user fields and arbitrary data
			var payload map[string]interface{}
			err := json.Unmarshal(message, &payload)
			if err != nil {
				log.Fatal("Error during Unmarshal(): ", err)
			}
			switch payload["action"] {
			case "createRoom":
				addRoom(payload["data"], payload["userUuid"])
				lobbyBroadcast()
			case "generateBoard":
				createBoard(payload["data"])
			}
		}
	}
}
