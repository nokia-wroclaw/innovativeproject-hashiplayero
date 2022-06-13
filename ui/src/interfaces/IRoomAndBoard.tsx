import playerStatus from "./PlayerStatus";

export interface IRoomAndBoard {
  name: string;
  boardID: number;
  maxPlayers: number;
  isPrivate: boolean;
  password: string;
  timeLimit: number;
  members: [];
  admin: string;
  array: [];
  gameOn: boolean;
  settings: {
    difficulty: number;
    size: number;
  };
  gameData: IGameData[];
  bridges: Bridge[];
}

export interface IDefaultRoomAndBoard {
  roomAndBoard: IRoomAndBoard;
}

export interface ICreateBoard {
  array: [];
  boardID: number;
  settings: {
    difficulty: number;
    size: number;
  };
}

export interface ICreateRoom {
  admin: string;
  isPrivate: boolean;
  maxPlayers: number;
  name: string;
  password: string;
  timeLimit: number;
  boardID: number;
}

export interface IGameData {
  uuid: string;
  UserGameState: IUserGameState;
}

export interface IUserGameState {
  correct: boolean;
  inGame: boolean;
  solvingTime: number;
  timeStart: string;
}

export interface Bridge {
  nodeFrom: number;
  nodeTo: number;
  value: number;
}

export interface IGameDataWithStatus {
  uuid: string;
  status: playerStatus;
  UserGameState: IUserGameState;
}
