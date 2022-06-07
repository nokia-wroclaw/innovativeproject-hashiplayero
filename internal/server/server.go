package server

import (
	"database/sql"
	"innovativeproject-hashiplayero/boardDB"
	"log"
	"os"

	// To connect to an SQLite database using the mattn/go-sqlite3 driver, it is necessary to register it as the database/sql driver.
	_ "github.com/mattn/go-sqlite3"
)

const fileName = "sqlite.db"

var boardsDB *boardDB.SQLiteRepository

func Start() {
	router := setRouter()

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8080"
	}

	// We want to run the program with a fresh instance each time, so this deletes the old database file if it exists.
	os.Remove(fileName)

	// Function registers the driver in the database/sql interface under the name sqlite3.
	// Using the sql.Open() function with the registered sqlite3 driver name, we connect to a new SQLite database.
	// The second argument is the data source name which in the case of SQLite is a path to the database file.
	db, err := sql.Open("sqlite3", fileName)
	if err != nil {
		log.Fatal(err)
	}

	boardsDB = boardDB.NewSQLiteRepository(db)
	if err := boardsDB.Migrate(); err != nil {
		log.Fatal(err)
	}

	router.Run(":" + port)
}
