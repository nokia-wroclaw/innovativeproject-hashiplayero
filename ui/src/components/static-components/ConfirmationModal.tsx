import { useEffect, useState, forwardRef } from "react";

import {
  Slide,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationModal = ({
  open,
  setOpen,
  setKick,
}: {
  open: boolean;
  setOpen: any;
  setKick: any;
}) => {
  const [openDialog, setOpenDialog] = useState(open);
  const fullWidth = false;
  const maxWidth = "md";

  useEffect(() => {
    if (open) {
      setOpenDialog(true);
    }
  }, [open]);

  const handleClose = () => {
    setOpenDialog(false);
    setOpen(false);
    setKick(false);
  };

  const handleAgree = () => {
    setKick(true);
    setOpenDialog(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to do this?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you kick this user, they will be able to come back if they know
            the password. To make sure they won't, we advice to change the
            password as well.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgree}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
