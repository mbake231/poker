import React, { useState,Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import socket from '../../socket';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import './ActionButtons.css'

    export default function RaiseButton(props) {
        const [amt, setAmt] = useState("");
        function validateForm() {
            return amt.length > 0 && isNaN(amt)==false;
      }

 
 function handleClick(e) {
    e.preventDefault();
    console.log(amt);
    var actionpackage = {gameid:props.gameid,
                        hash:props.my_id,
                        action:'raise',
                        amt:(Number(amt)*100)
                    };
    socket.emit('incomingAction',actionpackage);
 }




        return (
        <div id='raiseModule'>
            <Button className='actionItem' disabled={!validateForm()} onClick={handleClick}>{'Raise $'+amt}</Button>
            <InputGroup className="raiseBtn raiseInput mb-3">
                <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="Amount" onChange={e => setAmt(e.target.value)} />
            </InputGroup>

        </div> );
    
}
 
