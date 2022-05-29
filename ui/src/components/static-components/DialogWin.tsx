import React, { useEffect, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";

import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";

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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Win"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            YOU WIN!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Thats cool
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DialogWin;
