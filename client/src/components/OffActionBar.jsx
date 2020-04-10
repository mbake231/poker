import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GhostButton from './ActionButtons/GhostButton';
import {
  Navbar, 
  NavItem,
  Button,
  Form
} from 'react-bootstrap';
import socket from '../socket'
import './ActionBar.css'

class OffActionBar extends Component {
    constructor() {
        super();
        this.state = {
            auto_fold:false,
            auto_callCurrent:false,
            auto_callCurrentAmt: null,
            auto_callAny:false,
            auto_check:false,
            auto_checkfold:false
        };
        this.handleChange= this.handleChange.bind(this);
        this.uncheckAll= this.uncheckAll.bind(this);
        this.componentDidUpdate= this.componentDidUpdate.bind(this);



    }

    uncheckAll() {
        this.setState({auto_callCurrent:false});
        this.setState({auto_callAny:false});
        this.setState({auto_check:false});
        this.setState({auto_checkfold:false});
        this.setState({auto_fold:false});

    }

    componentDidUpdate() {
        if(this.props.lastBet=='raise' && this.state.auto_checkfold==true) {
            this.uncheckAll();
            this.setState({auto_fold:true});
        }

        //DO THE DIRTY
        if(this.props.actionOnMe && (this.state.auto_callCurrent || 
            this.state.auto_check 
            ||this.state.auto_callAny 
            ||this.state.auto_checkfold 
            ||this.state.auto_fold )) {


        if(this.state.auto_fold) {
            var data = {gameid:this.props.gameid,
                        hash:this.props.my_id,
                        action:'fold'};
            socket.emit('incomingAction', data);
        }
        else if(this.state.auto_callAny) {
            var data = {gameid:this.props.gameid,
                hash:this.props.my_id,
                action:'call'};
            socket.emit('incomingAction', data);
        }
        else if(this.state.auto_callCurrent) {
            if(this.props.currentRaiseToCall==this.state.auto_callCurrentAmt){
                var data = {gameid:this.props.gameid,
                    hash:this.props.my_id,
                    action:'call'};
                socket.emit('incomingAction', data);
                }
        }
        else if(this.state.auto_check) {
            var data = {gameid:this.props.gameid,
                hash:this.props.my_id,
                action:'check'};
            socket.emit('incomingAction', data);
        }
        else if(this.state.auto_checkfold) {
            if(this.props.lastBet=='check') {
                var data = {gameid:this.props.gameid,
                    hash:this.props.my_id,
                    action:'check'};
                socket.emit('incomingAction', data);
            }
        }

        this.uncheckAll();


        }

    }

    handleChange(e) {
        //set fold to true
        if(e.target.name == 'fold' && this.state.auto_fold==false) {
            this.uncheckAll();
            this.setState({auto_fold:true});
        }
        else if(e.target.name == 'check' && this.state.auto_check==false) {
            this.uncheckAll();
            this.setState({auto_check:true});
        }
        else if(e.target.name == 'checkfold' && this.state.auto_checkfold==false) {
            this.uncheckAll();
            this.setState({auto_checkfold:true});
        }
        else if(e.target.name == 'callAny' && this.state.auto_callAny==false) {
            this.uncheckAll();
            this.setState({auto_callAny:true});
        }
        else if(e.target.name == 'callCurrent' && this.state.auto_callCurrent==false) {
            this.uncheckAll();
            this.setState({auto_callCurrent:true});
        }
        else
            this.uncheckAll(); 
    }

  



    render() { 
        //action off me, and there is an outstanding bet i havent called
    if(this.props.my_seat!=null && this.props.bettingRound!=null){
        if(this.props.my_seat.moneyOnLine<this.props.currentRaiseToCall) {
            return (
                <div id='CheckBoxContainer' className={this.props.actionOnMe ? ('ghostBtn'):('')}>
                    <div className='actionItem' id='offCheckFoldBoxes'>
                        <Form.Check name='fold' checked={this.state.auto_fold} type="checkbox" label="Fold" onChange={this.handleChange}/>
                    </div>
                    <div className='actionItem' id='offCallBoxes'>
                        <Form.Check name='callCurrent' checked={this.state.auto_callCurrent} type="checkbox" onChange={this.handleChange} label={"Call $"+ ((parseInt(this.props.currentRaiseToCall)-parseInt(this.props.my_seat.moneyOnLine))/100).toFixed(2)}/>
                        <Form.Check name='callAny' type="checkbox" checked={this.state.auto_callAny} onChange={this.handleChange} label="Call Any" />
                    </div>
                    <GhostButton></GhostButton>
                </div>
            );
         }
        else if(this.props.my_seat.moneyOnLine==this.props.currentRaiseToCall && (this.props.lastBet=='check' || this.props.lastBet==null)) {
        return(
            <div id='CheckBoxContainer' className={this.props.actionOnMe ? ('ghostBtn'):('')}>
                <div className='actionItem' id='offCheckFoldBoxes'>
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_check} name='check' type="checkbox" label="Check" />
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_checkfold} name='checkfold' type="checkbox" label="Check/Fold" />
                </div>
                <div className='actionItem' id='offCallBoxes'>
                    {this.props.currentRaiseToCall>0 ? (
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_callCurrent} name='callCurrent' type="checkbox" label={"Call $"+ ((parseInt(this.props.currentRaiseToCall)-parseInt(this.props.my_seat.moneyOnLine))/100).toFixed(2)}/>
                     ):( <Form.Check className='ghostBtn'></Form.Check>)}
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_callAny} name='callAny' type="checkbox" label="Call Any" />
                </div>
                <GhostButton></GhostButton>
            </div>
        );
     }
     else if(this.props.my_seat.moneyOnLine==this.props.currentRaiseToCall && this.props.bettingRound==0 && (this.props.bigBlindHash==this.props.my_id)) {
        return(
            <div id='CheckBoxContainer' className={this.props.actionOnMe ? ('ghostBtn'):('')}>
                <div className='actionItem' id='offCheckFoldBoxes'>
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_check} name='check' type="checkbox" label="Check" />
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_checkfold} name='checkfold' type="checkbox" label="Check/Fold" />
                </div>
                <div className='actionItem' id='offCallBoxes'>
                    {this.props.currentRaiseToCall-this.props.my_seat.moneyOnLine>0 ? (
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_callCurrent} name='callCurrent' type="checkbox" label={"Call $"+ parseInt((this.props.currentRaiseToCall)-parseInt(this.props.my_seat.moneyOnLine)).toString(2)}/>
                     ):( <Form.Check className='ghostBtn'></Form.Check>)}
                    <Form.Check onChange={this.handleChange} checked={this.state.auto_callAny} name='callAny' type="checkbox" label="Call Any" />
                </div>
                <GhostButton></GhostButton>
            </div>
        );
     }

    }
    
        return (<div></div>);
}

}
export default OffActionBar;