package boardDB

// https://gosamples.dev/sqlite-intro/
// File where we define an SQLiteRepository struct that will interact with the SQLite database

import (
	"database/sql"
	"errors"

	"github.com/mattn/go-sqlite3"
)

// Define errors that can be returned by methods of this repository
var (
	ErrInvalidId    = errors.New("invalid updated ID")
	ErrDuplicate    = errors.New("record already exists")
	ErrNotExists    = errors.New("row not exists")
	ErrUpdateFailed = errors.New("update failed")
	ErrDeleteFailed = errors.New("delete failed")
)

// Define the SQLiteRepository struct and its constructor. It requires an instance of sql.DB type as a dependency.
// The sql.DB is an object representing a pool of DB connections for all drivers compatible with the database/sql interface.
type SQLiteRepository struct {
	db *sql.DB
}

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository {
	return &SQLiteRepository{
		db: db,
	}
}

// Migration is creating an SQL table and initializing all the data necessary to operate on the repository.
// When working on a fresh database instance, this function should be called first, before reading or writing data through the repository.
func (r *SQLiteRepository) Migrate() error {

	// Executes the CREATE TABLE SQL query using DB.Exec() method and returns the error
	query := `
    CREATE TABLE IF NOT EXISTS boards(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board TEXT NOT NULL UNIQUE,
        difficulty INTEGER NOT NULL,
        size INTEGER NOT NULL
    );
    `

	_, err := r.db.Exec(query)
	return err
}

// Method, takes a row to create and returns the row after insertion or an error if the operation fails.
func (r *SQLiteRepository) Create(board Board) (*Board, error) {
	res, err := r.db.Exec("INSERT INTO boards(board, difficulty, size) values(?,?,?)", board.Board, board.Difficulty, board.Size)
	if err != nil {
		var sqliteErr sqlite3.Error
		if errors.As(err, &sqliteErr) {
			if errors.Is(sqliteErr.ExtendedCode, sqlite3.ErrConstraintUnique) {
				return nil, ErrDuplicate
			}
		}
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	board.ID = id

	return &board, nil
}

// Method returns all avaliable board records from database or an error if the operation fails.
func (r *SQLiteRepository) GetAll() ([]Board, error) {
	rows, err := r.db.Query("SELECT * FROM boards")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var all []Board
	for rows.Next() {
		var board Board
		if err := rows.Scan(&board.ID, &board.Board, &board.Difficulty, &board.Size); err != nil {
			return nil, err
		}
		all = append(all, board)
	}
	return all, nil
}

// Method takes id and returns matching row or an error if the operation fails.
func (r *SQLiteRepository) GetById(id int64) (*Board, error) {
	row := r.db.QueryRow("SELECT * FROM boards WHERE id = ?", id)

	var board Board
	if err := row.Scan(&board.ID, &board.Board, &board.Difficulty, &board.Size); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotExists
		}
		return nil, err
	}
	return &board, nil
}
