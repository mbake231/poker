import React, { Component } from 'react';
import {
  Button
} from 'react-bootstrap';
import socket from '../../socket';

class CallClockButton extends Component {
    constructor() {
        super();
        
  }


    componentDidMount(){

    }
 
 handleCheck(e) {
    e.preventDefault();

    socket.emit('callClock', {gameid:this.props.gameid,hash:this.props.my_id});

 }



    render() { 
        if(this.props.clockCalled==false)
        return (
        <div>
                <Button className='mb-2' variant='info' onClick={this.handleCheck.bind(this)} >
                    Call clock
                </Button>       
     </div> );

     else
         return (
        <div>
                <Button className='mb-2' variant='danger' disabled >
                    Clock is called
                </Button>       
     </div> );
    }
}
 
export default CallClockButton;