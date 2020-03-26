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

//TESTS########



//TESTS##########

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
		sendDataToAllPlayers(game1);
	
	}
}

function nextHand(){
	game1.goToNextHand();
	
	//try to set deal to next guy but wll return who gets it (if guy you try to set to is sitting out)
	dealer=game1.setDealer(dealer.nextPlayer);
	game1.postBlinds();
	game1.dealHands();
	sendDataToAllPlayers(game1);
	game1.printSeats();
	game1.getNextAction();
	sendDataToAllPlayers(game1);
}

function sendSeatList(gameid,sessionid) {
	server.io.to(sessionid).emit('publicSeatList',game1.getPublicSeatList());
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

	//THIS IS A PROBLEM LOL
	thisGame=game1;
	var sendList = thisGame.getAllPlayerSessionIDs();
	var sessionidToSend;
	//var userHashToSend;
	for (var i=0; i<sendList.length;i++)
	{
			sessionidToSend=sendList[i].sessionid;
			//userHashToSend=sendList[i].userhash;
			//console.log('HERE IS THE SEND LIST SESSION ID '+ sessionidToSend+"  " +sendList[i].hash+ "    "+
			//	thisGame.generatePrivatePlayerData(sendList[i].hash));
			if(sendList[i]!=null)
				server.io.to(sessionidToSend).emit('update',thisGame.generatePrivatePlayerData(sendList[i].hash));
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

function toggleSitOut(gameid,hash) {
	game1.getPlayerByHash(hash).toggleSitOut();
}

function reconnect(gameid,cookie,newSessionId) {
	console.log("TRYING TO RECONNECT: "+cookie);
	if (game1.getPlayerByCookie(cookie) != false) {

		game1.getPlayerByCookie(cookie).updateSessionId(newSessionId);
		server.io.to(newSessionId).emit('yourHash',game1.getPlayerByCookie(cookie).hash);
		sendDataToAllPlayers(game1);
		console.log (game1.getPlayerByCookie(cookie).userid+" RECONNECTED");
	}
	else 
		console.log('couldnt reconnect player: didnt find clientID');

}



exports.addNewPlayerToGame = addNewPlayerToGame;
exports.runGame = runGame;
exports.incomingAction = incomingAction;
exports.sendSeatList=sendSeatList;
exports.nextHand = nextHand;
exports.reconnect = reconnect;
exports.toggleSitOut=toggleSitOut;
exports.sendDataToAllPlayers=sendDataToAllPlayers;

