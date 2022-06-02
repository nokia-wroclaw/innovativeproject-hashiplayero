package puzzledb

import "innovativeproject-hashiplayero/hashi"

type Puzzle struct {
	ID    int64
	Board string
	hashi.Difficulty
	Size int
}
