import socketIOClient from "socket.io-client";

const production  = '';
const development = 'http://localhost:3000';
const url = (process.env.NODE_ENV=='production' ? production : development);


const socket = socketIOClient(url);


export default socket;
