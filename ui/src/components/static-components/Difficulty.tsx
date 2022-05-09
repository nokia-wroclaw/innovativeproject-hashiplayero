import { Analytics } from "@mui/icons-material";
import { Typography } from "@mui/material"

const DifficultyDisplay = ({ value }: { value: Number }) => {

    return (
        <>
            <Analytics />
            {
                value === 1 ? <Typography noWrap>Easy</Typography> : value === 2 ? <Typography noWrap>Medium</Typography> : <Typography noWrap>Hard</Typography>
            }
        </>
    );
}

export default DifficultyDisplay;