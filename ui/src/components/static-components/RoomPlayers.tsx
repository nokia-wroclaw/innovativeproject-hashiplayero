import { PeopleAlt } from "@mui/icons-material";


const RoomPlatersDisplay = ({ players, maxPlayers }: { players: Number, maxPlayers: Number }) => {
    return (
        <>
            <PeopleAlt />
            {players}/{maxPlayers}
        </>
    )
}

export default RoomPlatersDisplay;