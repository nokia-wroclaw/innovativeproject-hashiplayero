package hashi

func (b *Board) Clear() {
    b.Bridges = [][2]int{}

    for loc, item := range b.Items {
        switch item.(type) {
            case *IslandItem:
                b.Items[loc] = &IslandItem{item.getCount(), 0}
            case *BridgeItem:
                b.Items[loc] = &EmptyItem{}
            default:
                break
        }
    }
}

func (b *Board) placeBridges(from, to, count int) {
    if item, ok := b.Items[from].(*IslandItem); ok {
        item.used += count
    }

    if item, ok := b.Items[to].(*IslandItem); ok {
        item.used += count
    }

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

func (b *Board) getPossibleNeighbours(loc int) []int {
    possibles := []int{}
    var islandLoc int

    rowStart := loc / b.Width * b.Width

    islandLoc = -1
    west: for i := loc - 1; i >= rowStart; i-- {
        if _, ok := b.Items[i].(*IslandItem); ok {
            islandLoc = i
            break west
        }
    }

    if islandLoc != -1 {
        possibles = append(possibles, islandLoc)
    }

    islandLoc = -1
    east: for i := loc + 1; i < rowStart + b.Width; i++ {
        if _, ok := b.Items[i].(*IslandItem); ok {
            islandLoc = i
            break east
        }
    }

    if islandLoc != -1 {
        possibles = append(possibles, islandLoc)
    }

    islandLoc = -1
    north: for i := loc - b.Width; i >= loc - rowStart; i -= b.Width {
        if _, ok := b.Items[i].(*IslandItem); ok {
            islandLoc = i
            break north
        }
    }

    if islandLoc != -1 {
        possibles = append(possibles, islandLoc)
    }

    islandLoc = -1
    south: for i := loc + b.Width; i < len(b.Items); i += b.Width {
        if _, ok := b.Items[i].(*IslandItem); ok {
            islandLoc = i
            break south
        }
    }

    if islandLoc != -1 {
        possibles = append(possibles, islandLoc)
    }

    return possibles
}

func (b *Board) leftToPlace(loc int) int {
    if island, ok := b.Items[loc].(*IslandItem); ok {
        return island.count - island.used
    }
    return 0
}

func (b *Board) countBridgesBetween(from, to int) int {
    fromTo := [2]int{from, to}
    toFrom := [2]int{to, from}

    count := 0
    for _, bridge := range b.Bridges {
        if bridge == fromTo || bridge == toFrom {
            count += 1
        }
    }

    return count
}

func (b *Board) possibleBridgesBetween(from, to int) int {
    areNeighbours := false
    for _, nloc := range b.getPossibleNeighbours(from) {
        if to == nloc {
            areNeighbours = true
            break
        }
    }
    if !areNeighbours {
        return 0
    }

    l2pFrom := b.leftToPlace(from)
    l2pTo := b.leftToPlace(to)

    bothCanFit := 2
    if l2pTo < bothCanFit {
        bothCanFit = l2pTo
    }
    if l2pFrom < bothCanFit {
        bothCanFit = l2pFrom
    }

    bridgesBetween := b.countBridgesBetween(from, to)

    if bridgesBetween == 2 || bothCanFit == 0 {
        return 0
    } else if bridgesBetween == 0 && bothCanFit == 2 {
        return 2
    } else {
        return 1
    }
}

func (b *Board) possibleBridges(loc int) int {
    count := 0
    for _, nloc := range b.getPossibleNeighbours(loc) {
        count += b.possibleBridgesBetween(loc, nloc)
    }
    return count
}

func (b *Board) solveCanFloodBridges() bool {
    didSmth := false
    for _, loc := range b.IslandLocs {
        if b.leftToPlace(loc) == 0 {
            continue
        }

        neighbours := b.getPossibleNeighbours(loc)

        l2p := b.leftToPlace(loc)

        bridgesToFlood := 0
        if l2p % 2 == 0 && len(neighbours) == l2p / 2 {
            bridgesToFlood = 2;
        } else if l2p % 2 == 1 && len(neighbours) == (l2p + 1) / 2 {
            bridgesToFlood = 1;
        }

        if bridgesToFlood > 0 {
            for _, nloc := range neighbours {
                if b.possibleBridgesBetween(loc, nloc) > 0 {
                    b.placeBridges(loc, nloc, bridgesToFlood)
                    didSmth = true
                }
            }
        }
    }

    return didSmth
}

func (b *Board) solveEqualLeftAndAvailable() bool {
    didSmth := false
    for _, loc := range b.IslandLocs {
        if b.leftToPlace(loc) == 0 {
            continue
        }

        neighbours := b.getPossibleNeighbours(loc)

        for {
            if l2p := b.leftToPlace(loc); l2p <= 0 || l2p != b.possibleBridges(loc) {
                break
            }

            for _, nloc := range neighbours {
                if count := b.possibleBridgesBetween(loc, nloc); count > 0 {
                    b.placeBridges(loc, nloc, count)
                    didSmth = true
                }
            }
        }
    }
    return didSmth
}

func (b *Board) SolveEasy(clear bool) bool {
    if clear {
        b.Clear()
    }

    didSmth := true
    for didSmth {
        didSmth = false

        for b.solveEqualLeftAndAvailable() {
            didSmth = true
        }
    }

    return CheckSolution(b.Export(), b.Bridges)
}

func (b *Board) SolveNormal(clear bool) bool {
    if clear {
        b.Clear()
    }

    didSmth := true
    for didSmth {
        didSmth = false

        if b.SolveEasy(false) {
            return true
        }

        for b.solveCanFloodBridges() {
            didSmth = true
        }
    }

    return CheckSolution(b.Export(), b.Bridges)
}
