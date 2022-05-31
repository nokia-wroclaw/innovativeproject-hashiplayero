import IMember from "../interfaces/IMember";
import { IGameData } from "../interfaces/IRoomAndBoard";
import Player from "./Player";
import playerStatus from "../interfaces/PlayerStatus";

const PlayerList = ({
  players,
  gameData,
}: {
  players: IMember[];
  gameData: IGameData[];
}) => {
  function sendCorrectInGameDataUser(userUuid: string): IGameData | undefined {
    return gameData.find((elem: IGameData) => elem.uuid === userUuid);
  };

  function assignPlayerToStatus(gameData: IGameData[]): playerStatus {

    gameData.forEach((data: IGameData) => {

    });

    return playerStatus.none;
  }

  return (
    <>
      <div className="player-list">
        {players.map((player: IMember) => {
          return (
            <Player
              key={player.uuid}
              player={player}
              userGameData={sendCorrectInGameDataUser(player.uuid)}
              state={playerStatus.none}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlayerList;
