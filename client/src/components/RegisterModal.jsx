import React, { Component } from 'react';
import { 
  Popover,
  Tooltip,
  Modal
} from 'react-bootstrap';
import Register from './Register';

class RegisterModal extends React.Component {
  constructor(props, context){
    super(props, context);
    this.handleRegShow = this.handleRegShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
        show: false
    }
}

handleRegShow() {
  
    this.setState({ show: true })
}
handleClose(){
    this.setState({ show: false })
}
render() {

    return (
       <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
             <Modal.Header closeButton>
               <Modal.Title>Register</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Register close={this.handleClose.bind(this)}></Register>
             </Modal.Body>
          </Modal>
        </div>
    )
  }
}
export default RegisterModal