import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Badge from 'react-bootstrap/Badge'



export default function PlayerChevron(props) {

    var chipsAvailable = [5000,1000,500,100,25,20,10,5,2.5,1,0.5,0.25,0.1,0.01]
    var stack = [];
    var leftToStack = Number(props.chipstack);
    var stacked = 0;
    console.log('start to stack:'+leftToStack);

    var ctr=0;
    var temp=Number(0);
    if(leftToStack>0) {
        while (leftToStack > 0) {
            if(Math.floor(leftToStack / Number(chipsAvailable[ctr])) >=1) {
                    temp=leftToStack; 
                for (var i=0;i<Math.floor(temp / chipsAvailable[ctr]);i++) {
                    stack.push(chipsAvailable[ctr]);
                    stacked+=chipsAvailable[ctr];
                    leftToStack= Number(leftToStack.toFixed(2)) - Number(chipsAvailable[ctr].toFixed(2));
                    console.log(leftToStack+' '+ctr);
                }
            }
            ctr++;
        }
    }
    console.log(stack);
      
        return (
            <ul id={'chipstack'+props.id} className='chipStack'>
                {stack.map((chip,i) => {              
                    return <li className='chip' ><img src={'/img/chip.png'} /></li>

                    })}
                <Badge className='stackAmt' variant='light'>{'$'+props.chipstack}</Badge>
            </ul>
            );
    }

 
