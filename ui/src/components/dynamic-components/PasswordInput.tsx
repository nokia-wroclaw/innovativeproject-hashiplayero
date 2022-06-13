import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";

const PasswordInput = ({
  value,
  handleChange,
  isAdmin,
}: {
  value: String;
  handleChange: any;
  isAdmin: boolean;
}) => {
  const [showPassword, setValues] = useState<Boolean>(true);

  const handleClickShowPassword = () => {
    setValues(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          disabled={!isAdmin}
          id="outlined-adornment-password"
          type={showPassword ? (isAdmin ? "text" : "password") : "password"}
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={!isAdmin}
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </>
  );
};

export default PasswordInput;
