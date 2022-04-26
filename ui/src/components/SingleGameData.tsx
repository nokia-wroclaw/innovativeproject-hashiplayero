interface SingleGameData {
    difficulty: number;
    boardSize: number;
    timeLimit: number | null;
    seed: string;
    board: number[];
    boardResult: number[];
}

export default SingleGameData;