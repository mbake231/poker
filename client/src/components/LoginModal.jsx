import React, { Component } from 'react';
import { 
  Popover,
  Tooltip,
  Modal
} from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
class LoginModal extends React.Component {
  constructor(props, context){
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
        show: false
    }
}

handleShow() {
    console.log(this.state)
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
               <Modal.Title>Login</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Login close={this.handleClose.bind(this)} login={this.props.login.bind(this)}></Login>
             </Modal.Body>
          </Modal>
        </div>
    )
  }
}
export default LoginModal