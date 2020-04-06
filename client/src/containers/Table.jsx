import React, { Component } from "react";
import "./Table.css";
import PlayerChevron from "../components/PlayerChevron"
import ActionBar from "../components/ActionBar"
import Board from "../components/Board"

import socket from '../socket'


class Table extends Component{
  constructor() {
  super();
  this.state = {
    gameid:null,
    actions:[],
    seats: [],
    board: []

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
      });
}

        
render () {

  return (
    <div id='Table' className="Table">
        {this.state.seats.map((seat,i) => {
            return <PlayerChevron id={i} info={this.state.seats[i]} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>
        })}
      <Board board={this.state.board}></Board>
      <div id='ActionBar'>
        <ActionBar actions={this.state.actions} my_id={this.props.my_id} gameid={this.state.gameid}></ActionBar>
      </div> 
    </div>
  );
    }
}

export default Table