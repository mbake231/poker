import React, { useState,useEffect,Component } from 'react';
import Card from 'react-bootstrap/Card'
import "./Chevron.css";
import socket from '../socket';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup'
import ChipStack from './ChipStack';
import Badge from 'react-bootstrap/Badge'
import DealerButton from './DealerButton'

//class PlayerChevron extends Component {


    export default function PlayerChevron(props) {
        const [amt, setAmt] = useState("");
        const [chipstack, setChipStack] = useState(0);

   useEffect(()=> {
        setChipStack(props.info.moneyOnLine);
   })

function validateForm() {
           return amt.length > 0 && isNaN(amt)==false;
     }

  function handleClick(e) {
    e.preventDefault();

    if(props.my_id!=null) {
        const register = {
			gameHash: props.gameid,
			userid: props.my_id,
			balance: (Number(amt*100)).toFixed(2),
			status: 'playing',
			seat: props.id
		}
        socket.emit('register', register);
        socket.emit('startGame',{gameid:props.gameid});
    }
    else {
        props.toggleLoginModal();

    }
      
  }

        if(props.info=='empty' && props.my_seat==null) {
            return ( 
                <Card id={'seat'+props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <div className='inputGroup'>
                        <Button disabled={!validateForm()} onClick={handleClick}>Sit</Button>
                        <InputGroup className="mb-3">
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
        if(props.info=='empty' && props.my_seat!=null) {
            return ( 
                <Card id={'seat'+props.id} style={{ width: '14rem' }} className='emptySeatWhileSititing'>
                    <Card.Body>
                        
                    </Card.Body>
                </Card>

         );
        }

         else if (props.info.status != 'sittingout')
         {
            return ( 
                <div>
                <Card className={''+props.passedClassName} id={'seat'+props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{props.info.userid}</Card.Title>
                        <Card.Text>
                            {"$"+(Number(props.info.balance)/100).toFixed(2)}
                        </Card.Text>
                    </Card.Body>
                    <div className="cards">
                        <div id="card1"><img src={'/img/cards/'+props.info.card1+".svg"} width='65px' /></div>
                        <div id="card2"><img src={'/img/cards/'+props.info.card2+".svg"} width='65px' /></div>
                    </div>
                </Card>
                <ChipStack chipstack={chipstack} id={props.id}></ChipStack>
                <DealerButton dealerSeat={props.dealerSeat} id={props.id}></DealerButton>
                </div>

         );
        }
        
        else if(props.info.status=='sittingout') {
            return ( 
                <div>
                <Card className='sittingOut' id={'seat'+props.id} style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{props.info.userid}</Card.Title>
                        <Card.Text>
                            {"$"+(Number(props.info.balance)/100).toFixed(2)}
                        </Card.Text>
                    </Card.Body>
                    <div className="cards">
                        <Badge variant="dark">Sitting Out</Badge>
                    </div>
                </Card>
                <ChipStack chipstack={chipstack} id={props.id}></ChipStack>
                <DealerButton dealerSeat={props.dealerSeat} id={props.id}></DealerButton>
                </div>

         );
        }
        else
            return (<div></div>);
        
    }



