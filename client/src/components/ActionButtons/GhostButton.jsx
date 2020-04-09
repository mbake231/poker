import React, { Component } from 'react';
import {

  Button
} from 'react-bootstrap';

class GhostButton extends Component {





    render() { 
        return (
        <div>
            <Button className='actionItem ghostBtn'></Button>
        </div> );
    }
}
 
export default GhostButton;