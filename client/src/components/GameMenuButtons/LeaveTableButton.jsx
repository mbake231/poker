import React, { Component } from 'react';
import {
  Button
} from 'react-bootstrap';
import socket from '../../socket';

class LeaveTableButton extends Component {
    constructor() {
        super();
        this.state = {
            isLeaving:false
        };
  }


    componentDidMount(){

    }
 
 handleCheck(e) {
    e.preventDefault();


    console.log('leave');

    socket.emit('leaveTable', {gameid:this.props.gameid,hash:this.props.my_id});
    this.setState({isLeaving:!this.state.isLeaving});
 }



    render() { 
        if(this.state.isLeaving==false)
        return (
        <div>
                <Button variant='danger' onClick={this.handleCheck.bind(this)} >
                    Leave table
                </Button>       
     </div> );

     else
         return (
        <div>
                <Button variant='danger' disabled >
                    Leaving next hand
                </Button>       
     </div> );
    }
}
 
export default LeaveTableButton;