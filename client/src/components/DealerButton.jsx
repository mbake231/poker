import React, { Component } from 'react';


class DealerButton extends Component {
   






    render() { 
       if(this.props.id==this.props.dealerSeat)
        return (
        <div>
            <div id={"dealerButton"+this.props.id}><img src={'/img/dealerButton.png'} width='25px' /></div>
 
        </div> );

        return (<div></div>);
    }
}
 
export default DealerButton;