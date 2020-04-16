import React, { Component } from "react";
import "./Home_v1.css";
import {Button} from 'react-bootstrap';
import socket from "../socket";

class Home extends Component{


 handleClick(e) {
  e.preventDefault();
  
 // 

 // socket.on('createGame',gameid => {
    this.props.history.push('/table/createTable');
 // })

}

render() {
  return (
    <div className="Home">
      <div className="lander">
        <h1>Play Online Poker, but with Friends</h1>
        <p>Start a table and invite friends, even if they're miles away.</p>
      </div>
      <Button className='homeBtn' block bssize="large" onClick={this.handleClick.bind(this)}>Start a Texas Hold'em Table</Button>
    </div>
  );
}
}

export default Home