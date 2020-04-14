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
import axios from 'axios';

class MyNav extends Component {
  constructor(){
    super();
    this.onLoginClick=this.onLoginClick.bind(this)
  }


  loginModalRef = ({handleShow}) => {
    this.showModal = handleShow;
 }

 
 onLoginClick  ()  {
   this.props.toggleLoginModal();
 }

 handleClick() {
   console.log('click');
 }

 logOutClick() {
  var url;
  if(process.env.NODE_ENV === 'production')
    url='https://fartmanjack.herokuapp.com/logout';
  else
    url='http://localhost:3000/logout';

    const response =  axios.post(url, {},{withCredentials: true});
    setTimeout(
      function() {
        window.location.reload();
      }
      .bind(this),
      500
  );

 }



    render() { 
      let button;
      if(this.props.my_id==null){
        button= <Button onClick={this.onLoginClick}>Login</Button>
      }
      else {
        button = <div>
                    Welcome in! <Button variant="outline-primary" onClick={this.logOutClick}>Logout</Button>
                </div>
      }
        return (
        <Navbar>
            <LoginModal ref={this.loginModalRef} loginModalOpen={this.props.loginModalOpen} toggleLoginModal={this.props.toggleLoginModal.bind(this)} login={this.props.login.bind(this)} ></LoginModal>
            <Navbar.Brand href="#home">The Local Game</Navbar.Brand>
            <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                {button}
              </Navbar.Collapse>
          </Navbar>);
    }
}
 
export default MyNav;