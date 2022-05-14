package server

import (
	"innovativeproject-hashiplayero/hashi"
	"time"
)

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

type UserGameState struct {
	InGame      bool   `json:"inGame"`
	Correct     bool   `json:"correct"`
	TimeStart   string `json:"timeStart"`
	SolvingTime int    `json:"solvingTime"` // in seconds
}

type UserGameData struct {
	Uuid          string `json:"uuid"`
	UserGameState UserGameState
}

// Creates board with given parameters and adds it to given room, returns json with boardData
func createBoard(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	room := roomsMap[c.room.roomSettings.Name]
	if data.(map[string]interface{})["difficulty"] != nil {
		room.boardData.BoardSettings.Difficulty = int(data.(map[string]interface{})["difficulty"].(float64))
	}
	size := room.boardData.BoardSettings.BoardSize
	if data.(map[string]interface{})["boardSize"] != nil {
		size = int(data.(map[string]interface{})["boardSize"].(float64))
	}
	board := hashi.GenerateBoard(size, size, int((size*size)/2), 0.5)
	boardArray := make([]int, size*size)
	for i, n := range board.Nodes {
		boardArray[i] = n.Bridges
	}
	room.boardData.Array = boardArray
	rm := ResponeMessage{Respone: "CreateBoard", Payload: room.boardData}
	roomBroadcast(room, rm)
}

func startGame(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	roomName := c.room.roomSettings.Name
	r := roomsMap[roomName]
	if r.gameOn {
		rm := ResponeMessage{Respone: "startGame", Error: "Game already is started"}
		sendToClient(c, rm)
		return
	}
	if roomName != r.roomSettings.Name {
		rm := ResponeMessage{Respone: "startGame", Error: "Wrong room name"}
		sendToClient(c, rm)
		return
	}
	if c.uuid != r.roomSettings.Admin {
		rm := ResponeMessage{Respone: "startGame", Error: "Only admin can start game"}
		sendToClient(c, rm)
		return
	}
	current_time := time.Now().Format(time.RFC1123)
	r.gameData = make(map[string]UserGameState)
	for client := range r.clients {
		r.gameData[client.uuid] = UserGameState{
			InGame:    true,
			Correct:   false,
			TimeStart: current_time,
		}
	}
	r.gameOn = true
	createBoard(data, userUuid)
	updatedRoomMulticast(r)
	updatedGameMulticast(r)
	lobbyBroadcast()
	if r.roomSettings.MaxPlayers == 1 {
		stateRm := ResponeMessage{Respone: "InSingleGame"}
		sendToClient(c, stateRm)
	} else {
		stateRm := ResponeMessage{Respone: "InMultiGame"}
		roomBroadcast(r, stateRm)
	}
}

// Return true if board is solved
func michalcheck() bool {
	return true
}

// Check if player's solution is good and change appropriate data
func checkBoard(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	r := roomsMap[c.room.roomSettings.Name]
	//moves := data.(map[string]interface{})["moves"]
	if michalcheck() {
		userGameState := r.gameData[c.uuid]
		userGameState.Correct = true
		timeStart, _ := time.Parse(time.RFC1123, userGameState.TimeStart)
		current_time := time.Now()
		diff := current_time.Sub(timeStart)
		userGameState.SolvingTime = int(diff.Seconds())
		r.gameData[c.uuid] = userGameState
		updatedGameMulticast(r)
	}
}

// Move client to waiting room
func userFinished(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	r := roomsMap[c.room.roomSettings.Name]
	if r.roomSettings.Name != data.(map[string]interface{})["name"].(string) {
		rm := ResponeMessage{Respone: "finishGame", Error: "Wrong room name"}
		sendToClient(c, rm)
		return
	}
	userGameState := r.gameData[c.uuid]
	userGameState.InGame = false
	r.gameData[c.uuid] = userGameState
	// TODO front może chcieć żeby tutaj wysłać informacje o pokoju dla danego gracza
	// ale mają o tym jeszcze porozmawiać
	stateRm := ResponeMessage{Respone: "InWaitingRoom"}
	sendToClient(c, stateRm)
	// check if game should be finished
	finished := true
	for client := range r.clients {
		if r.gameData[client.uuid].InGame {
			finished = false
		}
	}
	if finished {
		finishGame(r)
	} else {
		updatedGameMulticast(r)
	}
}

// Clear game data
func finishGame(r *Room) {
	r.gameData = nil
	r.boardData.Array = nil
	r.gameOn = false
	updatedRoomMulticast(r)
	lobbyBroadcast()
}

// Cancel game and clear game data
/*
func cancelGame() {
	finishGame()
	return
}
*/
// Message with informations about room and players in room
func updatedGameMulticast(room *Room) {
	var userGameData UserGameData
	var structTable []UserGameData
	for uuid, gameData := range room.gameData {
		userGameData.Uuid = uuid
		userGameData.UserGameState = gameData
		structTable = append(structTable, userGameData)
	}
	rm := ResponeMessage{Respone: "UpdateGameData", Payload: structTable}
	roomBroadcast(room, rm)
}
