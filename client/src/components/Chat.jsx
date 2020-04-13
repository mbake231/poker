import React, { useState,Component,useLayoutEffect,useRef } from 'react';
import ScrollableFeed from 'react-scrollable-feed'
import InputGroup from 'react-bootstrap/InputGroup'
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import socket from '../socket'


export default function Chat(props) {


    const [message, setMessage] = useState("");



    function validateForm() {
        return message.length > 0 && message.length<400;
      }

    function handleClick(event) {
        event.preventDefault();
          var data = {gameid:props.gameid,
                        hash:props.my_id,
                        message:message}
          socket.emit('chatMessage',data);
          event.target.messageBox.value='';
      }

   
     
 
            return ( 
                <div id='Chat'>
                    <div id='ChatThread'>
                        <ScrollableFeed className='chatList'>    
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                <li className='chatBuffer'>.</li>
                                {props.chat.map((item,i) => {
                                    return <li>{props.chat[i]}</li>
                                    })}
                        </ScrollableFeed>
                    </div>
                    <div id='ChatInput'>
                    <form onSubmit={handleClick} autComplete='false' >
                    <InputGroup className="mb-3">
                        <FormControl
                        autoCorrect="false" 
                        placeholder="Chat"
                        name='messageBox'
                        aria-label="Chat"
                        aria-describedby="basic-addon2"
                        onChange={e => setMessage(e.target.value)}
                        clearButtonMode='always' 
                        
                        />
                        <InputGroup.Append>
                        <Button variant="outline-secondary" type='submit' disabled={!validateForm()} >Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </form>
                    </div>
                </div>

         );
        
    }



