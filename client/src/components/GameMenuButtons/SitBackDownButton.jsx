import React, { Component } from 'react';
import {
  Button
} from 'react-bootstrap';
import socket from '../../socket';

class SitDownAgain extends Component {
    constructor() {
        super();
       
  }


 
 handleCheck(e) {
    e.preventDefault();


    console.log('sit back down');

    socket.emit('sitBackDown', {gameid:this.props.gameid,hash:this.props.my_id});
 }



    render() { 
       
        return (
        <div>
                <Button className='mb-2' variant='success' onClick={this.handleCheck.bind(this)} >
                    Sit back down
                </Button>       
     </div> );

    
    }
}
 
export default SitDownAgain;