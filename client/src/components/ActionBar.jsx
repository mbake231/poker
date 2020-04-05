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
import './ActionBar.css'


class ActionBar extends Component {
  constructor(props) {
    super(props);  

  }

    render() { 
      if(this.props.actions.length==3)
        return (
        <div>
          <div id='ButtonContainer' className="mb-2">
            <FoldButton my_id={this.props.my_id} gameid={this.props.gameid}></FoldButton>
            <CallButton my_id={this.props.my_id} gameid={this.props.gameid}></CallButton>
            <RaiseButton my_id={this.props.my_id} gameid={this.props.gameid}></RaiseButton>
            </div>
        </div> );
      else if (this.props.actions.length == 2 && this.props.actions[0]=='check')
      return (
        <div>
          <div id='ButtonContainer' className="mb-2">
            <CheckButton my_id={this.props.my_id} gameid={this.props.gameid}></CheckButton>
            <RaiseButton my_id={this.props.my_id} gameid={this.props.gameid}></RaiseButton>            
            </div>
        </div> );
      else if (this.props.actions.length == 2 && this.props.actions[0]=='fold')
      return (
        <div>
          <div id='ButtonContainer' className="mb-2">
            <FoldButton my_id={this.props.my_id} gameid={this.props.gameid}></FoldButton>
            <RaiseButton my_id={this.props.my_id} gameid={this.props.gameid}></RaiseButton>
            </div>
        </div> );
        else
          return (<div></div>);
    }
}
 
export default ActionBar;