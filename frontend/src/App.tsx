import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DrawerMenu } from "./components/Drawer";
import FlashMessage from "./components/FlashMessage";
import Router from "./Router";
import "./assets/style.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      padding: "80px 10px 0",
      [theme.breakpoints.up("md")]: {
        padding: "80px 10px 0 250px",
      },
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <DrawerMenu />
      <main className={classes.main}>
        <FlashMessage />
        <Router />
      </main>
    </>
  );
};

export default App;
