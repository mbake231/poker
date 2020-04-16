import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ChipStack from './ChipStack'
import { CSSTransitionGroup } from 'react-transition-group'
import './WinningChipStack.css'
import {
    isTablet,
    isMobile
  } from "react-device-detect";

class WinningChipStack extends Component { 
    constructor() {
        super();
        this.state = {
            slide:''
        }
        if(!isTablet && !isMobile) {
        this.raise = new Audio('/audio/raise.wav');
        this.raise.load();
        }
       // this.componentDidAppear=this.componentDidAppear.bind(this);
    }

    playAudio(audio) {
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

    componentDidMount() {
        
        this.setState({slide:'slideTo'+this.props.winningSeat});
        if(!isTablet && !isMobile)
            try {this.playAudio(this.raise);} catch (e){console.log(e)}
        /*
        var scope=this;
        setTimeout(
            function() {
                

            }
            .bind(scope),
            20);*/
    }




    render() { 
        return <div id='winningChips' className={this.state.slide}>
            <ChipStack id={'Winning'} className={this.props.winningSeat} chipstack={parseInt(this.props.amtWon)}></ChipStack>
            </div>
    }
}
export default WinningChipStack;