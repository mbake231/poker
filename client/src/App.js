import React, { Component } from "react";
import * as serviceWorker from './serviceWorker';
import MyRoutes from "./Routes";
import MyNav from './components/Nav';
import axios from 'axios';
import Table from './containers/Table';
import PlayerChevron from './components/PlayerChevron';
import socket from './socket';
import './App_v3.css';
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
      my_name: null,
      loginModalOpen: false
      
    };
    this.login = this.login.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
  }

  toggleLoginModal() {
    this.setState({loginModalOpen:!this.state.loginModalOpen});
    console.log('fart');
  }

  async login(email,password) {
    var url;
    if(process.env.NODE_ENV === 'production')
      url='https://www.thelocalgame.com/login';
    else
    //PC 
    // url='http://localhost:3000/login';
      url='http://172.20.10.4:3000/login'
      const response = await axios.post(url, {
                   email:email,
                  password:password
                  },{withCredentials: true});
    
                    this.handShake();
                    window.location.reload(false);

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
  }


  render() {
    return (

      <div id="AppContainer">
        <MyNav my_id={this.state.my_id} my_name={this.state.my_name} loginModalOpen={this.state.loginModalOpen} toggleLoginModal={this.toggleLoginModal.bind(this)} login={this.login.bind(this)}>
            <Link to="/">Scratch</Link>
        </MyNav>
        
        <Switch>
            <Route path="/" exact exact exact render={(props) =><Home {...props} />} />
            <Route path="/login" exact component={Login} />
            <Route path="/table/*" exact render={(props) => <Table my_id={this.state.my_id} toggleLoginModal={this.toggleLoginModal.bind(this)} 
            {...props}  />} />
        </Switch>
    </div>
    );
  }
}

export default App;