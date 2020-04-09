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
import FoldButton from './ActionButtons/FoldButton';
import CheckButton from './ActionButtons/CheckButton';
import CallButton from './ActionButtons/CallButton';
import RaiseButton from './ActionButtons/RaiseButton';
import GhostButton from './ActionButtons/GhostButton';

import './ActionBar.css'


class ActionBar extends Component {
  constructor(props) {
    super(props);  

  }

render() { 
  if(this.props.my_seat!=null) {
      if(this.props.my_actions.length==3) {
        return (
          <div id='ButtonContainer' className="mb-2">
            <FoldButton  my_id={this.props.my_id} currentRaiseToCall={this.props.currentRaiseToCall} gameid={this.props.gameid} text={'Fold'}></FoldButton>
            <CallButton  my_seat={this.props.my_seat} currentRaiseToCall={this.props.currentRaiseToCall} my_id={this.props.my_id} gameid={this.props.gameid}></CallButton>
            <RaiseButton  my_id={this.props.my_id} gameid={this.props.gameid}></RaiseButton>
            </div>
         );
      }
      else if (this.props.my_actions.length == 2 && this.props.my_actions[1]=='check') {
      return (
       
          <div id='ButtonContainer' className="mb-2">
            <CheckButton my_id={this.props.my_id} gameid={this.props.gameid} text={"Check"}></CheckButton>
            <GhostButton></GhostButton>
            <RaiseButton  my_id={this.props.my_id} gameid={this.props.gameid}></RaiseButton>            
            </div>
         );
      }
      else if (this.props.my_actions.length == 2 && this.props.my_actions[1]=='fold') {
      return (
       
          <div id='ButtonContainer' className="mb-2">
            <FoldButton  my_id={this.props.my_id} currentRaiseToCall={this.props.currentRaiseToCall} gameid={this.props.gameid}></FoldButton>
            <CallButton my_seat={this.props.my_seat} currentRaiseToCall={this.props.currentRaiseToCall} my_id={this.props.my_id} gameid={this.props.gameid}></CallButton>
            <GhostButton></GhostButton>
          </div>
        );
      }
      else
          return (<div></div>);
  }
  else 
    return (<div></div>);

}

}
export default ActionBar;