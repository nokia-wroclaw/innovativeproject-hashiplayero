import { Analytics } from "@mui/icons-material";
import { Typography } from "@mui/material"

const DifficultyDisplay = ({ value }: { value: Number }) => {

    return (
        <>
            <Analytics />
            {
                value === 0 ? <Typography noWrap>Easy</Typography> : value === 1 ? <Typography noWrap>Normal</Typography> : <Typography noWrap>Hard</Typography>
            }
        </>
    );
}

export default DifficultyDisplay;