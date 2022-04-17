interface SingleGameData {
    difficulty: number;
    boardSize: number;
    timeLimit: number;
    seed: string;
    board: number[];
    boardResult: number[];
}

export default SingleGameData;