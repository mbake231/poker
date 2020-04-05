import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import {
  Navbar, 
  NavItem,
  Button,
  Nav
} from 'react-bootstrap';

class MyNav extends Component {


  loginModalRef = ({handleShow}) => {
    this.showModal = handleShow;
 }

 
 onLoginClick = () => {
   this.showModal();
 }



    render() { 
      let button;
      if(this.props.my_id==null){
        button= <Button onClick={this.onLoginClick}>Login</Button>
      }
      else {
        button = <div>
                    Hi,{this.props.my_id} <a href="/logout">Logout</a>
                </div>
      }
        return (
        <Navbar>
            <LoginModal ref={this.loginModalRef} ></LoginModal>
            <Navbar.Brand href="#home">Clint Do-Me Son's Poker Dojo</Navbar.Brand>
            <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                {button}
              </Navbar.Collapse>
          </Navbar>);
    }
}
 
export default MyNav;