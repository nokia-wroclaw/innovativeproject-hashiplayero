package server

import "os"

func Start() {
	router := setRouter()

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8080"
	}

	router.Run(":" + port)
}
