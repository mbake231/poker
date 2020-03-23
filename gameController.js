var express=require('express');
var app=express();
var db = require('./db');
var server = require('./server');
var player = require('./classes/player.js').player;
var game = require('./classes/game.js').game;

//create a game

var game1 = new game();
console.log("started game");

function startConnection (cookie) {
	server.io.on('connection', function(socket){

			//console.log("connected");
			//globalSocket=socket;

	socket.on('identify', function (cookie) {

		var cookieToFind = parseInt(cookie);

		//if this person has the cookie of the registered account
		if (PlayerList.findPlayerByCookie(cookieToFind)) {		
			var thisPlayer=PlayerList.findPlayerByCookie(cookieToFind);
			console.log("AUTHORIZED: "+thisPlayer.userid+" ON SEAT: "+thisPlayer.seat+ " SESSION: "+socket.id);	
			
			//store session id if they match

			PlayerList.changeSessionID(thisPlayer.seat,socket.id);

			//server.io.to(PlayerList.getPlayer(0).sessionid).emit('newhand',"hello seat 0");

			//send confirm
			socket.emit('handshake', true);

			//increase players playing if this guy is active
			if (thisPlayer.status=='playing')
				playersActive++;

			//update public game data to this client and everyone
			socket.emit('update',PlayerList.getPublicPlayerData());
			socket.broadcast.emit('update',PlayerList.getPublicPlayerData());


			//check to see if i should start the game 
			
			if(checkToStartGame()){
				console.log("LETS SHUFFLE AND DEAL");
				Hand.startHand();

				socket.emit('handdetails',Hand.getHandDetails());
				socket.broadcast.emit('handdetails',Hand.getHandDetails());
			}

		}

		//listen for bet
		socket.on('sendBet', function (bet) {
			Hand.processAction(socket.id,bet); 

			socket.emit('update',PlayerList.getPublicPlayerData());
			socket.broadcast.emit('update',PlayerList.getPublicPlayerData());

			socket.emit('handdetails',Hand.getHandDetails());
			socket.broadcast.emit('handdetails',Hand.getHandDetails());


		});

		});
	});
}

function joinGame (userid,cookie,balance,status,seat) {
	


	server.io.on('connection', function(socket){

	socket.on('identify', function (cookie) {

		var cookieToFind = parseInt(cookie);

		//listen for bet
		socket.on('sendBet', function (bet) {
			Hand.processAction(socket.id,bet); 

			socket.emit('update',PlayerList.getPublicPlayerData());
			socket.broadcast.emit('update',PlayerList.getPublicPlayerData());

			socket.emit('handdetails',Hand.getHandDetails());
			socket.broadcast.emit('handdetails',Hand.getHandDetails());


		});

		});
	});

	var newPlayer = new player(userid,cookie,balance,status,sessionid);
	game1.addPlayer(newPlayer,seat);
	game1.printSeats();
	
}

function sendData() {

	//getPLayers |UNique payload and send it to thier sessionid
	//game.getPlayers
	//server.io(PlayerList.getPlayer(player).sessionid).emit('update', payload);

}



exports.joinGame = joinGame;
