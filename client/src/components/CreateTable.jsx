import React, { useState } from "react";
import { Form, Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import socket from '../socket'
import { useHistory } from "react-router-dom";



export default function CreateTable(props) {

  const [bigblind, setBigBlind] = useState("");
  const [smallblind, setSmallBlind] = useState("");
  const [dropdown, setDropDown] = useState("008016");
  const [hidden, setHidden] = useState('hidden');
  const [hideLabel, sethideLabel] = useState({display:'none'});


function changeDropDown(val) {
   // var blinds = e.target.value;
    setDropDown(val);

    if(val=='custom') {
        setHidden('');
        sethideLabel({display:'block'});
    }
    else {
        setHidden('hidden');
        sethideLabel({display:'none'});
    }
    
}

  function validateForm() {
    return (
    ( (Number(bigblind) > Number(smallblind)) || (bigblind ==0 && smallblind==0)) &&
        (isNaN(smallblind)==false  && isNaN(bigblind)==false) &&
       (bigblind>=0 && smallblind>=0)
    )
           || dropdown!='custom';
  }


  let history = useHistory();
  socket.on('createGame',gameid => {
    
    history.push('/table/'+gameid);
    window.location.reload();
  });

  function handleSubmit(event) {

    event.preventDefault();
    
    console.log(dropdown)

    var data;

    if(dropdown=='custom') {
     if((bigblind==0 && smallblind==0) || (Number(bigblind) > Number(smallblind)))
        if(isNaN(smallblind)==false  && isNaN(bigblind)==false)
            if (bigblind >=0 && smallblind>=0){
                 data = {smallblind:smallblind*100,
                            bigblind:bigblind*100};
                            socket.emit('createGame', data);

            }
        }
    else {
        if(dropdown=='008016') {
            data = {smallblind:.08*100,
            bigblind:.16*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='010020') {
            data = {smallblind:.10*100,
            bigblind:.20*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='020040') {
            data = {smallblind:.20*100,
            bigblind:.40*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='025050') {
            data = {smallblind:.25*100,
            bigblind:.50*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='050100') {
            data = {smallblind:.50*100,
            bigblind:1.00*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='200400') {
            data = {smallblind:2.00*100,
            bigblind:4.00*100};
            socket.emit('createGame', data);
        }
        else if(dropdown=='5001000') {
            data = {smallblind:5.00*100,
            bigblind:10.00*100};
            socket.emit('createGame', data);
        }
    }


}
  return (
    <div className="CreateTable">
      <form onSubmit={handleSubmit} autoComplete='off'>
      <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Game</Form.Label>
    <Form.Control as="select">
      <option>Texas Hold'em No Limit Cash Game</option>
      
    </Form.Control>
  </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Blinds</Form.Label>
    <Form.Control as="select" onChange={e=>changeDropDown(e.target.value)}>
      <option value='008016'>$0.08 / $0.16</option>
      <option value='010020'>$0.10 / $0.20</option>
      <option value='020040'>$0.20 / $0.40</option>
      <option value='025050'>$0.25 / $0.50</option>
      <option value='050100'>$0.50 / $1.00</option>
      <option value='200400'>$2.00 / $4.00</option>
      <option value='5001000'>$5.00 / $10.00</option>
      <option value='custom'>Custom</option>

    </Form.Control>
  </Form.Group>
        <FormGroup controlId="bigblind" bssize="large" style={hideLabel}>
          <FormLabel>Small Blind</FormLabel>
          <FormControl
            type={hidden}
            value={smallblind}
            onChange={e => setSmallBlind(e.target.value)}
           
          />
          
        </FormGroup>
        <FormGroup controlId="smallblind" bssize="large" style={hideLabel}>
          <FormLabel>Big Blind</FormLabel>
          <FormControl
            value={bigblind}
            type={hidden}
            onChange={e => setBigBlind(e.target.value)}
          />
        </FormGroup>
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Create My Table
        </Button>
      </form>
    </div>
  );
}