import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const defaultTheme = createTheme();

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h3: {
      fontSize: "3rem",
      [defaultTheme.breakpoints.down("sm")]: {
        fontSize: "1.5rem",
      },
    },
    h6: {
      fontSize: "1.25rem",
      [defaultTheme.breakpoints.down("sm")]: {
        fontSize: "1.rem",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        button: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#FFF",
          textDecoration: "none",
        },
      },
    },
  },
});

export default theme;
