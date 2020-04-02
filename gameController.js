var express=require('express');
var app=express();
var db = require('./db');
var server = require('./server');
var player = require('./classes/player.js').player;
var game = require('./classes/game.js').game;
var Promise = require("bluebird");
var Promise=require('bluebird');

//create a game

//var game1 = new game();
console.log("Started game.");
var gameCount = 0;

var firstDealer;
var dealer;
var handLogSentIndex=0;

//TESTS########

//TESTS########


function addNewPlayerToGame (gameHash,_id,balance,status,seat,sessionid) {
	
	//did they already join?
	if(game1.getPlayerByHash(_id) == false) {
		//constructor(userid,cookie,balance,status,sessionid) {
		var newPlayer = new player(_id,Number(balance),status,sessionid);
		newPlayer.setUserId(_id);
		//some point will need to look up game by hash and add that way
		game1.addPlayer(newPlayer,seat);
		game1.printSeats();

		sendDataToAllPlayers(game1);
	}
	else {
		console.log("This user is already sitting");
	}

}



function runGame() {

	checkToStartNextHand();
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
			console.log("FINALLY OVER1");
		}
	}
	else {
		sendDataToAllPlayers(game1);
		console.log("FINALLY OVER2");
	}
}

function nextHand(){

	game1.goToNextHand();
	checkToStartNextHand();
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
// url / game / game_id <it gets the json for that gameid
function sendDataToAllPlayers(thisGame) {
	//THIS IS A PROBLEM LOL
	thisGame=game1;
	var sendList = thisGame.getAllPlayerSessionIDs();
//	console.log(sendList);
	var sessionidToSend;
	var handlogThisSession = (game1.getHandLog().length) - handLogSentIndex;
	for (var i=0; i<sendList.length;i++)
	{
			sessionidToSend=sendList[i].sessionid;
			if(sendList[i]!=null) {
				console.log('sending to '+sessionidToSend);
				server.io.to(sessionidToSend).emit('update',thisGame.generatePrivatePlayerData(sendList[i].hash));

							for(var b = 0; b <= handlogThisSession;b++) {
								server.io.to(sessionidToSend).emit('logEvent',game1.getHandLog()[handLogSentIndex+b] );
							}
							//reset log 
							
				}
	}
	handLogSentIndex+=handlogThisSession;
}

//this checks to see if game is over every 2seconds then it calls next fx to wait 3 seconds and reset
function checkToStartNextHand() {
	if(game1.isSettled()==true)
	  triggerNextHand();
	else {
		//console.log("ping");
		return Promise.delay(2000).then(() => checkToStartNextHand());
	}
  }
  function triggerNextHand() {
	  setTimeout(function(){ nextHand(); }, 3000);
  }

function toggleSitOut(gameid,hash) {
	game1.getPlayerByHash(hash).toggleSitOut();
}

function checkValidUser(gameid,hash) {
	return game1.doesPlayerExistByHash(hash);

}

function reconnect(gameid,hash,newSessionId) {
	console.log("TRYING TO RECONNECT: "+hash);
	if (game1.getPlayerByHash(hash) != false) {

		game1.getPlayerByHash(hash).updateSessionId(newSessionId);
		//server.io.to(newSessionId).emit('yourHash',game1.getPlayerByCookie(cookie).hash);
		sendDataToAllPlayers(game1);
		console.log (game1.getPlayerByHash(hash).userid+" RECONNECTED");
	}
	else 
		console.log('couldnt reconnect player: didnt find clientID');

}

function leaveTableNextHand (game,hash) {

	game1.leaveTableNextHand(hash);
	sendSeatList();
	sendDataToAllPlayers(game1);

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
			, 1000*(game1.getTimerLength()+2));
}

function sendSeatList(gameid,sessionid) {
	server.io.to(sessionid).emit('publicSeatList',game1.getPublicSeatList());
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
exports.checkValidUser=checkValidUser;