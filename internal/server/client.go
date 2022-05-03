package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func hash(s string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}

type Client struct {
	uuid string
	name string
	room *Room
	conn *websocket.Conn
	send chan []byte
}

type ClientIdData struct {
	Uuid string `json:"uuid"`
	Name string `json:"name"`
}

// Create new client, generate uuid and name for him
func NewClient(room *Room, conn *websocket.Conn, send chan []byte) *Client {
	uuid := strings.Replace(uuid.New().String(), "-", "", -1)
	name := "guest" + fmt.Sprint(hash(uuid))
	return &Client{
		uuid: uuid,
		name: name,
		room: room,
		conn: conn,
		send: make(chan []byte, 256),
	}
}

func changeName(data interface{}, userUuid interface{}) {
	c := clientsMap[userUuid.(string)]
	c.name = data.(map[string]interface{})["newName"].(string)
	cid := ClientIdData{Uuid: c.uuid, Name: c.name}
	rm := ResponeMessage{Respone: "ChangeName", Payload: cid}
	sendToClient(c, rm)
	if c.room.roomSettings.Name != "lobby" {
		updatedRoomBroadcast(c.room)
	}
}

func (c *Client) readPump() {
	defer func() {
		c.room.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		// send ClientIdData and message
		cid := ClientIdData{Uuid: c.uuid}
		j, _ := json.MarshalIndent(cid, "", "  ")
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		messageArray := [][]byte{j, message}
		c.room.broadcast <- messageArray
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			c.conn.WriteMessage(websocket.TextMessage, message)
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// Upgrade connection to websocket and register client in room
func serveWs(lobby *Room, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := NewClient(lobby, conn, make(chan []byte, 256))
	clientsMap[client.uuid] = client
	client.room.register <- client

	go client.writePump()
	go client.readPump()
}
