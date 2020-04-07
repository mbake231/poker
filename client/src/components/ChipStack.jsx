import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Badge from 'react-bootstrap/Badge'



export default function PlayerChevron(props) {

    var chipsAvailable = [5000*100,1000*100,500*100,100*100,25*100,20*100,10*100,5*100,2.5*100,1*100,0.5*100,0.25*100,0.1*100,0.01*100]
    var stack = [];
    var leftToStack = Number(props.chipstack);
    var stacked = 0;

    var ctr=0;
    var temp=Number(0);
    if(leftToStack>0) {
        while (leftToStack > 0) {
            if(Math.floor(leftToStack / Number(chipsAvailable[ctr])) >=1) {
                    temp=leftToStack; 
                for (var i=0;i<Math.floor(temp / chipsAvailable[ctr]);i++) {
                    stack.push(chipsAvailable[ctr]);
                    stacked+=chipsAvailable[ctr];
                    leftToStack= Number(leftToStack) - Number(chipsAvailable[ctr]);
                    leftToStack=Number(leftToStack);
                }
            }
            ctr++;
        }
    }
    console.log(stack);
      if(props.chipstack>0)
        return (
            <ul id={'chipstack'+props.id} className='chipStack'>
                {stack.map((chip,i) => {              
                    return <li className='chip' ><img src={'/img/chip.png'} /></li>

                    })}
                <Badge className='stackAmt' variant='light'>{'$'+(Number(props.chipstack)/100).toFixed(2)}</Badge>
            </ul>
            );
        else
            return (<div></div>);
    }

 
