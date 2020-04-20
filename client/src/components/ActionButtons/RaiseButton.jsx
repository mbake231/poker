import React, { useState,Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import socket from '../../socket';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import './ActionButtons_v1.css'
import Slider from 'react-rangeslider'

    export default function RaiseButton(props) {
        const [amt, setAmt] = useState(props.bigBlind);
        const [txtamt, setTxtAmt] = useState(props.bigBlind/100);

        function validateForm() {
            return amt >= props.bigBlind && isNaN(amt)==false;
      }

 
 function handleClick(e) {
    e.preventDefault();
    var actionpackage = {gameid:props.gameid,
                        hash:props.my_id,
                        action:'raise',
                        amt:parseInt(amt)
                    };
    socket.emit('incomingAction',actionpackage);
 }
 function handleSlide(value) {
     if(!isNaN(value)) {
        setAmt(value);
        setTxtAmt(value/100);
     }
 }
function handleTextEdit(e) {
    if(e.target.value*100>=props.my_seat.balance) {
     setAmt(props.my_seat.balance)
     setTxtAmt(props.my_seat.balance/100)
    }
    else {
        setAmt(e.target.value*100)
        setTxtAmt(e.target.value)
    }

    
}



        return (
        <div className='raiseControls'>
            <Slider className='raiseSlider'
                min={props.bigBlind}
                max={props.my_seat.balance}
                step={props.bigBlind}
                value={isNaN(amt) ? (0):(amt)}
                orientation={'horizontal'}
                tooltip={false}
                onChange={handleSlide}
                />
            <Button  variant='dark' className='raiseButton actionItem' disabled={!validateForm()} onClick={handleClick}>{'Raise $'+(amt/100).toFixed(2)}</Button>
            <InputGroup className="raiseBtn raiseInput mb-3">
                <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="Amount" value={txtamt} onChange={handleTextEdit} />
            </InputGroup>

        </div> );
    
}
 
