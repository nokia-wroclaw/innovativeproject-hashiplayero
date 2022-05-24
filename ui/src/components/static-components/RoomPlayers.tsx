import { PeopleAlt } from "@mui/icons-material";


const RoomPlayersDisplay = ({ players, maxPlayers }: { players: Number, maxPlayers: Number }) => {
    return (
        <>
            <PeopleAlt />
            {players}/{maxPlayers}
        </>
    )
}

export default RoomPlayersDisplay;