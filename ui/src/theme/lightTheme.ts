import { createTheme } from "@mui/material";

const primaryColor = "#5452E4";
const primaryColorHover = "#403eb4";

const secondaryColor = "#7081A6";
const secondaryColorHover = "#374157";

const primaryBackgroundColor = "#FFFFFF";

const primarySvgColor = "#9ca9c3";

const lightTheme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides:{
                root:{
                    backgroundColor: primaryBackgroundColor,
                    color: primaryColor,
                    border: "none",
                    boxShadow: "none",
                    padding: "0px 20px",
                }
            }

        },  
        MuiButton: {
            styleOverrides:{
                root:{
                    padding: "8px 24px",
                    transition: "all 0.3s ease",
                },
                textPrimary:{
                        color: secondaryColor,
                    '&:hover': {
                        backgroundColor: primaryColorHover,
                        color: primaryBackgroundColor,
                        // scale: "1.1",
                        transition: "all 0.5s ease",
                    }

                },
                textSecondary:{
                    backgroundColor: primaryColor,
                    color: primaryBackgroundColor,
                    '&:hover': {
                        backgroundColor: secondaryColorHover,
                        color: primaryBackgroundColor,
                        // scale: "1.05",
                        transition: "all 0.5s ease",
                    }

                }
            }
        }, 
        MuiFormControl:{
            styleOverrides:{
                root:{
                    width: "100%",
                    padding: "0px",
                }
            }
        },
        MuiSvgIcon:{
            styleOverrides:{
                root:{
                    color: primarySvgColor,
                }
            }
        },
        MuiAlert: {
            styleOverrides:{
                root:{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }
            }
        },
    }
});

export default lightTheme;