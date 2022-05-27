import { forwardRef, useEffect, useState } from "react";
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

const DialogChangeName = () => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const [open, setOpen] = useState(false);

  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps["maxWidth"]>("md");

  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(user.name);
  }, [user])

  const handleSetName = (event: any) => {
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeName",
          data: {
            newName: name,
          },
        })
      );
      console.log("WebSocket-> Change Name");
    }
    handleClose();
  };

  return (
    <>
      <Button
        color="primary"
        onClick={handleClickOpen}
        sx={{ my: 2, display: "block" }}
      >
        Change Name
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle>New Name!</DialogTitle>
        <DialogContent>
          <DialogContentText>To change name enter new name.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleSetName}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChangeName}>Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogChangeName;
