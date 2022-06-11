import { forwardRef, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import {
  Button,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Slide,
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

import { TransitionProps } from "@mui/material/transitions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface State {
  password: string;
  showPassword: boolean;
}

const DialogInput = ({
  isPrivate,
  handleClick,
  roomName,
}: {
  isPrivate: boolean;
  handleClick: any;
  roomName: string;
}) => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const [open, setOpen] = useState(false);

  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps["maxWidth"]>("md");

  // const [password, setPassword] = useState("");
  const [values, setValues] = useState<State>({
    password: "",
    showPassword: false,
  });

  const handleClickOpen = () => {
    if (isPrivate) {
      // handleClick(true);

      setOpen(true);
    } else {
      handleChangeRoom();
    }
  };

  const handleClose = () => {
    // handleClick(false);
    setOpen(false);
  };

  const handleChangeRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          data: {
            roomName: roomName,
            password: values.password,
          },
        })
      );
      console.log("WebSocket-> Change Room");
    }
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClearPassword = () => {
    setValues({
      ...values,
      password: "",
    });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleChangeRoom();
      setTimeout(() => {
        handleClose();
      }, 100);
    }
  };

  return (
    <>
      <Button
        color="secondary"
        onClick={handleClickOpen}
        sx={{ width: "100%" }}
      >
        JOIN
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onKeyDown={handleKeyDown}
      >
        <DialogTitle>Enter the room!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This room is private. You have to enter the password to join.
          </DialogContentText>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleSetPassword}
            value={password}
          /> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: "12px",
              alignContent: "center",
            }}
          >
            <IconButton
              aria-label="clear password "
              onClick={handleClearPassword}
              onMouseDown={handleMouseDownPassword}
              sx={{ mr: 1, my: 0.5 }}
            >
              <CancelIcon />
            </IconButton>

            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChangeRoom}>Join</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogInput;
