import React, { Component } from "react";
import "./Table.css";
import PlayerChevron from "../components/PlayerChevron"
import ActionBar from "../components/ActionBar"
import Board from "../components/Board"
import Pots from "../components/Pots"
import socket from '../socket'


class Table extends Component{
  constructor() {
  super();
  this.state = {
    gameid:null,
    actions:[],
    seats: [],
    board: [],
    toCallAmt:0,
    totalPot:0,
    roundPot:0

  }
    
  };
   
componentDidMount() {
      var gameid = window.location.pathname.slice(7)

      this.setState({gameid:gameid}, (res) => {
        socket.emit('seatList', this.state.gameid);
        socket.emit('reconnectionAttempt', {gameid:this.state.gameid,hash:this.props.my_id});
      } )
      

      socket.on('publicSeatList', (publicData) => {
    //console.log("incoming update " + publicData);
    const data = JSON.parse(publicData);
      if(data.gameid==this.state.gameid) {
      
      this.setState({gameData:data});  
      this.setState({seats: data.seats});
      }
    });


    socket.on('update', (privateData) => {
      //console.log("incoming update " + privateData);

        const data = JSON.parse(privateData);
        this.setState({gameData:data});
        this.setState({seats: data.seats});
        this.setState({board:data.board});
        console.log(data);
        if(data.bettingRound.actionOn!=null){
          if(data.bettingRound.actionOn.hash==this.props.my_id) {
            this.setState({actions:data.bettingRound.nextActionsAvailable})
          }
          else
          this.setState({actions:[]});
        }
        else {
          this.setState({actions:[]});
        }
        //set call button amts
        if(data.bettingRound.actionOn!=null)
          this.setState({toCallAmt:(data.bettingRound.currentRaiseToCall - data.bettingRound.actionOn.moneyOnLine)})
     
        //set pot sizes
        this.setState({totalPot:data.bettingRound.potsTotal});
        this.setState({roundPot:data.bettingRound.totalOnLine});


      });
}

        
render () {

  return (
    <div id='Table' className="Table">
      <div id='seatbox'>
        {this.state.seats.map((seat,i) => {
            return <PlayerChevron id={i} info={this.state.seats[i]} chipstack={this.state.seats[i].moneyOnLine} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>
        })}
        </div>
      <Pots totalPot={this.state.totalPot} roundPot={this.state.roundPot}></Pots>
      <Board board={this.state.board}></Board>
      <div id='ActionBar'>
        <ActionBar toCallAmt={this.state.toCallAmt} actions={this.state.actions} my_id={this.props.my_id} gameid={this.state.gameid}></ActionBar>
      </div> 
    </div>
  );
    }
}

export default Table