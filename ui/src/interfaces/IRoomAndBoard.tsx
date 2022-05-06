export interface IRoomAndBoard {
  name: string;
  maxPlayers: number;
  isPrivate: boolean;
  password: string;
  timeLimit: number;
  members: [];
  admin: string;
  array: [];
  settings: {
    difficulty: number;
    size: number;
  };
}

export interface IDefaultRoomAndBoard {
  roomAndBoard: IRoomAndBoard;
}

export interface ICreateBoard {
  array: [];
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
}
