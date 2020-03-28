
var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var mongoose = require('mongoose');
var express=require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var bodyParser = require('body-parser');

var crypto = require('crypto');

var gameController = require('./gameController.js');
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

var app = express()
  , http = require('http').createServer(app)
  , io = io.listen(http);

http.listen(PORT);

app.set('view engine','pug');
app.set('view cache', false);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

//SOCKETS
io.on('connection', function(socket){
	var hash;


		socket.on('seatList', function (gameid) {
			gameController.sendSeatList(gameid,socket.id);
			gameController.sendDataToAllPlayers();
		});

		socket.on('register', function (regDetails) {
			hash=gameController.addNewPlayerToGame(regDetails.gameHash,
									regDetails.userid,
									regDetails.storedCookie,
									regDetails.balance,
									regDetails.status,
									regDetails.seat,
									socket.id);
			});
		

		//listen for start game
		socket.on('startGame', function () {
			gameController.runGame();
			});

		socket.on('callClock', function (data) {
			gameController.callClock(data.gameid);
			});

		socket.on('toggleSitOut', function (data) {
			gameController.toggleSitOut(data.gameid,data.hash);

			});

		socket.on('leaveTable', function (data) {
				gameController.leaveTableNextHand(data.gameid,data.hash);
			});

		socket.on('incomingAction', function (data) {
			gameController.incomingAction(data.game,data.userhash,data.action,data.amt);
			});

		socket.on('nextHand', function (data) {
			gameController.nextHand();
			});

		socket.on('reconnectionAttempt', function (data) {
			gameController.reconnect(data.gameid,data.storedCookie,socket.id);
			});
		
});

exports.io = io;


app.get('/',function(req,res)
{
	res.render('table',
		{title:'Neighborhood Poker',message:'Welcome'})

});