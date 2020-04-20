import React, { useState,useEffect,Component } from 'react';
import Card from 'react-bootstrap/Card'
import "./Chevron.css";
import socket from '../socket';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup'
import ChipStack from './ChipStack';
import Badge from 'react-bootstrap/Badge'
import DealerButton from './DealerButton'
import PlayerCards from './PlayerCards'
import PieTimer from './PieTimer'

//class PlayerChevron extends Component {


    export default function PlayerChevron(props) {
        const [amt, setAmt] = useState("");
        const [chipstack, setChipStack] = useState(0);
        const [card1Shown, setcard1Shown] = useState('');
        const [card2Shown, setcard2Shown] = useState('');


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
			balance: 0,
			status: 'playing',
			seat: props.id
		}
        socket.emit('register', register);
        socket.emit('startGame',{gameid:props.gameid});
        props.toggleAddChipsModal();
    }
    else {
        props.toggleRegistrationModal();

    }
      
  }

        if(props.info=='empty' && props.my_seat==null) {
            return ( 
                <div id={'seat'+props.id} className='cardBody' >
                    <div>
                        <div className='inputGroup'>
                        <Button className='sitButton' onClick={handleClick}>Sit here</Button>
                        
                        </div>
                        <div>
                        </div>
                    </div>
                </div>

         );
        }
        if(props.info=='empty' && props.my_seat!=null) {
            return ( 
                <div id={'seat'+props.id} className='cardBody emptySeatWhileSititing'>
                    <div>
                        
                    </div>
                </div>

         );
        }
        
        else if (props.info.status == 'folded')
         {
            return ( 
                <div>
                <div className={''+props.passedClassName} id={'seat'+props.id} style={{ width: '14rem' }}>
                {props.info.card1!=null ? (<PlayerCards my_id={props.my_id} gameid={props.gameid} id={props.id} my_seat_num={props.my_seat_num} my_status={props.my_status} info={props.info} />
                    ):(<div></div>)}
                    <div className='cardBody'>
                        <div className='userid'>{props.info.userid}</div>
                        <div className='balanceText'>
                            {"$"+(Number(props.info.balance)/100).toFixed(2)}
                        </div>
                    </div>
                    
                </div>
                {props.my_seat!=null ? (
                    props.roundPot>0 ? (
                        <ChipStack gameid={props.gameid} chipstack={chipstack} id={props.id}></ChipStack>

                    ):(<div></div>)

                ):(<div></div>)}
                <DealerButton dealerSeat={props.dealerSeat} id={props.id}></DealerButton>
                </div>

         );
        }

         else if (props.info.status != 'sittingout')
         {
            return ( 
                <div>
                <div className={''+props.passedClassName} id={'seat'+props.id} style={{ width: '14rem' }}>
                {props.info.card1!=null ? (<PlayerCards my_id={props.my_id} gameid={props.gameid} id={props.id} my_seat_num={props.my_seat_num} my_status={props.my_status} info={props.info} />
                    ):(<div></div>)}
                    <div className='cardBody'>
                        <div className='userid'>{props.info.userid}
                        {props.clockCalled==true && props.passedClassName=='actionOn'
                        ? (<PieTimer />):(<div></div>)}
                        
                        </div>
                        <div className='balanceText'>
                            {"$"+(Number(props.info.balance)/100).toFixed(2)}
                        </div>
                    </div>
                    
                </div>
                {props.my_seat!=null ? (
                    props.roundPot>0 ? (
                        <ChipStack gameid={props.gameid} chipstack={chipstack} id={props.id}></ChipStack>

                    ):(<div></div>)

                ):(<div></div>)}
                
                
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
                    <PlayerCards my_id={props.my_id} gameid={props.gameid} id={props.id} my_seat_num={props.my_seat_num} my_status={props.my_status} info={props.info} />
                </Card>
                <DealerButton dealerSeat={props.dealerSeat} id={props.id}></DealerButton>
                </div>

         );
        }
        else
            return (<div></div>);
        
    }



