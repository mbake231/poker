var express=require('express');
var app=express();
var db = require('./db');
var server = require('./server');
var player = require('./classes/player.js').player;
var game = require('./classes/game.js').game;

//create a game

var game1 = new game();
console.log("started game");

var gameCount = 0;

var firstDealer;
var dealer;

function joinGame (userid,cookie,balance,status,seat) {
	
	var newPlayer = new player(userid,cookie,balance,status,sessionid);
	game1.addPlayer(newPlayer,seat);
	game1.printSeats();
	sendData();
	startSocketConnetion();


}

function runGame() {

	if(gameCount==0)
	{
		console.log("this is the first game");
		dealer = game1.getLowestOccupiedSeat();
	}
	else {
		console.log("game count is "+gameCount);
		dealer = dealer.nextPlayer;
	}
	game1.setDealer(dealer);
	game1.postBlinds();
	game1.dealHands();
	sendData();
	game1.printSeats();
	game1.getNextAction();
	sendData();

}

function startSocketConnetion () {
		server.io.on('connection', function(socket){
		var cookieToFind = parseInt(cookie);

		//listen for start game
		socket.on('startGame', function () {
			runGame();
			});

		});
}



function sendData() {
	//console.log(game1.generatePrivatePlayerData());
	server.io.on('connection', function(socket){

		socket.emit('update',game1.generatePrivatePlayerData());
		socket.broadcast.emit('update',game1.generatePrivatePlayerData());
	});
	//getPLayers |UNique payload and send it to thier sessionid
	//game.getPlayers
	//server.io(PlayerList.getPlayer(player).sessionid).emit('update', payload);

}



exports.joinGame = joinGame;
