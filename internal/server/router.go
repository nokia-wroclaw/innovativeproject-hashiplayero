package server

import (
	"log"
	"net/http"

	"innovativeproject-hashiplayero/hashi"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
)

type Puzzle struct {
	Seed int     `json:"seed"`
	Grid [][]int `json:"puzzle"`
}

func PuzzleFromBoard(b hashi.Board) Puzzle {
	p := Puzzle{}

	p.Grid = make([][]int, b.Height)
	for y := range p.Grid {
		p.Grid[y] = make([]int, b.Width)
		for x := range p.Grid[y] {
			p.Grid[y][x] = b.Nodes[y*b.Width+x].Bridges
		}
	}

	return p
}

func getBoard(c *gin.Context) {
	board := hashi.GenerateBoard(9, 11, 25, 0.5)
	p := PuzzleFromBoard(board)
	c.JSON(http.StatusOK, p)
}

// https://stackoverflow.com/a/29439630/17240808
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()

	// Define the rice box with the frontend client static files.
	appBox, err := rice.FindBox("../../ui/build")
	if err != nil {
		log.Fatal(err)
	}

	// Create API route group
	api := router.Group("/api")
	api.Use(CORSMiddleware())
	api.GET("/puzzle", getBoard)

	router.GET("/static/", gin.WrapH(http.FileServer(appBox.HTTPBox())))

	router.Use(gin.WrapH(http.FileServer(appBox.HTTPBox())))

	return router
}
