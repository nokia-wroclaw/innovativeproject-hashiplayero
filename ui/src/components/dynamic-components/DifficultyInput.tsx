import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

const DifficultyInput = ({
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
        <InputLabel id="difficultyLabel">Difficulty</InputLabel>
        <Select
          disabled={!isAdmin}
          labelId="difficultyLabelId"
          id="difficultyInput"
          value={value}
          label="Difficulty"
          onChange={handleChange}
        >
          <MenuItem value={0}>Easy</MenuItem>
          <MenuItem value={1}>Normal</MenuItem>
          <MenuItem value={2}>Hard</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default DifficultyInput;
