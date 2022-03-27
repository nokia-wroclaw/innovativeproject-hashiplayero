package hashi

import (
    "fmt"
    "strings"
    "strconv"
    "math/rand"
    "time"
)

type NodeState int

const (
    Empty NodeState = iota
    V1Bridge
    V2Bridge
    H1Bridge
    H2Bridge
    Island
)

type Node struct {
    x, y int
    Bridges int
    state NodeState
}

func (n *Node) Render() string {
    switch n.state {
    case Empty:
        return " "
    case Island:
        return string(rune(48 + n.Bridges))
    case V1Bridge:
        return "|"
    case V2Bridge:
        return "‖"
    case H1Bridge:
        return "-"
    case H2Bridge:
        return "="
    default:
        return "Go is stupid and doesn't have exhaustive switch"
    }
}

func (n *Node) RenderSimple() string {
    switch n.state {
    case Island:
        return string(rune(10111 + n.Bridges))
    default:
        return " "
    }
}

type Board struct {
    Width int
    Height int
    Nodes []Node
    IslandLocs []int
}

func (b *Board) GetCrossSection(loc int) []int {
    crossSection := []int{}

    rowStart := loc / b.Width * b.Width
    for i := loc - 1; i >= rowStart; i-- {
        if b.Nodes[i].state == Empty {
            crossSection = append(crossSection, i)
        } else {
            break
        }
    }

    for i := loc + 1; i < rowStart + b.Width; i++ {
        if b.Nodes[i].state == Empty {
            crossSection = append(crossSection, i)
        } else {
            break
        }
    }

    for i := loc - b.Width; i >= loc - rowStart; i -= b.Width {
        if b.Nodes[i].state == Empty {
            crossSection = append(crossSection, i)
        } else {
            break
        }
    }

    for i := loc + b.Width; i < len(b.Nodes); i += b.Width {
        if b.Nodes[i].state == Empty {
            crossSection = append(crossSection, i)
        } else {
            break
        }
    }

    return crossSection
}

func getRandomItem[V int | Node](items []V) V {
    r := rand.Intn(len(items))
    return items[r]
}

func (b *Board) FindValidNode() (int, int) {
    for tries := 0; tries < 1000; tries++ {
        fromLoc := getRandomItem(b.IslandLocs)
        possibleLocations := b.GetCrossSection(fromLoc)

        i := 0
        for _, loc := range possibleLocations {
            if (loc < len(b.Nodes) - 1 && b.Nodes[loc + 1].state != Empty) {
                continue
            } else if (loc >= 1 && b.Nodes[loc - 1].state != Empty) {
                continue
            } else if (loc < len(b.Nodes) - b.Width && b.Nodes[loc + b.Width].state != Empty) {
                continue
            } else if (loc >= b.Width && b.Nodes[loc - b.Width].state != Empty) {
                continue
            } else {
                possibleLocations[i] = loc
                i++
            }
        }
        possibleLocations = possibleLocations[:i]

        if (len(possibleLocations) != 0) {
            return fromLoc, getRandomItem(possibleLocations)
        }
    }

    return -1, -1
}

func (b *Board) AddNewNode(twoBridgesChance float32) bool {
    fromLoc, toLoc := b.FindValidNode()

    if fromLoc == -1 || toLoc == -1 { return false }

    fromNode, toNode := &b.Nodes[fromLoc], &b.Nodes[toLoc]

    smaller, bigger := fromLoc, toLoc
    if smaller > bigger {
        smaller, bigger = bigger, smaller
    }

    var lineWeight int
    if rand.Float32() < twoBridgesChance {
        lineWeight = 2
    } else {
        lineWeight = 1
    }

    states := [4]NodeState{V1Bridge, V2Bridge, H1Bridge, H2Bridge}
    if fromNode.x == toNode.x {
        for i := smaller + b.Width; i < bigger; i += b.Width {
            b.Nodes[i].state = states[lineWeight - 1]
        }
    } else if fromNode.y == toNode.y {
        for i := smaller + 1; i < bigger; i++ {
            b.Nodes[i].state = states[lineWeight + 1]
        }
    }

    fromNode.Bridges += lineWeight
    toNode.state = Island
    toNode.Bridges = lineWeight
    b.IslandLocs = append(b.IslandLocs, toLoc)

    return true
}

func GenerateBoard(width, height int, noNodes int, twoBridgesChance float32) Board {
    board := NewBoard(width, height)
    startNode := getRandomItem(board.Nodes)
    startLoc := startNode.y * width + startNode.x
    board.Nodes[startLoc].state = Island
    board.IslandLocs = append(board.IslandLocs, startLoc)

    for board.AddNewNode(twoBridgesChance) && len(board.IslandLocs) <= noNodes {}

    return board
}

func (b *Board) Render() string {
    ret := ""

    for y := 0; y < b.Height; y++ {
        for x := 0; x < b.Width; x++ {
            ret += b.Nodes[y * b.Width + x].RenderSimple() + " "
        }
        ret += "\n"
    }

    return ret
}

func (b *Board) Encode() string {
    ret := fmt.Sprintf("%dx%d:", b.Width, b.Height)

    for _, n := range b.Nodes {
        if (n.state == Island) {
            ret += strconv.Itoa(n.Bridges)
        } else {
            ret += "-"
        }
    }

    return ret
}

func BoardDecode(code string) Board {
    sizeAndNodes := strings.Split(code, ":")

    widthAndHeight := strings.Split(sizeAndNodes[0], "x")

    width, err := strconv.Atoi(widthAndHeight[0])
    height, err := strconv.Atoi(widthAndHeight[1])

    _ = err

    b := NewBoard(width, height)

    for y := 0; y < b.Height; y++ {
        for x := 0; x < b.Width; x++ {
            c := string(sizeAndNodes[1][y * b.Width + x])
            if c == "-" {
                b.Nodes[y * b.Width + x].state = Empty
            } else if bridges, err := strconv.Atoi(c); err == nil {
                b.Nodes[y * b.Width + x].state = Island
                b.Nodes[y * b.Width + x].Bridges = bridges
            }
        }
    }
    return b
}

func NewBoard(width, height int) Board {
    ret := Board{}
    ret.Width = width
    ret.Height = height

    ret.Nodes = make([]Node, width * height)

    for y := 0; y < height; y++ {
        for x := 0; x < width; x++ {
            ret.Nodes[y * width + x].x = x
            ret.Nodes[y * width + x].y = y
            ret.Nodes[y * width + x].state = Empty
        }
    }

    return ret
}

func main() {
    seed := time.Now().UnixNano()
    rand.Seed(seed)
    board := GenerateBoard(9, 11, 25, 0.5)

    fmt.Printf("seed %d:\n%s\n", seed, board.Render())
    fmt.Printf("%s\n", board.Encode())
}
