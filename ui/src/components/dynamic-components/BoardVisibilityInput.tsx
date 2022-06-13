import LockIcon from "@mui/icons-material/Lock";
import ExtensionIcon from '@mui/icons-material/Extension';
import Checkbox from "@mui/material/Checkbox";

const BoardVisibilityInput = ({
  value,
  handleChange,
}: {
  value: boolean;
  handleChange: any;
}) => {
  return (
    <>
      {value ? "New game" : "Play saved board"}
      <Checkbox
        checked={value}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
        icon={<ExtensionIcon />}
        checkedIcon={<ExtensionIcon />}
      />
    </>
  );
};

export default BoardVisibilityInput;
