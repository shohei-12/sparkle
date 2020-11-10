import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DrawerMenu } from "./components/Drawer";
import { SignUp } from "./templates";
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
    <Router>
      <DrawerMenu />
      <main className={classes.main}>
        <Switch>
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
