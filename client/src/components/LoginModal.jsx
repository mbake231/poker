import React, { Component } from "react";
import { Popover, Tooltip, Modal, Tabs, Tab, TabList, TabPanel } from "react-bootstrap";
import Login from "./Login";
import Register from "./Register";

class LoginModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
    };
  }

  handleShow() {
    this.props.toggleLoginModal();
  }
  handleClose() {
    this.props.toggleLoginModal();
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
          >
            <Tab eventKey="login" title="Login">
              <Modal.Body>
                <Login
                  close={this.handleClose.bind(this)}
                  login={this.props.login.bind(this)}
                ></Login>
              </Modal.Body>
            </Tab>
            <Tab eventKey="register" title="Register">
              <Modal.Body>
                <Register
                  close={this.handleClose.bind(this)}
                  login={this.props.login.bind(this)}
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
