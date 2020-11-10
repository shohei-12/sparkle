import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SignUp } from "./templates";
import "./assets/style.css";

const App: React.FC = () => {
  return (
    <Router>
      <main>
        <Switch>
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
