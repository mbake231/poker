import socketIOClient from "socket.io-client";

//const production  = 'https://fartmanjack.herokuapp.com:'+process.env.PORT ;
const production  = '';

const development = 'http://localhost:3000';
const url = (process.env.NODE_ENV=='production' ? production : development);


const socket = socketIOClient(url);


export default socket;
