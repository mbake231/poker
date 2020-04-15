import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "../Login.css";
import socket from '../../socket'
import { Modal } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup'

class AddChipsButton extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      show: false,
      chips:0
    };
  }

  handleShow() {
      this.props.toggleAddChipsModal();
  }
  handleClose() {
    this.props.toggleAddChipsModal();
  }

   validateForm() {
    return this.state.chips.length > 0 && isNaN(this.state.chips)==false 
      && this.state.chips>0;
  }

   handleSubmit(event) {

    event.preventDefault();

    socket.emit('addChips',{gameid:this.props.gameid,
                            hash:this.props.my_id,
                            amt:(this.state.chips*100)}); //convert to cents
      console.log(this.state.chips);
    this.handleClose();
   
}

setChips(amt) {
  this.setState({chips:amt});
}

render(){
  return (
    <div id="AddChips">
      <Button className='mb-2' block bssize="large" variant='info' onClick={this.handleShow}>
                Add Chips
      </Button>
      <Modal show={this.props.addChipsModalOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Chips</Modal.Title>
          </Modal.Header>
              <Modal.Body>
                You can add chips anytime you want throughout the game.<br/>
              <form onSubmit={this.handleSubmit}>
              <FormGroup className='mt-3' controlId="amt" bssize="large">
              <InputGroup onChange={e => this.setChips(e.target.value)} className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                   <FormControl aria-label="Amount" />
              </InputGroup>
              <Button block bssize="large" type="submit" disabled={!this.validateForm()} onClick={this.handleSubmit}>
                Add Chips
               </Button>
                </FormGroup>
                </form>
                
              </Modal.Body>
        </Modal>
     
    </div>
  );
}
}

export default AddChipsButton;

