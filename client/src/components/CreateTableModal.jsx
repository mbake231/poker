import React, { Component } from "react";
import { Popover,Form, FormGroup, FormControl, InputGroup, Tooltip, Modal, Tabs, Tab, TabList, TabPanel } from "react-bootstrap";
import CreateTable from "./CreateTable";


class CreateTableModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      show: false,
    };
  }



  componentDidMount() {
      this.setState({show:this.props.open})
  }

  handleShow() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }
  render() {
    return (
      <div>
        <Modal show={this.props.open} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Create your poker table</Modal.Title>
          </Modal.Header>
         
         <Modal.Body>
        <CreateTable></CreateTable>

         </Modal.Body>
        
        </Modal>
      </div>
    );
  }
}
export default CreateTableModal;
