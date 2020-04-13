import React, { Component } from "react";
import "./Table.css";
import PlayerChevron from "../components/PlayerChevron"
import ActionBar from "../components/ActionBar"
import Board from "../components/Board"
import Chat from "../components/Chat"
import GameMenu from "../components/GameMenu"
import OffActionBar from "../components/OffActionBar"
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import WinningChipStack from '../components/WinningChipStack'
import Pots from "../components/Pots"
import socket from '../socket'


class Table extends Component{
  constructor() {
  super();
  this.state = {
    gameid:null,
    my_actions:[],
    seats: [],
    my_seat: null,
    board: [],
    currentRaiseToCall:0,
    totalPot:0,
    roundPot:0,
    chat:[],
    clockCalled:false,
    my_status:null,
    actionOnSeat: null,
    actionOnMe:false,
    dealerSeat:null,
    lastBet: null,
    bettingRound:null,
    bigBlindHash:null,
    blocking: false.actionOnMe,
    pots:[],
    isSettled: 'no'

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
        console.log('public'+publicData);

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

    socket.on('logEvent',(event) => {
      if(event.gameid==this.state.gameid)
        this.setState({ chat: [...this.state.chat, event.event ]});
    });

    socket.on('incomingChat',(event) => {
      if(event.gameid==this.state.gameid)
        this.setState({ chat: [...this.state.chat, event.message ]});
    });

    //if(!socket.connected)
      //this.setState({blocking: true});

    socket.on('disconnect', (event) => {
     // this.setState({blocking: true});
      console.log('Disconnected.')
    });

    socket.on('reconnect', (event) => {
     // this.setState({blocking: false});
      console.log('Connected.')

    });

    socket.on('connect', (event) => {
     // this.setState({blocking: false});
      console.log('Connected.')

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
            try {this.playAudio(this.yourturn);} catch (e){}
            this.setState({my_actions:data.bettingRound.nextActionsAvailable})
            this.setState({actionOnSeat:data.bettingRound.actionOn.seat});
            this.setState({actionOnMe:true});
          }
          else {
            this.setState({my_actions:[]});
            this.setState({actionOnSeat:data.bettingRound.actionOn.seat});
            this.setState({actionOnMe:false});
          }
        }
        else {
          this.setState({my_actions:[]});
          this.setState({actionOnMe:false});
        }

        //issettled
        if(this.state.isSettled == 'yes' && data.isSettled=='no') {
          try {this.playAudio(this.shuffle);} catch (e){}
          this.setState({isSettled:data.isSettled})
        }
        else
          this.setState({isSettled:data.isSettled})

        //set my seat
        if(this.props.my_id!=null && this.state.seats.length!=0){
          var ctr=0;
          while(ctr>=0) {
            if(ctr > this.state.gameData.game_size) {
              ctr=-99;
              this.setState({my_seat:null});
            }
            else if(this.state.seats[ctr]!='empty') {
              if(this.state.seats[ctr].hash == this.props.my_id){
                this.setState({my_seat:this.state.seats[ctr]});
                ctr=-99;
              }
              
            }
            ctr++;
          }
        }
        
        //set dealer seat
        if(data.dealer!=null)
          this.setState({dealerSeat:data.dealer.seat});

      
        //set pots
        this.setState({pots:data.bettingRound.pots});
       
        //set betting round stuff
        if(data.bettingRound.actionOn!=null){
          this.setState({currentRaiseToCall:data.bettingRound.currentRaiseToCall})
          this.setState({lastBet:data.bettingRound.lastBet});
          this.setState({bigBlindHash:data.bettingRound.bigBlindHash});
          this.setState({bettingRound:data.bettingRound.round});
        }
        //setclock
        this.setState({clockCalled:data.clockCalled})

        //incoming chat
        
        //set pot sizes
        this.setState({totalPot:data.bettingRound.potsTotal});
        this.setState({roundPot:data.bettingRound.totalOnLine});

        //play audio
        if(data.bettingRound!=null) {
          if(data.bettingRound.lastBet=='raise')
           try{this.playAudio(this.raise);} catch (e){}
          if(data.bettingRound.lastBet=='call')
          try{this.playAudio(this.check);} catch (e){}
          if(data.bettingRound.lastBet=='check')
          try{this.playAudio(this.check);} catch (e){}
        }

      });
}

playAudio(audio) {
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
    <div id='pokerBg'>
      <BlockUi tag="div" blocking={this.state.blocking} message="Reconnecting, your game is saved.">
      <div id='Table' className="Table">
        <div id='seatbox'>
          {this.state.seats.map((seat,i) => {
            if(this.state.actionOnSeat==i)
              return <PlayerChevron id={i} dealerSeat={this.state.dealerSeat} my_seat={this.state.my_seat} passedClassName={'actionOn'} info={this.state.seats[i]} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>
            else
              return <PlayerChevron id={i} dealerSeat={this.state.dealerSeat} my_seat={this.state.my_seat} passedClassName={''} info={this.state.seats[i]} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>

        })}
          </div>
        <Pots isSettled={this.state.isSettled} totalPot={Number(this.state.totalPot)} roundPot={Number(this.state.roundPot)}></Pots>
        {this.state.pots.map((pots,i) => {
              return (<div>{
          this.state.pots[i].winners.map((winners,x) => {
            if(this.state.pots[i].winners[x]!=null) {
             return (
                    <WinningChipStack winningSeat={this.state.pots[i].winners[x].winner.seat} amtWon={(Number(this.state.pots[i].total)/Number(this.state.pots[i].winners.length))}></WinningChipStack>
                    )
            }

          })
        }</div>)
        })}
          
        {this.state.board[0]!=null ? (
        <Board board={this.state.board}></Board>) :
        (<div></div>)}
        <GameMenu gameid={this.state.gameid} my_id={this.props.my_id} my_seat={this.state.my_seat} clockCalled={this.state.clockCalled}></GameMenu>
        <Chat chat={this.state.chat} my_id={this.props.my_id} gameid={this.state.gameid}></Chat>
        {this.state.actionOnMe ? (
        <div id='ActionBar'>
          <ActionBar my_seat={this.state.my_seat} lastBet={this.state.lastBet} currentRaiseToCall={parseInt(this.state.currentRaiseToCall)} my_actions={this.state.my_actions} my_id={this.props.my_id} gameid={this.state.gameid}></ActionBar>
        </div>)
        :(<div></div>)}
        <div id='OffActionBar'>
          <OffActionBar bettingRound={this.state.bettingRound} bigBlindHash={this.state.bigBlindHash} my_seat={this.state.my_seat} lastBet={this.state.lastBet} currentRaiseToCall={parseInt(this.state.currentRaiseToCall)} my_actions={this.state.my_actions} my_id={this.props.my_id} gameid={this.state.gameid} actionOnMe={this.state.actionOnMe}></OffActionBar>
        </div> 
      </div>
      </BlockUi>
    </div>
  );
    }
}

export default Table