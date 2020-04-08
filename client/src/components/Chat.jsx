import React, { Component } from 'react';


class Chat extends Component {


    componentDidUpdate() {
        this.scrollToBottom();
      }

      scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }


    render() { 
 
            return ( 
                <div id='Chat'>
                    <ul className='chatList'>                        
                            {this.props.chat.map((item,i) => {
                                return <li>{this.props.chat[i]}</li>
                                })}
                            <li style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}></li>
                    </ul>
                    
                </div>

         );
        
    }
}


export default Chat;