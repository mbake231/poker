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

var tablename = "";

var card1 = "";
var card2 = "";
var card3 = "";
var card4 = "";
var card5 = "";

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

	socket.on('identify', function (cookie) {
		//console.log(PlayerList.getPlayerList());
		var cookieToFind = parseInt(cookie);
		if (PlayerList.findPlayerByCookie(cookieToFind)) {		
			var thisPlayer=PlayerList.findPlayerByCookie(cookieToFind);
			console.log("CONNECTED: "+thisPlayer.userid);	
			PlayerList.changeSessionID(thisPlayer.seat,socket.id);
			server.io.emit('handshake', true);

		}
	});
	/*
	socket.on('joinGame', function(joinDetails) {
	     // joinGame(userid, function (err, res) {

	    //  });
	    //console.log(joinDetails.userid,joinDetails.seat,joinDetails.balance,joinDetails.status);
	 	  joinGame(
	 	  	joinDetails.userid,
	    	joinDetails.seat,
	    	joinDetails.balance,
	    	joinDetails.status,
	    	sessionid);
	  });
	*/
	});


};


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



	if(status="playing") {
		playersActive++;
	}
	
	console.log("uid: "+userid+" seat: "+seat+" balance:"+balance+" status:"+status+"sid:"+sessionid+"cookie:"+cookie);
	PlayerList.addPlayer(seat,userid,balance,status,sessionid,cookie);

	update();

	//if (playersActive>2)
		//console.log("hi");
		//Hand.startHand();
}

function update(){

		var updatedPlayerList = PlayerList.getPlayerList();

		//console.log(updatedPlayerList);

		gameData.game_info.seatList.seat1.name = updatedPlayerList[0][0];
		gameData.game_info.seatList.seat1.balance = updatedPlayerList[0][1];
		gameData.game_info.seatList.seat1.status  = updatedPlayerList[0][2];
		gameData.game_info.seatList.seat2.name = updatedPlayerList[1][0];
		gameData.game_info.seatList.seat2.balance = updatedPlayerList[1][1];
		gameData.game_info.seatList.seat2.status = updatedPlayerList[1][2];
		gameData.game_info.seatList.seat3.name = updatedPlayerList[2][0];
		gameData.game_info.seatList.seat3.balance = updatedPlayerList[2][1];
		gameData.game_info.seatList.seat3.status = updatedPlayerList[2][2];
		gameData.game_info.seatList.seat4.name = updatedPlayerList[3][0];
		gameData.game_info.seatList.seat4.balance = updatedPlayerList[3][1];
		gameData.game_info.seatList.seat4.status = updatedPlayerList[3][2];
		gameData.game_info.seatList.seat5.name = updatedPlayerList[4][0];
		gameData.game_info.seatList.seat5.balance = updatedPlayerList[4][1];
		gameData.game_info.seatList.seat5.status = updatedPlayerList[4][2];
		gameData.game_info.seatList.seat6.name = updatedPlayerList[5][0];
		gameData.game_info.seatList.seat6.balance = updatedPlayerList[5][1];
		gameData.game_info.seatList.seat6.status = updatedPlayerList[5][2];
		gameData.game_info.seatList.seat7.name = updatedPlayerList[6][0];
		gameData.game_info.seatList.seat7.balance = updatedPlayerList[6][1];
		gameData.game_info.seatList.seat7.status = updatedPlayerList[6][2];
		gameData.game_info.seatList.seat8.name = updatedPlayerList[7][0];
		gameData.game_info.seatList.seat8.balance = updatedPlayerList[7][1];
		gameData.game_info.seatList.seat8.status = updatedPlayerList[7][2];
		gameData.game_info.seatList.seat9.name = updatedPlayerList[8][0];
		gameData.game_info.seatList.seat9.balance = updatedPlayerList[8][1];
		gameData.game_info.seatList.seat9.status = updatedPlayerList[8][2];


	    server.io.emit('update', gameData);

}

function newHand() {
	var deck = getDeck();
	
}










exports.startGame = startGame;

exports.update = update;

exports.joinGame = joinGame;


	


	