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
var handLogSentIndex=0;

//TESTS########
/*
var mike = new player("mike",'cookie',100,'playing','sid');
var kim = new player("kim",'cookie',100,'playing','sid');
var shane = new player("shane",'cookie',400,'playing','sid');
var bob = new player("shane",'cookie',400,'playing','sid');

var grg = new player("shane",'cookie',400,'playing','sid');
var rer = new player("shane",'cookie',400,'playing','sid');


game1.addPlayer(mike,0);
game1.addPlayer(kim,1);
game1.addPlayer(grg,2);
game1.addPlayer(bob,7);
game1.addPlayer(rer,8);



game1.setDealer(mike);

//game1.foldPlayer(bob);
//game1.foldPlayer(clint);
//game1.firstRound();

game1.postBlinds();
game1.dealHands();
game1.printSeats();
game1.getNextAction();
game1.doAction(mike,'raise',98);
game1.printSeats();

game1.getNextAction();
game1.doAction(kim,'call',98);
game1.getNextAction();
game1.doAction(grg,'call',98);
game1.getNextAction();
game1.doAction(bob,'call',98);
game1.printSeats();

game1.getNextAction();



game1.printSeats();
*/
//TESTS##########

function leaveTableNextHand (game,hash) {

	game1.leaveTableNextHand(hash);
	sendSeatList();
	sendDataToAllPlayers(game1);

}

function incomingAction(game,user,action,amt){

	var userActing = game1.getPlayerByHash(user);
	if(game1.getRound()<4) {
		game1.doAction(userActing, action, amt);
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
	sendDataToAllPlayers(game1);
	//try to set deal to next guy but wll return who gets it (if guy you try to set to is sitting out)
	if(game1.canIDeal()==true) {
		dealer=game1.setDealer(dealer.nextPlayer);
		game1.postBlinds();
		game1.dealHands();
		sendDataToAllPlayers(game1);
		game1.printSeats();
		game1.getNextAction();
		sendDataToAllPlayers(game1);
	}
	else
		console.log("need more than one player!");
}

function callClock (gameid) {
	game1.callClock();
	var scope = this;
	//have to send new data after clock expires
	var timer = setTimeout(
			function (){
				scope.sendDataToAllPlayers(game1);
				console.log('times up');
			}
			, 1000*(game1.getTimerLength()+2))
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


function sendDataToAllPlayers(thisGame) {
	//THIS IS A PROBLEM LOL
	thisGame=game1;
	var sendList = thisGame.getAllPlayerSessionIDs();
	var sessionidToSend;
	var handlogThisSession = (game1.getHandLog().length) - handLogSentIndex;
	for (var i=0; i<sendList.length;i++)
	{
			sessionidToSend=sendList[i].sessionid;
			if(sendList[i]!=null) {
				server.io.to(sessionidToSend).emit('update',thisGame.generatePrivatePlayerData(sendList[i].hash));

							for(var b = 0; b <= handlogThisSession;b++) {
								server.io.to(sessionidToSend).emit('logEvent',game1.getHandLog()[handLogSentIndex+b] );
							}
							//reset log 
							
				}
	}
	handLogSentIndex+=handlogThisSession;
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
exports.leaveTableNextHand=leaveTableNextHand;
exports.callClock=callClock;
