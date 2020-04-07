import React, { Component } from 'react';
import {
  Navbar, 
  NavItem,
  Button,
  Nav
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
        if(this.props.text=='Fold')
        return (
        <div>
            <Button className='actionItem' onClick={this.handleClick.bind(this)}>{this.props.text}</Button>
        </div> );
        else
        return (
            <div>
                <Button className='actionItem ghostBtn' onClick={this.handleClick.bind(this)}>{this.props.text}</Button>
            </div> );

    }
}
 
export default FoldButton;