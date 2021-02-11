import React from "react";
import { useSelector } from "react-redux";
import {
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import { getTheme } from "./re-ducks/users/selectors";
import { Store } from "./re-ducks/store/types";
import { DrawerMenu } from "./components/Drawer";
import FlashMessage from "./components/FlashMessage";
import Router from "./Router";
import "./assets/style.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      padding: "80px 10px 40px",
      [theme.breakpoints.up("md")]: {
        padding: "80px 10px 40px 250px",
      },
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const selector = useSelector((state: Store) => state);
  const theme = getTheme(selector);

  const lightTheme = createMuiTheme({
    palette: {
      primary: {
        main: colors.blue[500],
      },
      secondary: {
        main: colors.yellow[500],
      },
      type: "light",
    },
  });

  const darkTheme = createMuiTheme({
    palette: {
      primary: {
        main: colors.blue[500],
      },
      secondary: {
        main: colors.yellow[500],
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <DrawerMenu />
      <main className={classes.main}>
        <FlashMessage />
        <Router />
      </main>
    </ThemeProvider>
  );
};

export default App;
