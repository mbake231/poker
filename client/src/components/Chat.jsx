import React, { Component } from 'react';
import ScrollableFeed from 'react-scrollable-feed'

class Chat extends Component {


    componentDidMount() {
     //   this.scrollToBottom();
      }

      scrollToBottom = () => {
       // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
       //    <li style={{ float:"left", clear: "both" }}
     //  ref={(el) => { this.messagesEnd = el; }}></li>
      }


    render() { 
 
            return ( 
                <div id='Chat'>
                    <ScrollableFeed className='chatList'>                        
                            {this.props.chat.map((item,i) => {
                                return <li>{this.props.chat[i]}</li>
                                })}
                    </ScrollableFeed>
                    
                </div>

         );
        
    }
}


export default Chat;