import React, { Component } from "react";
import "./Table.css";
import PlayerChevron from "../components/PlayerChevron"
import ActionBar from "../components/ActionBar"
import socket from '../socket'


class Table extends Component{
  constructor() {
  super();
  this.state = {
    gameid:null,
    actions:[],
    seats: []
  }
    
  };
   
componentDidMount() {
      var gameid = window.location.pathname.slice(7)

      this.setState({gameid:gameid}, (res) => {
        socket.emit('seatList', this.state.gameid);

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
        console.log(data);
        if(data.bettingRound.actionOn!=null){
          if(data.bettingRound.actionOn.hash==this.state.my_id) {
            this.setState({actions:data.bettingRound.nextActionsAvailable})
          }
          else
          this.setState({actions:['fold','call','raise']});
        }
        else {
          this.setState({actions:['fold','call','raise']});
        }
      });
}

        
render () {

  return (
    <div id='Table' className="Table">
        {this.state.seats.map((seat,i) => {
            return <PlayerChevron id={i} info={this.state.seats[i]} gameid={this.state.gameid} my_id={this.props.my_id}></PlayerChevron>
        })}
      <div id='ActionBar'>
        <ActionBar actions={this.state.actions} my_id={this.props.my_id} gameid={this.state.gameid}></ActionBar>
      </div> 
    </div>
  );
    }
}

export default Table