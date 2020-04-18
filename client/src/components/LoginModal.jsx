import React, { Component } from "react";
import { Popover, Tooltip, Modal, Tabs, Tab, TabList, TabPanel } from "react-bootstrap";
import Login from "./Login";
import "./Login.css";
import Register from "./Register";
import Alert from 'react-bootstrap/Alert'
class LoginModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      defaultEmail: '',
      tab: 'login',
      regSuccessShow:'ghostBtn'
    };
    this.postRegLogin=this.postRegLogin.bind(this);
    this.handleSelect=this.handleSelect.bind(this);

  }

  handleShow() {
    this.props.toggleLoginModal();
  }
  handleClose() {
    this.props.toggleLoginModal();
  }

postRegLogin(res) {
  this.setState({defaultEmail:res})
  this.setState({regSuccessShow:''});
  this.setState({tab:'login'})

}

handleSelect(key) {
  this.setState({tab:key})
}

  render() {
    return (
      <div>
        <Modal show={this.props.loginModalOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome!</Modal.Title>
          </Modal.Header>
          
          <Tabs
            defaultActiveKey="login"
            transition={false}
            id="controlled-tab-example"
            activeKey={this.state.tab}
            onSelect={this.handleSelect}
          >
            
            <Tab eventKey="login" title="Login" >
              <Modal.Body>
              <Alert className={this.state.regSuccessShow+' alertPadding'} key='reg-success' variant='success'>
    Successfully registered! Login below.
  </Alert>
                <Login
                  close={this.handleClose.bind(this)}
                  login={this.props.login.bind(this)}
                  defaultEmail={this.state.defaultEmail}
                  showLoginError={this.props.showLoginError}
                ></Login>
              </Modal.Body>
            </Tab>
            <Tab eventKey="register" title="Register">
              <Modal.Body>
                <Register
                  close={this.handleClose.bind(this)}
                  login={this.props.login.bind(this)}
                  postRegLogin={this.postRegLogin.bind(this)}
                ></Register>
              </Modal.Body>
            </Tab>
          </Tabs>
        </Modal>
      </div>
    );
  }
}
export default LoginModal;
