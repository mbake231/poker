var User = require('./models/User');
var Table = require('./models/Table');
var Game = require('./models/Game');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express=require('express');
var app=express();

var currentPot = 0;
var minRaise = 0;
var seatList = ({});

var tablename = "";

var card1 = "";
var card2 = "";
var card3 = "";
var card4 = "";
var card5 = "";

var smallblind = 0;
var bigblind = 0;

var actionOnPlayer = "";

var gameData = {
	

	//game
	game_info:{
		currentPot: 10,
		minRaise: 1,
		seatList: {
			seat1: {
				name: "mike",
				stack: "4.23"
			} ,
			seat2: {
				name: "dan",
				stack: "24.23"
			} ,
			seat3: {
				name: "shane",
				stack: "43.23"
			} ,
			seat4: {
				name: "todd",
				stack: "124.23"
			},
			seat5: {
				name: null,
				stack: null
			},
			seat6: {
				name: "clint",
				stack: "0.23"
			},
			seat7: {
				name: "mark",
				stack: "1224.23"
			},
			seat8: {
				name: "tony",
				stack: "90.23"
			},
			seat9: {
				name: null,
				stack: null
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

	http.listen(3001, function(){
	  console.log('listening on *:3001');
	});
	
	io.on('connection', function(socket){
		//console.log('a user connected');
		socket.on('disconnect', function(){

		//console.log('user disconnected');
	  	});
	});

	io.on('connection', function(socket) {
	  socket.on('joinGame', function(userid) {
	     // joinGame(userid, function (err, res) {

	    //  });
	    console.log("hand");
	    update();
	  });
	});
};

function joinGame(userid, cb) {
	update();
}

function update(){

	    io.emit('update', gameData);
	    
	   
	//  })
}

function makeDeck() {
	var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K");
    var suits = new Array("c", "d", "h", "s");
    var deck = new Array(52);
    var i, j;
    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < ranks.length; j++) {
            deck[i*ranks.length + j] = ranks[j] + suits[i];
           // console.log(ranks[j] + suits[i]);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
	var j, x, i;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }
    console.log(deck);
    return deck;
}

function newHand() {
	var deck = makeDeck();
	var shuffledDeck = shuffleDeck(deck);
	var twiceShuffledDeck = shuffleDeck(shuffledDeck);
}


exports.startGame = startGame;




	


	