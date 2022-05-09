import { GridOn } from "@mui/icons-material"
import { Typography } from "@mui/material"

const BoardDisplay = ({ value }: { value: Number }) => {

    return (
        <>
            <GridOn />
            {
                value === 7 ? <Typography noWrap>Small size</Typography> : value === 15 ? <Typography noWrap>Large size</Typography> : <Typography noWrap>Normal size</Typography>
            }
        </>
    )
}

export default BoardDisplay