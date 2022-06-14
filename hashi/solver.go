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

	for i := 0; i < count; i++ {
		b.Bridges = append(b.Bridges, [2]int{from, to})
	}

	smaller, bigger := from, to
	if smaller > bigger {
		smaller, bigger = bigger, smaller
	}

	vertical := bigger-smaller > b.Width
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
			b.Items[smaller] = &BridgeItem{vertical, count}
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
west:
	for i := loc - 1; i >= rowStart; i-- {
		if _, ok := b.Items[i].(*IslandItem); ok {
			islandLoc = i
			break west
		}
	}

	if islandLoc != -1 {
		possibles = append(possibles, islandLoc)
	}

	islandLoc = -1
east:
	for i := loc + 1; i < rowStart+b.Width; i++ {
		if _, ok := b.Items[i].(*IslandItem); ok {
			islandLoc = i
			break east
		}
	}

	if islandLoc != -1 {
		possibles = append(possibles, islandLoc)
	}

	islandLoc = -1
north:
	for i := loc - b.Width; i >= loc-rowStart; i -= b.Width {
		if _, ok := b.Items[i].(*IslandItem); ok {
			islandLoc = i
			break north
		}
	}

	if islandLoc != -1 {
		possibles = append(possibles, islandLoc)
	}

	islandLoc = -1
south:
	for i := loc + b.Width; i < len(b.Items); i += b.Width {
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

func (b *Board) countBannedBridgesBetween(from, to int) int {
	fromTo := [2]int{from, to}
	toFrom := [2]int{to, from}

	count := 0
	for _, bridge := range b.BannedBridges {
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

	// they block as if they were there
	bannedBridgesBetween := b.countBannedBridgesBetween(from, to)

	bridgeSpaceTaken := bridgesBetween + bannedBridgesBetween

	if bridgeSpaceTaken == 2 || bothCanFit == 0 {
		return 0
	} else if bridgeSpaceTaken == 0 && bothCanFit == 2 {
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

func (b *Board) banBridge(from, to int) {
	b.BannedBridges = append(b.BannedBridges, [2]int{from, to})
}

func (b *Board) revertLastNBridges(n int) {
	bridgesToRevert := b.Bridges[len(b.Bridges)-n:]
	b.Bridges = b.Bridges[:len(b.Bridges)-n]

	for _, bridge := range bridgesToRevert {
		smaller, bigger := bridge[0], bridge[1]

		b.Items[smaller].(*IslandItem).used -= 1
		b.Items[bigger].(*IslandItem).used -= 1

		if smaller > bigger {
			smaller, bigger = bigger, smaller
		}

		vertical := bigger-smaller > b.Width
		var step int
		if vertical {
			step = b.Width
		} else {
			step = 1
		}

		smaller += step
		for smaller < bigger {
			item := b.Items[smaller].(*BridgeItem)
			if c := item.getCount(); c > 1 {
				item.setCount(c - 1)
			} else {
				b.Items[smaller] = &EmptyItem{}
			}
			smaller += step
		}
	}
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
		if l2p%2 == 0 && len(neighbours) == l2p/2 {
			bridgesToFlood = 2
		} else if l2p%2 == 1 && len(neighbours) == (l2p+1)/2 {
			bridgesToFlood = 1
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

// checks if last bridge created an isolated group
func (b *Board) checkIsolatedGroups() bool {
	graph := make([][]int, len(b.Items))

	for _, bridge := range b.Bridges {
		v1 := bridge[0]
		v2 := bridge[1]

		graph[v1] = append(graph[v1], v2)
		graph[v2] = append(graph[v2], v1)
	}

	lastBridge := b.Bridges[len(b.Bridges)-1]

	visited := make([]bool, len(b.Items))
	traverse(lastBridge[0], graph, visited)

	for _, loc := range b.IslandLocs {
		// if there is an island in that group, that isn't yet finished,
		// then it means that group is not disjoint yet
		if visited[loc] && len(graph[loc]) != b.Items[loc].getCount() {
			return false
		}
	}

	// maybe we created one final group of all islands
	for _, loc := range b.IslandLocs {
		count := b.Items[loc].getCount()
		if count > 0 && !visited[loc] || len(graph[loc]) != count {
			return true
		}
	}

	return false
}

func (b *Board) checkImpossibleIslands() bool {
	for _, loc := range b.IslandLocs {
		required := b.Items[loc].(*IslandItem).count
		used := b.Items[loc].(*IslandItem).used
		possible := b.possibleBridges(loc)
		if used+possible < required {
			return true
		}
	}

	return false
}

func (b *Board) solveHardStep1() bool {
	didSmth := false
	for _, loc := range b.IslandLocs {
		l2p := b.leftToPlace(loc)

		if l2p == 0 {
			continue
		}

	neighbourLoop:
		for _, nloc := range b.getPossibleNeighbours(loc) {
			spc := b.possibleBridgesBetween(loc, nloc)
			if spc == 0 {
				continue neighbourLoop
			}

			areWeBanningBridges := false
			bridgesToRevert := 0

			// at most two iterations for 1 and 2 bridges
		bridgeLoop:
			for nBridges := 1; nBridges <= spc; nBridges++ {
				b.placeBridges(loc, nloc, 1)
				bridgesToRevert = nBridges

				anyIsolatedSubgroups := b.checkIsolatedGroups()
				anyImpossibleIslands := b.checkImpossibleIslands()

				if anyIsolatedSubgroups || anyImpossibleIslands {
					areWeBanningBridges = true
					break bridgeLoop
				}
			}
			b.revertLastNBridges(bridgesToRevert)

			if areWeBanningBridges {
				b.banBridge(loc, nloc)
				didSmth = true
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

func (b *Board) SolveHard(clear bool) bool {
	if clear {
		b.Clear()
	}

	didSmth := true
	for didSmth {
		didSmth = false

		if b.SolveNormal(false) {
			return true
		}

		for b.solveHardStep1() {
			didSmth = true
		}
	}

	return CheckSolution(b.Export(), b.Bridges)
}
