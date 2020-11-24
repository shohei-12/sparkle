import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  DailyRecord,
  SignIn,
  SignUp,
  UserDetails,
  UserEdit,
} from "./templates";
import Auth from "./Auth";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Auth>
        <Route exact path="/daily-record" component={DailyRecord} />
        <Route exact path="/user/details" component={UserDetails} />
        <Route exact path="/user/edit" component={UserEdit} />
      </Auth>
    </Switch>
  );
};

export default Router;
