import IMember from "../interfaces/IMember";
import { IGameData, IGameDataWithStatus } from "../interfaces/IRoomAndBoard";
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
  }

  function assignPlayerToStatus(
    gameData: IGameData[],
    uuid: string
  ): playerStatus {
    if (gameData && gameData.length !== 0) {
      let gameDataWithStatus: IGameDataWithStatus[] = [];

      gameData.forEach((game) => {
        gameDataWithStatus.push({
          uuid: game.uuid,
          UserGameState: game.UserGameState,
          status: playerStatus.none,
        });
      });

      gameDataWithStatus.sort(
        (time1, time2) =>
          time1.UserGameState.solvingTime - time2.UserGameState.solvingTime
      );
      console.log(gameDataWithStatus);

      let resultlist = gameDataWithStatus.filter((elem) => {
        if (elem.UserGameState.solvingTime === 0) {
          return false;
        }
        return true;
      });

      const userIndex = resultlist.findIndex((obj) => obj.uuid === uuid);
      if (userIndex !== -1) {
        if (resultlist[userIndex].UserGameState.solvingTime === 0) {
          return playerStatus.none;
        } else {
          switch (userIndex) {
            case 0:
              return playerStatus.firstPlace;
            case 1:
              return playerStatus.secondPlace;
            case 2:
              return playerStatus.thirdPlace;
          }
        }
      }
    }
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
              state={assignPlayerToStatus(gameData, player.uuid)}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlayerList;
