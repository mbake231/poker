import socketIOClient from "socket.io-client";

//const production  = 'https://fartmanjack.herokuapp.com:'+process.env.PORT;
const production  = '';

//PC
//const development = 'http://localhost:3000';

//iPhone
const development = 'http://172.20.10.4:3000';

const url = (process.env.NODE_ENV=='production' ? production : development);


const socket = socketIOClient(url);


export default socket;