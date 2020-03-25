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



function incomingAction(game,user,action,amt){

	if(game1.getRound()<4) {
		game1.doAction(game1.getPlayerByHash(user), action, amt);
		if(game1.getRound()<4){
			game1.getNextAction();
			sendDataToAllPlayers(game1);
			game1.printSeats();
		}
		else {
			sendDataToAllPlayers(game1);
			console.log("FINALLY OVER");
		}
	}
else {

	
	}
}

function nextHand(){
	game1.goToNextHand();
	game1.setDealer(dealer.nextPlayer);
	dealer=dealer.nextPlayer;
	game1.postBlinds();
	game1.dealHands();
	sendDataToAllPlayers(game1);
	game1.printSeats();
	game1.getNextAction();
	sendDataToAllPlayers(game1);
}

function sendSeatList(gameid,sessionid) {
	server.io.to(sessionid).emit('publicSeatList',game1.getPublicSeatList());
	console.log(game1.getPublicSeatList());
}


function addNewPlayerToGame (gameHash,userid,cookie,balance,status,seat,sessionid) {
	
	//did they already join?
	if(game1.findPlayerBySessionID(sessionid) == false) {
		//constructor(userid,cookie,balance,status,sessionid) {
		var newPlayer = new player(userid,cookie,Number(balance),status,sessionid);
		
		//some point will need to look up game by hash and add that way
		game1.addPlayer(newPlayer,seat);
		game1.printSeats();


		server.io.to(sessionid).emit('yourHash',newPlayer.hash);



		sendDataToAllPlayers(game1);
	}
	else {
		console.log("this session is already sitting");
	}

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
	sendDataToAllPlayers(game1);
	game1.printSeats();
	game1.getNextAction();
	sendDataToAllPlayers(game1);

}

function startSocketConnetion () {
		//server.io.on('connection', function(socket){

		
}



function sendDataToAllPlayers(thisGame) {
	//console.log(game1.generatePrivatePlayerData());
	var sendList = thisGame.getAllPlayerSessionIDs();


	var sessionidToSend;
	//var userHashToSend;
	for (var i=0; i<sendList.length;i++)
	{
			sessionidToSend=sendList[i].sessionid;
			//userHashToSend=sendList[i].userhash;
			server.io.to(sessionidToSend).emit('update',thisGame.generatePrivatePlayerData(sessionidToSend));
//			server.io.on('connection', function(socket){

//				console.log(sessionidToSend+" is (emitting) user "+userHashToSend);
				//server.update(thisGame);
//				socket.emit('update',thisGame.generatePrivatePlayerData(socket.id));
				//server.io.to(sessionidToSend).emit('update',thisGame.generatePrivatePlayerData(userHashToSend));
//			});
	}
	//getPLayers |UNique payload and send it to thier sessionid
	//game.getPlayers
	//server.io(PlayerList.getPlayer(player).sessionid).emit('update', payload);

}



exports.addNewPlayerToGame = addNewPlayerToGame;
exports.runGame = runGame;
exports.incomingAction = incomingAction;
exports.sendSeatList=sendSeatList;
exports.nextHand = nextHand;

