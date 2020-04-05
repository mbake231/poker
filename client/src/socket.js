import socketIOClient from "socket.io-client";


const socket = socketIOClient(window.location.hostname+':3000');


export default socket;
