import { createTheme } from "@mui/material";

const primaryColor = "#5452E4";
const primaryColorHover = "#403eb4";

const secondaryColor = "#7081A6";
const secondaryColorHover = "#374157";

const primaryBackgroundColor = "#FFFFFF";

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
                },
                textPrimary:{
                        color: secondaryColor,
                    '&:hover': {
                        backgroundColor: primaryColorHover,
                        color: primaryBackgroundColor,
                        scale: "1.1",
                        transition: "all 0.5s ease",
                    }

                },
                textSecondary:{
                    '&:hover': {
                        backgroundColor: secondaryColorHover,
                        color: primaryBackgroundColor,
                        scale: "1.1",
                        transition: "all 0.5s ease",
                    }

                }
            }

        }   
    }
});

export default lightTheme;