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
  Slide,
  IconButton,
  Box
} from "@mui/material";

import CancelIcon from '@mui/icons-material/Cancel';

import { TransitionProps } from "@mui/material/transitions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomizedSnackbar from "../static-components/SnackBar";
import { ISnackbar } from "../../interfaces/ISnackbar";

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

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setName(user.name);
  }, [user, open])

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
    if (name.length === 0) {
      setSnackbar({
        message: "Name cannot be empty!",
        open: true,
        severity: "error",
      });
      return;
    }
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

  const handleClearName = () => {
    setName("");
  };

  const handleMouseDownName = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop:"12px", alignContent:"center" }}>
            <IconButton
              aria-label="clear name"
              onClick={handleClearName}
              onMouseDown={handleMouseDownName}
              sx={{ mr: 1, my: 0.5 }}
            >
              <CancelIcon />
            </IconButton>
            <TextField id="input-name" label="My new shiny name!" variant="standard" 
            inputProps={{ pattern: '^[a-zA-Z0-9_.-]*$' }}
            value={name}
            onChange={handleSetName}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChangeName}>Change</Button>
        </DialogActions>
      </Dialog>
      <>
      {snackbar.open ? (
        <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </>
    </>
  );
};

export default DialogChangeName;
