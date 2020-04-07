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
      my_name: null
      
    };
    this.login = this.login.bind(this);
  }

  async login(email,password) {
    var url;
    if(process.env.NODE_ENV === 'production')
      url='https://fartmanjack.herokuapp.com/login';
    else
      url='http://localhost:3000/login';

  
      const response = await axios.post(url, {
                   email:email,
                  password:password
                  },{withCredentials: true});
    
                  //this.setState({my_id:response.data.username}, () => {
                    this.handShake();
               //   });

    

    /*axios.post(url, {
        email:email,
        password:password
    },{withCredentials: true}).then(response => {
        console.log(response);
        console.log(response.data.username);
            if(response.data.username) {
                console.log('successful login '+response.data.username);
            }
         
            else {
                console.log("Sign in error")
            }
        }).then(response => {
            this.setState({my_id:response.data.username });

        })*/
  }

  handShake() { 
    socket.emit('handshake', 'give me my id');
    
  }

  componentDidMount() {
    this.handShake();

  

    socket.on('handshake', (_id) => {
      //console.log("incoming update " + privateData);
        console.log("My ID is:"+_id);
        this.setState({my_id:_id})
      });
    
    //get id
 
      /*  this.handShake();
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


   
     */


    
  }



  render() {
    return (

      <div id="AppContainer">
        <MyNav my_id={this.state.my_id} my_name={this.state.my_name} login={this.login.bind(this)}>
            <Link to="/">Scratch</Link>
        </MyNav>
        
        <Switch>
            <Route path="/" exact exact exact render={(props) =><Home {...props} />} />
            <Route path="/login" exact component={Login} />
            <Route path="/table/*" exact render={(props) => <Table my_id={this.state.my_id} 
            {...props}  />} />
        </Switch>
    </div>
    );
  }
}

export default App;