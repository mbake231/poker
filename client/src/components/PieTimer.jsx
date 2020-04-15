import React from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./PieTimer.css";


export default function PieTimer(props) {


const renderTime = value => {
  if (value === 0) {
    
  }
}

  return (
   <div className='pieTimer'>
      <CountdownCircleTimer
        isPlaying
        durationSeconds={10}
        colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#ff007f"]]}
        renderTime={renderTime}
        onComplete={() => [false, 1000]}
        size={50}
      />
    </div>
  );

}
