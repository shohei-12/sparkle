import React from "react";
import { Switch, Route } from "react-router-dom";
import { RecordList, SignIn, SignUp, UserDetails, UserEdit } from "./templates";
import Auth from "./Auth";
import Record from "./Record";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={RecordList} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Auth>
        <Route exact path="/record/:id/:year/:month/:day" component={Record} />
        <Route exact path="/users/:id" component={UserDetails} />
        <Route exact path="/user/edit" component={UserEdit} />
      </Auth>
    </Switch>
  );
};

export default Router;
