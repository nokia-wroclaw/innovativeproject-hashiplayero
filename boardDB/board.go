package boardDB

import (
	"innovativeproject-hashiplayero/hashi"
)

type Board struct {
	ID    int64
	Board string
	hashi.Difficulty
	Size int
}
