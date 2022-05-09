import { TextField } from "@mui/material";

const NameInput = ({ value, handleChange, isAdmin }: { value: String, handleChange: any, isAdmin: boolean  }) => {

    return (
        <>
            <TextField
                disabled={!isAdmin}
                id="roomNameInput"
                type="text"
                value={value}
                variant="outlined"
                label="Room name"
                onChange={handleChange}
            />
        </>
    )
}

export default NameInput;
