import React, { Component } from "react";
import "./Home.css";
import {Button} from 'react-bootstrap';
import socket from "../socket";

class Home extends Component{


 handleClick(e) {
  e.preventDefault();

  socket.emit('createGame', 'nodata');

  socket.on('createGame',gameid => {
    this.props.history.push('/table/'+gameid);
  })

}

render() {
  return (
    <div className="Home">
      <div className="lander">
        <h1>Neighborhood</h1>
        <p>Play game with friends even when they're not in the neighborhood.</p>
      </div>
      <Button block bssize="large" onClick={this.handleClick.bind(this)}>Start a Texas Hold'em Table</Button>
    </div>
  );
}
}

export default Home