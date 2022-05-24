import { forwardRef, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import {
  TextField,
  Button,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("md");

  const [password, setPassword] = useState("");

  const handleSetPassword = (event: any) => {
    setPassword(event.target.value);
  };

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
          userUuid: user.uuid,
          data: {
            roomName: roomName,
            password: password,
          },
        })
      );
      console.log("WebSocket-> Change Room");
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
      >
        <DialogTitle>Enter the room!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This room is private. You have to enter the password to join.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleSetPassword}
            value={password}
          />
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
