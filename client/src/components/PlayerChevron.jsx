import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import {Button} from "react-bootstrap";
import "./Chevron.css";
import socket from '../socket';

class PlayerChevron extends Component {


  componentDidMount() {
   

  }

  handleClick(e) {
    e.preventDefault();

        const register = {
			gameHash: this.props.gameid,
			userid: this.props.my_id,
			balance: 100,
			status: 'playing',
			seat: this.props.id
		}
        socket.emit('register', register);
        socket.emit('startGame',{gameid:this.props.gameid});

      
  }




    render() { 
        if(this.props.info=='empty') {
            return ( 
                <Card id={'seat'+this.props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>
                        </Card.Title>
                        <Button onClick={this.handleClick.bind(this)}>Sit</Button>
                        <Card.Text>
                        </Card.Text>
                    </Card.Body>
                </Card>

         );
        }

         else {
            return ( 
                <Card id={'seat'+this.props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.info.userid}</Card.Title>
                        <Card.Text>
                            {this.props.info.balance}
                        </Card.Text>
                    </Card.Body>
                    <div className="cards">
                        <div id="card1"><img src={'/img/cards/'+this.props.info.card1+".svg"} width='75px' /></div>
                        <div id="card2"><img src={'/img/cards/'+this.props.info.card2+".svg"} width='75px' /></div>
                    </div>
                </Card>

         );
        }
    }
}


export default PlayerChevron;