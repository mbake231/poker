import Login from "./components/Login";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Table from "./containers/Table";


export default function Routes(props) {
  console.log(props);
  return (
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/table" exact render={props => <Table test={'tester'} {...props}  />} />
    </Switch>
  );
}