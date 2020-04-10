import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import {Button} from "react-bootstrap";
import "./Chevron.css";
import socket from '../socket';
import './Board'
import ReactCardFlip from 'react-card-flip';


class PlayerChevron extends Component {
  constructor() {
    super()
    this.state = {
      card0Flipped:false,
      card1Flipped:false,
      card2Flipped:false,
      card3Flipped:false,
      card4Flipped:false,
      isItRunOut: false

    };
   // this.flipCards=this.flipCards.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);
    this.componentDidUpdate=this.componentDidUpdate.bind(this);

  }

  componentDidUpdate() {
   
    if(this.state.isItRunOut)
      this.flipTurnRiverCards(2000);
    
    else if (this.props.board[3]!=null && !this.state.isItRunOut)
        this.flipTurnRiverCards();
  
  }

  componentDidMount() {
    if(this.props.board[3]!=null)
          this.setState({isItRunOut:true})
   
    this.flipFlop();


  }

    flipFlop() {

    const scope = this;
     window.requestAnimationFrame(function() {
      setTimeout(
        function() {
          scope.setState(prevState => ({['card'+0+'Flipped']:true}));
        }
        .bind(scope),
        750);
      
      setTimeout(
        function() {
          scope.setState(prevState => ({['card'+1+'Flipped']:true}));
        }
        .bind(scope),
        1250);

        setTimeout(
          function() {
            scope.setState(prevState => ({['card'+2+'Flipped']:true}));
          
          }
          .bind(scope),
          1750);

        })
     
      }



  flipTurnRiverCards(delay) {
    const scope = this;
    if(this.props.board[3]!=null){
    window.requestAnimationFrame(function() {
     setTimeout(
       function() {
         scope.setState(prevState => ({['card'+3+'Flipped']:true}));
       }
       .bind(scope),
       750+(delay*1.25));
      })
    }
    
    if(this.props.board[4]!=null){
    window.requestAnimationFrame(function() {
      
     setTimeout(
       function() {
         scope.setState(prevState => ({['card'+4+'Flipped']:true}));
       }
       .bind(scope),
       850+(delay*2));

       })
     }
    

    }
    

 /*   for(var i=0;i<this.props.board.length;i++)
    {
      if(['this.state.card'+i+'.isFlipped'] == false)
        this.setState(({ [`key$('card'+i+'isFlipped')`]: true }));
    }*/

  


    render() { 
 
            return ( 
                <div id='Board'>                        
                        {this.props.board.map((card,i) => {
                            if(this.props.board[i]!=null) {

                              return (
                            <ReactCardFlip isFlipped={this.state['card'+i+'Flipped']} flipDirection="horizontal">
                              <div  id={"card"+i} className='boardCard'><img src={'/img/cards/private.svg'} width='65px' /></div>
                              
                              <div id={"card"+i} className='boardCard'><img src={'/img/cards/'+this.props.board[+i]+".svg"} width='65px' /></div>
                             </ReactCardFlip>)
                             }
                         })
                        
                        }
                </div>

         );
        
    }
}


export default PlayerChevron;

//                             return <div id={"card"+i} className='boardCard'><img src={'/img/cards/'+this.state.board[i]+".svg"} width='65px' /></div>
