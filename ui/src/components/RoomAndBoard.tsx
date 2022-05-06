export interface RoomAndBoard {
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

export interface DefaultRoomAndBoard {
  roomAndBoard: RoomAndBoard;
}

export interface CreateBoard {
  array: [];
  settings: {
    difficulty: number;
    size: number;
  };
}

export interface CreateRoom {
  admin: string;
  isPrivate: boolean;
  maxPlayers: number;
  name: string;
  password: string;
  timeLimit: number;
}
