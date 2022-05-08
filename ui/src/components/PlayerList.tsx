import IMember from "../interfaces/IMember";
import Player from "./Player";


const PlayerList = ({ players }: { players: IMember[] }) => {

    return (
        <>
        <div>
            List Of Players
        </div>
        <div className="header filter players">
        {
            players.map((player: IMember) => {
                return (
                    <Player key={player.uuid} player={player} />
                )
            })
        }
        </div>
        </>
    )
}

export default PlayerList;