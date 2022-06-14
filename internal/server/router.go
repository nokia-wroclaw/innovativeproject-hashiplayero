package server

import (
	"log"
	"net/http"
	"strings"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var roomsMap = make(map[string]*Room)
var clientsMap = make(map[string]*Client)

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	lobby := newRoom(RoomSettings{Name: "lobby"})
	roomsMap["lobby"] = lobby
	go lobby.run()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://hashiplayero.pl", "https://www.hashiplayero.pl"},
		AllowMethods:     []string{"OPTIONS", "GET", "POST"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	// Define the rice box with the frontend client static files.
	appBox, err := rice.FindBox("../../ui/build")
	if err != nil {
		log.Fatal(err)
	}

	router.GET("/*any", func(c *gin.Context) {
		any := c.Param("any")
		log.Print(any)
		if any == "/ws/" {
			serveWs(lobby, c.Writer, c.Request)
		} else if any == "/" || strings.HasPrefix(any, "/static/") {
			gin.WrapH(http.FileServer(appBox.HTTPBox()))(c)
		} else {
			c.Redirect(http.StatusMovedPermanently, "/")
		}
	})

	return router
}
