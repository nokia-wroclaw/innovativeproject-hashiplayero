import IMember from "../interfaces/IMember";
import { IGameData } from "../interfaces/IRoomAndBoard";
import Player from "./Player";

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

  return (
    <>
      <div className="player-list">
        {players.map((player: IMember) => {
          return (
            <Player
              key={player.uuid}
              player={player}
              userGameData={sendCorrectInGameDataUser(player.uuid)}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlayerList;
