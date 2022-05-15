package server

import (
	"log"
	"net/http"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var roomsMap = make(map[string]*Room)
var clientsMap = make(map[string]*Client)

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	lobby := newRoom(RoomSettings{Name: "lobby", MaxPlayers: 1000})
	roomsMap["lobby"] = lobby
	go lobby.run()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"OPTIONS", "GET", "POST"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	// Define the rice box with the frontend client static files.
	appBox, err := rice.FindBox("../../ui/build")
	if err != nil {
		log.Fatal(err)
	}

	// Create the websocket route group
	ws := router.Group("/ws")
	ws.GET("/", func(c *gin.Context) {
		serveWs(lobby, c.Writer, c.Request)
	})

	router.GET("/static/", gin.WrapH(http.FileServer(appBox.HTTPBox())))

	router.Use(gin.WrapH(http.FileServer(appBox.HTTPBox())))

	return router
}
