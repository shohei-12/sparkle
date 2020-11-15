import React from "react";
import { Switch, Route } from "react-router-dom";
import { SignUp } from "./templates";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
    </Switch>
  );
};

export default Router;
