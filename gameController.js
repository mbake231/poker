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
/*
var mike = new player("mike",'cookie',300,'playing','sid');
var kim = new player("kim",'cookie',400,'playing','sid');
var shane = new player("shane",'cookie',1000,'playing','sid');
var kev = new player("kev",'cookie',100,'playing','sid');
var clint = new player("clint",'cookie',1000,'playing','sid');
var bob = new player("bob",'cookie',200,'playing','sid');

game1.addPlayer(mike,0);
game1.addPlayer(kim,1);
game1.addPlayer(shane,2);
game1.addPlayer(kev,3);
game1.addPlayer(clint,4);
game1.addPlayer(bob,8);

game1.setDealer(mike);

//game1.foldPlayer(bob);
//game1.foldPlayer(clint);
//game1.firstRound();

game1.postBlinds();
game1.dealHands();
game1.printSeats();
game1.getNextAction();
game1.doAction(kev,'raise',98);
game1.printSeats();
game1.getNextAction();
game1.doAction(clint,'call');
game1.getNextAction();
game1.printSeats();
game1.doAction(bob,'raise',100);
game1.getNextAction();
game1.printSeats();
game1.doAction(mike,'call');
game1.getNextAction();
game1.printSeats();
game1.doAction(kim,'raise',100);
game1.getNextAction();
game1.printSeats();
game1.doAction(shane,'call');
game1.getNextAction();
game1.printSeats();
game1.doAction(clint,'call');
game1.getNextAction();
game1.printSeats();
game1.doAction(mike,'call');
game1.printSeats();
game1.printGamePots();
game1.getNextAction();
game1.printSeats();
game1.doAction(kim,'check',100);
game1.getNextAction();

game1.doAction(shane,'check',100);
game1.getNextAction();

game1.doAction(clint,'check',100);
game1.getNextAction();

game1.printSeats();


game1.doAction(kim,'check',100);
game1.getNextAction();

game1.doAction(shane,'check',100);
game1.getNextAction();

game1.doAction(clint,'check',100);
game1.getNextAction();

game1.doAction(kim,'check',100);
game1.getNextAction();

game1.doAction(shane,'check',100);
game1.getNextAction();

game1.doAction(clint,'check',100);
game1.getNextAction();

game1.doAction(kim,'check',100);
game1.getNextAction();

game1.doAction(shane,'check',100);
game1.getNextAction();

game1.doAction(clint,'check',100);
game1.getNextAction();

game1.getNextAction();
game1.printSeats();

*/

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

