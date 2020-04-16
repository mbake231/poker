import React, { useState,useEffect,Component } from 'react';
import "./Chevron.css";
import socket from '../socket';
import Badge from 'react-bootstrap/Badge'
import {
    isTablet,
    isMobile
  } from "react-device-detect";

    export default function PlayerCards(props) {

        const [card1Shown, setcard1Shown] = useState('');
        const [card2Shown, setcard2Shown] = useState('');
        if(!isTablet && !isMobile) {
        var flip = new Audio('/audio/flipcard.wav');
        flip.load();
        }
    function  playAudio(audio) {
            const audioPromise = audio.play()
            if (audioPromise !== undefined) {
              audioPromise
                .then(_ => {
                  // autoplay started
                })
                .catch(err => {
                  // catch dom exception
                  console.info(err)
                })
            }
          }

function showCard(e) {
    e.preventDefault();
    if(!isTablet && !isMobile)
        try {this.playAudio(flip);} catch (e){}
    var cardToShow=e.target.getAttribute('label');
    console.log(cardToShow)
    var data={
        gameid:props.gameid,
        hash: props.my_id,
        cardToShow: cardToShow
    }
    socket.emit('showMyCard', data);

    if(cardToShow=='card1')
        setcard1Shown('card1Shown');
    else if (cardToShow=='card2')
        setcard2Shown('card2Shown');

}

if(props.info!=null) {
        if (props.info.status == 'folded')
         {
            return ( 
                
                    <div className="cards">
                        <div id="card1"><img className={'card'+props.my_status} src={'/img/cards/'+props.info.card1+".svg"} width='65px' /></div>
                        <div id="card2"><img className={'card'+props.my_status} src={'/img/cards/'+props.info.card2+".svg"} width='65px' /></div>
                    </div>
                

         );
        }

         else if (props.info.status != 'sittingout')
         {
             return (
            
                    <div className="cards">
                        <div id="card1" className={card1Shown}>
                            <img  src={'/img/cards/'+props.info.card1+".svg"} width='65px' />
                           {props.id==props.my_seat_num ? (<p className='showCard' label='card1' onClick={showCard} >Show</p>):(<div></div>)} 
                        </div>
                        <div id="card2" className={card2Shown}>
                            <img  src={'/img/cards/'+props.info.card2+".svg"} width='65px' />
                            {props.id==props.my_seat_num ? (<p className='showCard' label='card2' onClick={showCard}>Show</p>):(<div></div>)} 
                        </div>
                    </div>
                
         );
        }
        
        else if(props.info.status=='sittingout') {
            return ( 
               
                    <div className="cards">
                        <Badge variant="dark">Sitting Out</Badge>
                    </div>

         );
        }
}
        else
            return (<div></div>);
        
    }



