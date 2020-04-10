import React, { Component } from 'react';
import {
  Navbar, 
  NavItem,
  Button,
  Nav,
  Form
} from 'react-bootstrap';
import socket from '../../socket';

class FoldButton extends Component {


 
 handleClick(e) {
    e.preventDefault();
    var actionpackage = {gameid:this.props.gameid,
                        hash:this.props.my_id,
                        action:'fold'};
    socket.emit('incomingAction',actionpackage);
 }



    render() { 
        return (
        <div>
            <Button className='actionItem' onClick={this.handleClick.bind(this)}>Fold</Button>
        </div> );
        }

       
    


}
 
export default FoldButton;