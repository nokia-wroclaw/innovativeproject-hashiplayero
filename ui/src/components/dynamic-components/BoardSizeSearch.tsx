import { Groups } from "@mui/icons-material";
import { MenuItem, FormControl, InputLabel } from "@mui/material";

import Select from "@mui/material/Select";

const PlayersNumberSearch = ({
  value,
  handleChange,
}: {
  value: String;
  handleChange: any;
}) => {
  return (
    <>
      <Groups />
      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 120, paddingBottom: "16px" }}
        size="small"
      >
        <InputLabel id="PlayersNumberSearchLabel">Number of people</InputLabel>
        <Select
          labelId="PlayersNumberSearchLabelId"
          id="PlayersNumberSearchLabel"
          value={value}
          label="PlayersNumber"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={7}>Small</MenuItem>
          <MenuItem value={10}>Medium</MenuItem>
          <MenuItem value={15}>Large</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default PlayersNumberSearch;
