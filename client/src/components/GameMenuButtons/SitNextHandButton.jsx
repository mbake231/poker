import React, { Component } from 'react';
import {
  ToggleButton
} from 'react-bootstrap';
import socket from '../../socket';

class SitNextHandButton extends Component {
    constructor() {
        super();
        this.state = {
            isChecked:false
        };
  }


    componentDidMount(){

    }
 
 handleCheck() {
   // e.preventDefault();


    console.log('check');

    socket.emit('toggleSitOut', {gameid:this.props.gameid,hash:this.props.my_id});
    this.setState({isChecked:!this.state.isChecked});
 }



    render() { 
        return (
        <div>
                <ToggleButton variant='warning' type="checkbox" defaultChecked value="1" onChange={this.handleCheck.bind(this)} checked={this.state.isChecked}>
                    Sit next hand
                </ToggleButton>       
     </div> );
    }
}
 
export default SitNextHandButton;