package hashi


import "testing"

const Impossible Difficulty = -1

type TestCase struct {
    difficulty Difficulty
    encodedBoard string
}

var testCases = []TestCase{
    {Easy, "3x1:1-1"},
    {Easy, "5x1:1-2-1"},
    {Easy, "5x1:1-3-2"},
    {Easy, "5x1:2-4-2"},
    {Easy, "5x3:1-5-2-------2--"},
    {Easy, "5x3:2-6-2-------2--"},
    {Easy, "5x3:3-5-2-----1-1--"},
    {Normal, "5x5:2---1-----4-2-4-----3---2"},
    {Normal, "5x5:3-2-1-----4---2-----4---2"},
    {Hard, "5x5:4-4-1---------1-----2-2-2"},
    {Hard, "5x5:2---2------1--4-----2---3"},
    {Hard, "5x5:2-2-1------------1--2---2"},
    {Hard, "5x5:2-2-2-----5---3-----3--1-"},
    {Hard, "7x7:---1-2-2-1-------1-3--------2--2-3--------1----2-"},
    {Hard, "7x7:-------4--3-2--1-------------3-2-4-2-------1-1-3-"},
    {Impossible, "5x5:1-2-------2-6-1-----1-4-1"},
    {Impossible, "7x7:2--3-2--------3--4-1---------2-7--2-------2--6-2-"},
    {Impossible, "7x7:-3----1------------------3-2--------4--5-2-------"},
}

func (tc TestCase) shouldSolveAt(difficulty Difficulty) bool {
    return 0 <= tc.difficulty && tc.difficulty <= difficulty
}

func TestSolverEasy(t *testing.T) {
    for i, tc := range testCases {
        b := BoardDecode(tc.encodedBoard)

        if b.SolveEasy(true) != tc.shouldSolveAt(Easy) {
            t.Fatalf(
                "Easy solver test didn't pass on board %d (%s)\n%s",
                i, tc.encodedBoard, b.Render(),
            )
        }
    }
}

func TestSolverNormal(t *testing.T) {
    for i, tc := range testCases {
        b := BoardDecode(tc.encodedBoard)

        if b.SolveNormal(true) != tc.shouldSolveAt(Normal) {
            t.Fatalf(
                "Normal solver test didn't pass on board %d (%s)\n%s",
                i, tc.encodedBoard, b.Render(),
            )
        }
    }
}

func TestSolverHard(t *testing.T) {
    for i, tc := range testCases {
        b := BoardDecode(tc.encodedBoard)

        if b.SolveHard(true) != tc.shouldSolveAt(Hard) {
            t.Fatalf(
                "Hard solver test didn't pass on board %d (%s)\n%s",
                i, tc.encodedBoard, b.Render(),
            )
        }
    }
}
