import React from "react";
import { Switch, Route } from "react-router-dom";
import { SignIn, SignUp } from "./templates";
import Auth from "./Auth";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Auth></Auth>
    </Switch>
  );
};

export default Router;
