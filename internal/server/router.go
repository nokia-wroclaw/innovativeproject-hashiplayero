package server

import (
	"log"
	"net/http"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Puzzle struct {
	Seed int     `json:"seed"`
	Grid [][]int `json:"puzzle"`
}

func getBoard(c *gin.Context) {
	p := Puzzle{Seed: 12345678, Grid: [][]int{{0, 0, 0, 0, 0}, {0, 0, 0, 0, 0}, {0, 0, 0, 0, 0}, {0, 0, 0, 0, 0}, {0, 0, 0, 0, 0}}}
	c.JSON(http.StatusOK, p)
}

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()

	// Define the rice box with the frontend client static files.
	appBox, err := rice.FindBox("../../ui/hashiplayero/build")
	if err != nil {
		log.Fatal(err)
	}

	// Create API route group
	api := router.Group("/api")
	{
		api.GET("/puzzle", getBoard)
	}

	router.GET("/static/", gin.WrapH(http.FileServer(appBox.HTTPBox())))

	router.Use(static.Serve("/", static.LocalFile("./../../ui/hashiplayero/build", true)))

	return router
}
