import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { ISnackbar } from "../../interfaces/ISnackbar";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbar = ({
  snackbar,
  setSnackbar,
}: {
  snackbar: ISnackbar;
  setSnackbar: any;
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({ open: false, message: "" });
  };

  return (
    <Snackbar
      className="snackbar"
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
export default CustomizedSnackbar;
