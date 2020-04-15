import React, {useState} from "react";
import { Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import socket from '../socket'
import SitNextHandButton from './GameMenuButtons/SitNextHandButton';
import LeaveTableButton from './GameMenuButtons/LeaveTableButton';
import CallClockButton from './GameMenuButtons/CallClockButton';
import SitBackDownButton from './GameMenuButtons/SitBackDownButton';
import AddChipsButton from './GameMenuButtons/AddChipsButton';


export default function GameMenu(props) {

if(props.my_seat!=null) {
    if(props.my_seat.status=='folded' || props.my_seat.status=='inhand' || props.my_seat.status=='allin') {
    return (
        <div id='gameMenu'>
                <CallClockButton gameid={props.gameid} my_id={props.my_id} clockCalled={props.clockCalled}></CallClockButton>
                <AddChipsButton addChipsModalOpen={props.addChipsModalOpen} toggleAddChipsModal={props.toggleAddChipsModal.bind(this)} gameid={props.gameid} my_id={props.my_id}></AddChipsButton>
                <SitNextHandButton gameid={props.gameid} my_id={props.my_id}></SitNextHandButton>
                <LeaveTableButton gameid={props.gameid} my_id={props.my_id}></LeaveTableButton>
        </div>
    );
    }
    else if(props.my_seat.status=='playing') {
    return (
        <div id='gameMenu'>
                <Button className='ghostBtn'></Button>
                <Button className='ghostBtn'></Button>
                <AddChipsButton addChipsModalOpen={props.addChipsModalOpen} toggleAddChipsModal={props.toggleAddChipsModal.bind(this)} gameid={props.gameid} my_id={props.my_id}></AddChipsButton>
                <LeaveTableButton gameid={props.gameid} my_id={props.my_id}></LeaveTableButton>
        </div>
    );
    }
    else if(props.my_seat.status=='sittingout') {
    return (
        <div id='gameMenu'>
                <Button className='ghostBtn'></Button>
                <AddChipsButton addChipsModalOpen={props.addChipsModalOpen} toggleAddChipsModal={props.toggleAddChipsModal.bind(this)} gameid={props.gameid} my_id={props.my_id}></AddChipsButton>
                <SitBackDownButton gameid={props.gameid} my_id={props.my_id}>Sit back down</SitBackDownButton>
                <LeaveTableButton gameid={props.gameid} my_id={props.my_id}></LeaveTableButton>
        </div>
    );
    }
}
  else
    return (<div></div>);

}