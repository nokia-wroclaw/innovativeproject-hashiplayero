export interface Room {
  name: string;
  numPlayers: number;
  maxPlayers: number;
  isPrivate: boolean;
  boardSize: number;
  difficulty: number;
}

export interface Rooms {
  rooms: Room[];
}
