import { TextField } from "@mui/material";

const BoardIdInput = ({ value, handleChange, isAdmin }: { value: Number, handleChange: any, isAdmin: boolean }) => {

    return (
        <>
            <TextField
                required
                disabled={!isAdmin}
                id="boardIdInput"
                type="number"
                value={value}
                variant="outlined"
                label="Board ID"
                onChange={handleChange}
            />
        </>
    )
}

export default BoardIdInput;
