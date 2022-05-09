import { Typography } from "@mui/material";
import { HouseSvg } from "../svg/VectorGraphics";

const RoomNameDisplay = ({ value }: { value: String }) => {

    return (
        <>
            <HouseSvg />
            <Typography noWrap>{value}</Typography>
        </>
    )
}

export default RoomNameDisplay;