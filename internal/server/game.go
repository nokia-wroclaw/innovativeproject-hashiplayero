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

type BoardSettings struct {
	BoardSize        int `json:"size"`
	hashi.Difficulty `json:"difficulty"`
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

type InboundCheckBoard struct {
	Action                string                `json:"action"`
	InboundCheckBoardData InboundCheckBoardData `json:"data"`
}

type InboundCheckBoardData struct {
	Moves [][2]int `json:"moves"`
}

// Creates board with given parameters and adds it to given room, returns json with boardData
func createBoard(c *Client, r *Room) {
	size := r.boardData.BoardSize
	difficulty := r.boardData.Difficulty
	board := hashi.GenerateBoard(size, size, int((size*size)/2), 0.5, difficulty)
	r.boardData.Array = board.Export()
	rm := ResponeMessage{Respone: "CreateBoard", Payload: r.boardData}
	roomBroadcast(r, rm)
}

func startGame(c *Client, r *Room) {
	if r.gameOn {
		rm := ResponeMessage{Respone: "startGame", Error: "Game already is started"}
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
	createBoard(c, r)
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

// Check if player's solution is good and change appropriate data
func checkBoard(icbd InboundCheckBoardData, c *Client, r *Room) {
	if hashi.CheckSolution(r.boardData.Array, icbd.Moves) {
		userGameState := r.gameData[c.uuid]
		if userGameState.Correct {
			return
		}
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
func userFinished(ird InboundRoomData, c *Client, r *Room) {
	userGameState := r.gameData[c.uuid]
	userGameState.InGame = false
	r.gameData[c.uuid] = userGameState
	stateRm := ResponeMessage{Respone: "InWaitingRoom"}
	sendToClient(c, stateRm)
	// check if game should be finished
	finished := true
	for client := range r.clients {
		if r.gameData[client.uuid].InGame {
			finished = false
		}
	}
	updatedGameMulticast(r)
	if finished {
		finishGame(r)
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

// Message with informations about room and players in room
func updatedGameMulticast(r *Room) {
	var userGameData UserGameData
	var structTable []UserGameData
	for uuid, gameData := range r.gameData {
		userGameData.Uuid = uuid
		userGameData.UserGameState = gameData
		structTable = append(structTable, userGameData)
	}
	rm := ResponeMessage{Respone: "UpdateGameData", Payload: structTable}
	roomBroadcast(r, rm)
}
