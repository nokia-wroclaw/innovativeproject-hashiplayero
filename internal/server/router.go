package server

import (
	"encoding/json"
	"fmt"
	"innovativeproject-hashiplayero/hashi"
	"log"
	"net/http"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type BoardSize int

var j []byte

// TODO trzeba się zastanowić czy klucz ma być stringiem czy intem
var roomsData = make(map[string]RoomJson)

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
	Difficulty `json:"difficulty"`
	BoardSize  `json:"size"`
}

type BoardData struct {
	BoardSettings `json:"settings"`
	Array         []int `json:"array"`
}

type RoomJson struct {
	IdPokoju         string   `json:"idPokoju"`
	NazwaPokoju      string   `json:"nazwaPokoju"`
	Prywatny         string   `json:"prywatny"`
	LimitCzasNaPokoj int      `json:"limitCzasNaPokoj"`
	HasloDostepu     string   `json:"hasloDostepu"`
	Czlonkowie       []string `json:"czlonkowie"`
	LimitCzlonkow    int      `json:"limitCzlonkow"`
	Rozmiar          int      `json:"rozmiar"`
}

func HandleBoardData(c *gin.Context) {
	bs := BoardSettings{}
	err := c.BindJSON(&bs)
	if err != nil {
		text := fmt.Sprintf("Failed to read user data from request: %s", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": text})
	} else {
		board := hashi.GenerateBoard(int(bs.BoardSize), int(bs.BoardSize), int(bs.BoardSize/2), 0.5)
		boardArray := make([]int, bs.BoardSize*bs.BoardSize)
		for i, n := range board.Nodes {
			boardArray[i] = n.Bridges
		}
		bd := BoardData{bs, boardArray}
		c.JSON(http.StatusOK, bd)
	}
}

func addRoom(message []byte, mt int) []byte {
	var roomJson RoomJson
	json.Unmarshal([]byte(message), &roomJson)
	//TODO dodać funkcjonalność automatycznego dodawania indeksów
	roomsData[roomJson.IdPokoju] = roomJson
	j, _ = json.MarshalIndent(roomsData, "", "  ")
	return j
}

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	defaultRoom := newRoom()
	go defaultRoom.run()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"OPTIONS", "GET", "POST"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	// Define the rice box with the frontend client static files.
	appBox, err := rice.FindBox("../../ui/build")
	if err != nil {
		log.Fatal(err)
	}

	// Create API route group
	api := router.Group("/api")
	api.POST("/puzzle", HandleBoardData)

	// Create the websocket route group
	ws := router.Group("/ws")
	ws.GET("/", func(c *gin.Context) {
		serveWs(defaultRoom, c.Writer, c.Request)
	})

	router.GET("/static/", gin.WrapH(http.FileServer(appBox.HTTPBox())))

	router.Use(gin.WrapH(http.FileServer(appBox.HTTPBox())))

	return router
}
