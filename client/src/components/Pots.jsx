import React, { useState,Component } from 'react';
import Badge from 'react-bootstrap/Badge'

    export default function Pots(props) {
        
      
        
        if(props.totalPot+props.roundPot>0 && props.isSettled=='no')
        return (
        <div id='pots'>
            <Badge id='totalPot' variant="primary">{'Total Pot: $'+((Number(props.totalPot)+Number(props.roundPot))/100).toFixed(2)}</Badge>
            <Badge id='roundPot' variant="success">{'This Round: $'+(Number(props.roundPot)/100).toFixed(2)}</Badge>

        </div> );
        else
            return (
            <div id='pots'>
            </div> );
    
}
 
