package hashi

import (
    "fmt"
    "strings"
    "strconv"
    "math/rand"
)

type Difficulty int

const (
	Easy Difficulty = iota
	Normal
	Hard
)

type BoardItem interface {
    Render() string
    getCount() int
    setCount(int) int
}

type EmptyItem struct {}

func (ei *EmptyItem) Render() string {
    return " "
}

func (ei *EmptyItem) getCount() int {
    return 0
}

func (ei *EmptyItem) setCount(count int) int {
    return 0
}

type BridgeItem struct {
    vertical bool
    count int
}

func (bi *BridgeItem) Render() string {
    if bi.vertical && bi.count == 1 {
        return "|"
    } else if bi.vertical && bi.count == 2 {
        return "‖"
    } else if !bi.vertical && bi.count == 1 {
        return "-"
    } else if !bi.vertical && bi.count == 2 {
        return "="
    } else {
        return "?"
    }
}

func (bi *BridgeItem) getCount() int {
    return bi.count
}

func (bi *BridgeItem) setCount(count int) int {
    bi.count = count
    return bi.count
}

type IslandItem struct {
    count int
    used int
}

func (ii *IslandItem) Render() string {
    return string(rune(48 + ii.count))
}

func (ii *IslandItem) getCount() int {
    return ii.count
}

func (ii *IslandItem) setCount(count int) int {
    ii.count = count
    return ii.count
}

type Board struct {
    Width int
    Height int
    Items []BoardItem
    IslandLocs []int
    Bridges [][2]int
}

func (b *Board) GetCrossSection(loc int) []int {
    crossSection := []int{}

    rowStart := loc / b.Width * b.Width

    west: for i := loc - 1; i >= rowStart; i-- {
        switch b.Items[i].(type) {
        case *EmptyItem:
            crossSection = append(crossSection, i)
        default:
            break west
        }
    }

    east: for i := loc + 1; i < rowStart + b.Width; i++ {
        switch b.Items[i].(type) {
        case *EmptyItem:
            crossSection = append(crossSection, i)
        default:
            break east
        }
    }

    north: for i := loc - b.Width; i >= loc - rowStart; i -= b.Width {
        switch b.Items[i].(type) {
        case *EmptyItem:
            crossSection = append(crossSection, i)
        default:
            break north
        }
    }

    south: for i := loc + b.Width; i < len(b.Items); i += b.Width {
        switch b.Items[i].(type) {
        case *EmptyItem:
            crossSection = append(crossSection, i)
        default:
            break south
        }
    }

    return crossSection
}

func getRandomItem(items []int) int {
    r := rand.Intn(len(items))
    return items[r]
}

func (b *Board) FindValidNode() (int, int) {
    for tries := 0; tries < 1000; tries++ {
        fromLoc := getRandomItem(b.IslandLocs)
        possibleLocations := b.GetCrossSection(fromLoc)

        i := 0
        for _, loc := range possibleLocations {
            if loc < len(b.Items) - 1 {
                if _, ok := b.Items[loc + 1].(*EmptyItem); !ok {
                    continue
                }
            }
            if (loc >= 1) {
                if _, ok := b.Items[loc - 1].(*EmptyItem); !ok {
                    continue
                }
            }
            if (loc < len(b.Items) - b.Width) {
                if _, ok := b.Items[loc + b.Width].(*EmptyItem); !ok {
                    continue
                }
            }
            if (loc >= b.Width) {
                if _, ok := b.Items[loc - b.Width].(*EmptyItem); !ok {
                    continue
                }
            }

            possibleLocations[i] = loc
            i++
        }
        possibleLocations = possibleLocations[:i]

        if (len(possibleLocations) != 0) {
            return fromLoc, getRandomItem(possibleLocations)
        }
    }

    return -1, -1
}

