interface ISingleGameData {
  difficulty: number;
  boardSize: number;
  timeLimit: number | null;
  seed: string;
  board: number[];
  boardResult: number[];
}

export default ISingleGameData;
