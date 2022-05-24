import { forwardRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { TextField, Button, DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog } from '@mui/material';


import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const DialogInput = ({ password, handlePassword, isPrivate, handleClick }: { password: String, handlePassword: any, isPrivate: boolean, handleClick: any }) => {

  const [open, setOpen] = useState(false);

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md');

  const handleClickOpen = () => {
    if (isPrivate) {
      handleClick(true);
      setOpen(true);
    }
  };

  const handleClose = () => {
    handleClick(false);
    setOpen(false);
  };

  return (
    <>
      <Button color='secondary' onClick={handleClickOpen} sx={{ width: "100%" }}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Join</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogInput;