export interface RoomAndBoard {
  name: string;
  maxPlayers: number;
  isPrivate: boolean;
  password: string;
  timeLimit: number;
  members: [];
  isAdmin: number,
  array: [];
  settings: {
    difficulty: number;
    size: number;
  };
}

export interface DefaultRoomAndBoard {
  roomAndBoard: RoomAndBoard;
}
