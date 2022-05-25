package hashi

func traverse(node int, graph [][]int, visited []bool) {
    visited[node] = true
    for _, neighbor := range graph[node] {
        if !visited[neighbor] {
            traverse(neighbor, graph, visited)
        }
    }
}

func CheckSolution(board []int, bridges [][2]int) bool {
    if len(bridges) == 0 {
        return false
    }

    graph := make([][]int, len(board))

    for _, bridge := range bridges {
        v1 := bridge[0]
        v2 := bridge[1]

        graph[v1] = append(graph[v1], v2)
        graph[v2] = append(graph[v2], v1)
    }

    visited := make([]bool, len(board))
    traverse(bridges[0][0], graph, visited)

    for island, count := range board {
        if count > 0 && !visited[island] || len(graph[island]) != count {
            return false
        }
    }

    return true
}
