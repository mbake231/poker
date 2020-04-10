import React, { Component } from 'react';
import {
  Button,
  Form
} from 'react-bootstrap';
import socket from '../../socket';

class FoldButton extends Component {


 
 handleClick(e) {
    e.preventDefault();
    var actionpackage = {gameid:this.props.gameid,
                        hash:this.props.my_id,
                        action:'check'};
    socket.emit('incomingAction',actionpackage);
 }



    render() { 
        return (
        <div>
            <Button className='actionItem' variant="dark" onClick={this.handleClick.bind(this)}>{this.props.text}</Button>
        </div> );
        

    }
}
 
export default FoldButton;