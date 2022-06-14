package main

import (
	"innovativeproject-hashiplayero/internal/server"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	server.Start()
}
