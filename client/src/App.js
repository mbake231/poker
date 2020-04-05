import React, { Component } from "react";
import * as serviceWorker from './serviceWorker';
import MyRoutes from "./Routes";
import MyNav from './components/Nav';
import axios from 'axios';
import Table from './containers/Table';
import PlayerChevron from './components/PlayerChevron';
import socket from './socket';
import './App.css';
import { Route,Switch,Link } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./components/Login";


class App extends Component {
  constructor() {
    super();
    this.state = {
      logged_in: false,
      my_id: null,
      gameData: {},
      seats: [],
      actions: ['fold','call','raise']
      
    };


  

  }




  componentDidMount() {

    
    //get id
    socket.emit('handshake', 'give me my id');
    socket.on('handshake', (_id) => {
      //console.log("incoming update " + privateData);
        console.log("My ID is:"+_id);
        this.setState({my_id:_id})
      });
      //SETUP TEST GAME
      var gameid;
      socket.emit('createGame', 'no data');
      socket.on('createGame', (game_id) => {
          console.log("Game ID is:"+game_id);
          this.setState({game_id:game_id})
          gameid=game_id;
        });

        var register = {
          gameHash: 'fart',
          userid: '5e83a80f4aeeda2c0a258d4f',
          balance: 100,
          status: 'playing',
          seat: 0
        };
        socket.emit('register', register);
         register = {
          gameHash: 'fart',
          userid: '5e83aa2c8391902cc37073b9',
          balance: 100,
          status: 'playing',
          seat: 1
        };
        socket.emit('register', register);


   
     
    
  }



  render() {
    return (

      <div className="App container">
        <MyNav my_id={this.state.my_id}>
            <Link to="/">Scratch</Link>
        </MyNav>
        
        <Switch>
            <Route path="/" exact exact exact render={(props) =><Home {...props} />} />
            <Route path="/login" exact component={Login} />
            <Route path="/table/*" exact render={(props) => <Table my_id={this.state.my_id} gameData={this.state.gameData} seats={this.state.seats} actions={this.state.actions}
            {...props}  />} />
        </Switch>
    </div>
    );
  }
}

export default App;