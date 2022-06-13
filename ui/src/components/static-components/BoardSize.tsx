import { GridOn } from "@mui/icons-material";
import { Typography } from "@mui/material";

const BoardDisplay = ({ value }: { value: Number }) => {
  return (
    <>
      <GridOn />
      {value === 7 ? (
        <Typography noWrap>Small</Typography>
      ) : value === 15 ? (
        <Typography noWrap>Large</Typography>
      ) : (
        <Typography noWrap>Medium</Typography>
      )}
    </>
  );
};

export default BoardDisplay;
