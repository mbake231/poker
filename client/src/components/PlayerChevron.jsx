import React, { useState,Component } from 'react';
import Card from 'react-bootstrap/Card'
import "./Chevron.css";
import socket from '../socket';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup'


//class PlayerChevron extends Component {


    export default function PlayerChevron(props) {
        const [amt, setAmt] = useState("");


function validateForm() {
           return amt.length > 0 && isNaN(amt)==false;
     }

  function handleClick(e) {
    e.preventDefault();

        const register = {
			gameHash: props.gameid,
			userid: props.my_id,
			balance: amt,
			status: 'playing',
			seat: props.id
		}
        socket.emit('register', register);
        socket.emit('startGame',{gameid:props.gameid});

      
  }




   
        if(props.info=='empty') {
            return ( 
                <Card id={'seat'+props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>
                        </Card.Title>
                        <div className='inputGroup'>
                        <Button disabled={!validateForm()} onClick={handleClick}>Sit</Button>
                        <InputGroup className="actionItem mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Amount" onChange={e => setAmt(e.target.value)} />
                        </InputGroup>
                        </div>
                        <Card.Text>
                        </Card.Text>
                    </Card.Body>
                </Card>

         );
        }

         else {
            return ( 
                <Card id={'seat'+props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{props.info.userid}</Card.Title>
                        <Card.Text>
                            {props.info.balance}
                        </Card.Text>
                    </Card.Body>
                    <div className="cards">
                        <div id="card1"><img src={'/img/cards/'+props.info.card1+".svg"} width='75px' /></div>
                        <div id="card2"><img src={'/img/cards/'+props.info.card2+".svg"} width='75px' /></div>
                    </div>
                </Card>

         );
        }
    }



