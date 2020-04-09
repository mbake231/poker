import React, { Component } from 'react';
import {
  Navbar, 
  NavItem,
  Button,
  Nav,
  Form
} from 'react-bootstrap';
import socket from '../../socket';

class CallButton extends Component {

componentDidMount() {
    console.log('to call'+this.props.toCallAmt)
}

 
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
            <Button className='actionItem' onClick={this.handleClick.bind(this)}>{'Call $'+(parseInt(this.props.currentRaiseToCall-this.props.my_seat.moneyOnLine)/100).toFixed(2)}</Button>
        </div> );
        

        
    }
}
 
export default CallButton;