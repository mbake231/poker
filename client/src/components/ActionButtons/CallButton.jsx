import React, { Component } from 'react';
import {
  Navbar, 
  NavItem,
  Button,
  Nav
} from 'react-bootstrap';
import socket from '../../socket';

class CallButton extends Component {


 
 handleClick(e) {
    e.preventDefault();
    var actionpackage = {gameid:this.props.gameid,
                        hash:this.props.my_id,
                        action:'call'};

    console.log(actionpackage);
    socket.emit('incomingAction',actionpackage);
 }



    render() { 
        return (
        <div>
            <Button className='actionItem' onClick={this.handleClick.bind(this)}>{'Call $'+(Number(this.props.toCallAmt)/100).toFixed(2)}</Button>
        </div> );
    }
}
 
export default CallButton;