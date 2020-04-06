import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import {Button} from "react-bootstrap";
import "./Chevron.css";
import socket from '../socket';
import './Board'
class PlayerChevron extends Component {


  componentDidMount() {
   

  }


    render() { 
 
            return ( 
                <div id='Board'>                        
                        {this.props.board.map((card,i) => {
                            if(this.props.board[i]!=null)
                             return <div id={"card"+i} className='boardCard'><img src={'/img/cards/'+this.props.board[i]+".svg"} width='65px' /></div>
                            })}
                </div>

         );
        
    }
}


export default PlayerChevron;