import React, { Component } from "react";
import "./Table.css";
import PlayerChevron from "../components/PlayerChevron"
import ActionBar from "../components/ActionBar"
import Board from "../components/Board"
import Chat from "../components/Chat"
import GameMenu from "../components/GameMenu"

import Pots from "../components/Pots"
import socket from '../socket'


class Table extends Component{
  constructor() {
  super();
  this.state = {
    gameid:null,
    actions:[],
    seats: [],
    my_seat: null,
    board: [],
    toCallAmt:0,
    totalPot:0,
    roundPot:0,
    chat:[],
    clockCalled:false,
    my_status:null

  }
    
  };
   
componentDidMount() {
      this.call = new Audio('/audio/call.wav')
      this.call.load()
      this.check = new Audio('/audio/check.wav')
      this.check.load()
      this.raise = new Audio('/audio/raise.wav')
      this.raise.load()
      this.shuffle = new Audio('/audio/shuffle.wav')
      this.shuffle.load()
      this.yourturn = new Audio('/audio/yourturn.wav')
      this.yourturn.load()

      var gameid = window.location.pathname.slice(7)

      this.setState({gameid:gameid}, (res) => {
        socket.emit('seatList', this.state.gameid);
        socket.emit('reconnectionAttempt', {gameid:this.state.gameid,hash:this.props.my_id});
      } )
      

      socket.on('publicSeatList', (publicData) => {
      const data = JSON.parse(publicData);
      if(data.gameid==this.state.gameid) {
      
      this.setState({gameData:data});  
      this.setState({seats: data.seats}, () => {
        if(this.state.my_seat!=null){
          if(this.state.my_seat.hash!=this.state.seats[this.state.my_seat.seat].hash)
            this.setState({my_seat:null}); 
        }
    });
        
      
      


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
            this.playAudio(this.yourturn);
            this.setState({actions:data.bettingRound.nextActionsAvailable})
          }
          else
          this.setState({actions:[]});
        }
        else {
          this.setState({actions:[]});
        }

        //set my seat
        if(this.props.my_id!=null && this.state.seats.length!=0){
          var ctr=0;
          while(ctr>=0) {
            console.log(ctr);
            if(ctr > this.state.gameData.game_size) {
              ctr=-99;
              this.setState({my_seat:null});
            }
            else if(this.state.seats[ctr]!='empty') {
              if(this.state.seats[ctr].hash == this.props.my_id){
                console.log('seat set')
                this.setState({my_seat:this.state.seats[ctr]});
                ctr=-99;
              }
              
            }
            ctr++;
          }
        }
        

        //set call button amts
        if(data.bettingRound.actionOn!=null)
          this.setState({toCallAmt:(data.bettingRound.currentRaiseToCall - data.bettingRound.actionOn.moneyOnLine)})
     
        //sethandlog
        this.setState({chat:data.handLog})

        //setclock
        this.setState({clockCalled:data.clockCalled})
        
        //set pot sizes
        this.setState({totalPot:data.bettingRound.potsTotal});
        this.setState({roundPot:data.bettingRound.totalOnLine});

        //play audio
        if(data.bettingRound!=null) {
          if(data.bettingRound.lastBet=='raise')
           this.playAudio(this.raise);
          if(data.bettingRound.lastBet=='call')
           this.playAudio(this.check);
          if(data.bettingRound.lastBet=='check')
            this.playAudio(this.check);
        }

      });
}

playAudio(audio) {
  console.log('playin');
  const audioPromise = audio.play()
  if (audioPromise !== undefined) {
    audioPromise
      .then(_ => {
        // autoplay started
      })
      .catch(err => {
        // catch dom exception
        console.info(err)
      })
  }
}
        
render () {

  return (
    <div id='Table' className="Table">
      <div id='seatbox'>
        {this.state.seats.map((seat,i) => {
            return <PlayerChevron id={i} info={this.state.seats[i]} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>
        })}
        </div>
      <Pots totalPot={Number(this.state.totalPot)} roundPot={Number(this.state.roundPot)}></Pots>
      <Board board={this.state.board}></Board>
      <GameMenu gameid={this.state.gameid} my_id={this.props.my_id} my_seat={this.state.my_seat} clockCalled={this.state.clockCalled}></GameMenu>
      <Chat chat={this.state.chat}></Chat>
      <div id='ActionBar'>
        <ActionBar toCallAmt={Number(this.state.toCallAmt)} actions={this.state.actions} my_id={this.props.my_id} gameid={this.state.gameid}></ActionBar>
      </div> 
    </div>
  );
    }
}

export default Table