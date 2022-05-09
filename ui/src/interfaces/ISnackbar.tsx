import { AlertColor } from "@mui/material";

export interface ISnackbar {
    open: boolean;
    message: String;
    severity: AlertColor;
}
