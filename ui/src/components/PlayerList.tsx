import IMember from "../interfaces/IMember";
import Player from "./Player";


const PlayerList = ({ players }: { players: IMember[] }) => {

    return (
        <>
            <div className="form-elements-column">
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
            </div>
        </>
    )
}

export default PlayerList;