var User = require('./models/User');
var Table = require('./models/Table');
var Game = require('./models/Game');
var Deck = require('./Deck');
var Hand = require('./Hand');
var PlayerList = require('./PlayerList');

var express=require('express');
var app=express();
var db = require('./db');
var currentPot = 0;
var minRaise = 0;
var seatList = ({});
var server = require('./server');
var globalSocket;
var tablename = "";

var card1 = "";
var card2 = "";
var card3 = "";
var card4 = "";
var card5 = "";

var gameStarted=false;

var smallblind = 0;
var bigblind = 0;

var playersActive = 0;

var gameData = {
	

	//game
	game_info:{
		currentPot: 10,
		minRaise: 1,
		seatList: {
			seat1: {
				name: "mike",
				balance: "4.23",
				status: "playing"
			} ,
			seat2: {
				name: "dan",
				balance: "24.23",
				status:"playing"
			} ,
			seat3: {
				name: "shane",
				balance: "43.23",
				status: "playing"
			} ,
			seat4: {
				name: "todd",
				balance: "124.23",
				status: "playing"
			},
			seat5: {
				name: null,
				balance: null,
				status: "empty"
			},
			seat6: {
				name: "clint",
				balance: "0.23",
				status: "playing"
			},
			seat7: {
				name: "mark",
				balance: "1224.23",
				status: "out"
			},
			seat8: {
				name: "tony",
				balance: "90.23",
				status: "out"
			},
			seat9: {
				name: null,
				balance: null,
				status: "empty"
			}
		},
		actionOnPlayer: 'Who knows',
		card1: 'Ad',
		card2: '4c',
		card3: '5d',
		card4: 'Kd',
		card5: 'Jd'
	},
	//table
	table_info:{
		tablename: "Mikes World'",
		smallblind: 4,
		bigblind: 3
	}
};



function startGame(tableid) {

	
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

};

function sendHands() {

	for (var i=0;i<9;i++) {
				if (PlayerList.getPlayer(i).status=="inhand") {

					console.log("SESSION "+PlayerList.getPlayer(i).sessionid+" CARD "+
						JSON.stringify(PlayerList.getPrivatePlayerData(PlayerList.getPlayer(i))));


					server.io.to(
						PlayerList.getPlayer(i).sessionid)
						.emit(
							'newhand',
							PlayerList.getPrivatePlayerData(PlayerList.getPlayer(i))
							);
				}
			}

}

function checkToStartGame() {
	if(playersActive<2) {
		return false;
	}
	else if(playersActive>1 && !gameStarted) {
		gameStarted = true;
		return true;
	}
	else
		return false;
}

function joinGame(userid,seat,balance,status,sessionid,cookie) {

	/*NEED TO FIX GETTING STUFF FROM DB
	db.getUser(userid, function (err, user) {
		if (!err) {
			console.log("added player");
			players.AddPlayer(seat,user.username,balance,status);
			
			 update();
		}
	});
	//console.log(seat,userid,balance,status);*/
	
	console.log("uid: "+userid+" seat: "+seat+" balance:"+balance+" status:"+status+"sid:"+sessionid+"cookie:"+cookie);
	PlayerList.addPlayer(seat,userid,balance,status,sessionid,cookie);
}


function updatePlayer(player, payload) {
	server.io(PlayerList.getPlayer(player).sessionid).emit('update', payload);

}

function getPublicGameData(){
		console.log(JSON.stringify(this));
		return JSON.stringify(this,function( key, value) {
 		if(key == 'nextPlayer') { 
    	return "removedForStringify";
  		} else {
    	return value;
  		};
});

}

exports.startGame = startGame;
//exports.update = update;
exports.joinGame = joinGame;
exports.sendHands = sendHands;

exports.startGame = startGame;



	