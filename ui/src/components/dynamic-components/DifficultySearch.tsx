import { GridOn } from "@mui/icons-material";
import { MenuItem, FormControl, InputLabel } from "@mui/material";

import Select from "@mui/material/Select";

const DifficultySearch = ({
  value,
  handleChange,
}: {
  value: String | String;
  handleChange: any;
}) => {
  return (
    <>
      <GridOn />
      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 120, paddingBottom: "16px" }}
        size="small"
      >
        <InputLabel id="difficultySearchLabel">Board difficulty</InputLabel>
        <Select
          labelId="difficultySearchLabelId"
          id="difficultySearch"
          value={value}
          label="Difficulty"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={0}>Easy</MenuItem>
          <MenuItem value={1}>Normal</MenuItem>
          <MenuItem value={2}>Hard</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default DifficultySearch;
