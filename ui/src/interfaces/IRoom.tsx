export interface IRoom {
  name: string | null;
  numPlayers: number;
  maxPlayers: number;
  isPrivate: boolean;
  boardSize: number;
  difficulty: number;
}

export interface IRooms {
  rooms: IRoom[];
}
