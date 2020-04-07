import React, { useState,Component } from 'react';
import Badge from 'react-bootstrap/Badge'

    export default function Pots(props) {
        
      
        return (
        <div id='pots'>
            <Badge id='totalPot' variant="primary">{'Total Pot: $'+props.totalPot}</Badge>
            <Badge id='roundPot' variant="success">{'This Round: $'+props.roundPot}</Badge>

        </div> );
    
}
 