func (b *Board) ConnectBridges(from, to, count int) {
    b.Items[from].setCount(b.Items[from].getCount() + count)
    b.Items[to].setCount(b.Items[to].getCount() + count)

    b.Bridges = append(b.Bridges, [2]int{from, to})
    if count == 2 {
        b.Bridges = append(b.Bridges, [2]int{from, to})
    }

    smaller, bigger := from, to
    if smaller > bigger {
        smaller, bigger = bigger, smaller
    }

    vertical := bigger - smaller > b.Width
    var step int
    if vertical {
      step = b.Width
    } else {
      step = 1
    }

    smaller += step
    for smaller < bigger {
        switch b.Items[smaller].(type) {
            case *BridgeItem:
                b.Items[smaller].setCount(b.Items[smaller].getCount() + count)
            case *EmptyItem:
                b.Items[smaller] = &BridgeItem {vertical, count}
            default:
        }
        smaller += step
    }
}

func (b *Board) AddNewNode(twoBridgesChance float32) bool {
    from, to := b.FindValidNode()

    if from == -1 || to == -1 { return false }

    var bridgeCount int
    if rand.Float32() < twoBridgesChance {
        bridgeCount = 2
    } else {
        bridgeCount = 1
    }

    b.Items[to] = &IslandItem{0, 0}
    b.IslandLocs = append(b.IslandLocs, to)

    b.ConnectBridges(from, to, bridgeCount)

    return true
}

func GenerateBoard(width, height int, noNodes int, twoBridgesChance float32, difficulty Difficulty) Board {
    var board Board

    generateLoop: for {
        board = NewBoard(width, height)
        start := rand.Intn(len(board.Items))
        board.Items[start] = &IslandItem{0, 0};
        board.IslandLocs = append(board.IslandLocs, start)

        for board.AddNewNode(twoBridgesChance) && len(board.IslandLocs) <= noNodes {}

        // check if too easy
        switch difficulty {
        case Normal:
            if board.SolveEasy(true) {
                continue generateLoop
            }
        case Hard:
            if board.SolveNormal(true) {
                continue generateLoop
            }
        }

        // check if solvable at all
        switch difficulty {
        case Easy:
            if board.SolveEasy(true) {
                break generateLoop
            }
        case Normal:
            if board.SolveNormal(true) {
                break generateLoop
            }
        default:
            break generateLoop
        }
    }

    return board
}

func (b *Board) Render() string {
    ret := ""

    for y := 0; y < b.Height; y++ {
        for x := 0; x < b.Width; x++ {
            ret += b.Items[y * b.Width + x].Render() + " "
        }
        ret += "\n"
    }

    return ret
}

func (b *Board) Encode() string {
    ret := fmt.Sprintf("%dx%d:", b.Width, b.Height)

    for _, item := range b.Items {
        switch item.(type) {
        case *IslandItem:
            ret += strconv.Itoa(item.getCount())
        default:
            ret += "-"
        }
    }

    return ret
}

func BoardDecode(code string) Board {
    sizeAndItems := strings.Split(code, ":")

    widthAndHeight := strings.Split(sizeAndItems[0], "x")

    width, err := strconv.Atoi(widthAndHeight[0])
    height, err := strconv.Atoi(widthAndHeight[1])

    _ = err

    b := NewBoard(width, height)

    for y := 0; y < b.Height; y++ {
        for x := 0; x < b.Width; x++ {
            c := string(sizeAndItems[1][y * b.Width + x])
            if c == "-" {
                b.Items[y * b.Width + x] = &EmptyItem{}
            } else if bridges, err := strconv.Atoi(c); err == nil {
                b.Items[y * b.Width + x] = &IslandItem {bridges, 0}
            }
        }
    }
    return b
}

func (b *Board) Export() []int {
    exportArr := make([]int, len(b.Items))
    for loc, item := range b.Items {
        switch item.(type) {
        case *IslandItem:
            exportArr[loc] = item.getCount()
        default:
            exportArr[loc] = 0
        }
    }

    return exportArr
}

func NewBoard(width, height int) Board {
    ret := Board{}
    ret.Width = width
    ret.Height = height

    ret.Items = make([]BoardItem, width * height)

    for y := 0; y < height; y++ {
        for x := 0; x < width; x++ {
            ret.Items[y * width + x] = &EmptyItem{}
        }
    }

    return ret
}
