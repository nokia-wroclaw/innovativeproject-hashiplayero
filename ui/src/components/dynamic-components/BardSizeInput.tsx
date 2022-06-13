import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

const BoardInput = ({
  value,
  handleChange,
  isAdmin,
}: {
  value: Number;
  handleChange: any;
  isAdmin: boolean;
}) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="boardSizeLabel">Board size</InputLabel>
        <Select
          disabled={!isAdmin}
          labelId="boardSizeLabelId"
          id="boardSizeInput"
          value={value}
          label="Boardsize"
          onChange={handleChange}
        >
          <MenuItem value={7}>Small</MenuItem>
          <MenuItem value={10}>Medium</MenuItem>
          <MenuItem value={15}>Large</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default BoardInput;
