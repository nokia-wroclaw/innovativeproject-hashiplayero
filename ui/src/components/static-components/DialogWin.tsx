import React, { forwardRef, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";

import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Slide,
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

const DialogWin = ({
  open,
  handleSetOpenWinClose,
  setOpenWinDialog,
}: {
  open: boolean;
  handleSetOpenWinClose: any;
  setOpenWinDialog: any;
}) => {
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps["maxWidth"]>("md");

  const handleClose = () => {
    handleSetOpenWinClose();
    setOpenWinDialog(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-win"
        aria-describedby="alert-win-description"
        TransitionComponent={Transition}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-win-title" sx={{
          display: "flex",
          justifyContent: "center"
        }}>{"You won!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-windescription">
            Congratulations! You can definately now call your self a true gamer. That's surely a great accomplishment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            That's cool I guess?
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DialogWin;
