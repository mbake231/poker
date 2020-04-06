import socketIOClient from "socket.io-client";

const production  = 'https://fartmanjack.herokuapp.com:3000';
const development = 'http://localhost:3000/';
const url = (process.env.NODE_ENV ? production : development);

const socket = socketIOClient('http://localhost:3000');


export default socket;
