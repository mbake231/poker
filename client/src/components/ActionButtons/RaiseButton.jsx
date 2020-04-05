import React, { Component } from 'react';
import {
  Navbar, 
  NavItem,
  Button,
  Nav
} from 'react-bootstrap';
import socket from '../../socket';

class RaiseButton extends Component {


 
 handleClick(e) {
    e.preventDefault();
    var actionpackage = {gameid:this.props.gameid,
                        hash:this.props.my_id,
                        action:'raise',
                        amt:10};
    socket.emit('incomingAction',actionpackage);
 }



    render() { 
        return (
        <div>
            <Button onClick={this.handleClick.bind(this)}>Raise</Button>
        </div> );
    }
}
 
export default RaiseButton;