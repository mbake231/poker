
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
		socket.on('startGame', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true)
				gameController.runGame();
			else
				console.log("An user with no id in this game tried to start the game.")
			});

		socket.on('callClock', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true) {
				gameController.callClock(data.gameid);
				socket.broadcast.emit('clockCalled',true);
			}
			else
				console.log("An user with no id in this game tried to call the clock.")
			});

		socket.on('toggleSitOut', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true)
				gameController.toggleSitOut(data.gameid,data.hash);
			else
				console.log("An user with no id in this game tried to toggle sit out.")
			});

		socket.on('leaveTable', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true)
					gameController.leaveTableNextHand(data.gameid,data.hash);
			else
				console.log("An user with no id in this game tried to leave table.")
			});

		socket.on('incomingAction', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true){
				console.log('wegood');
				gameController.incomingAction(data.game,data.hash,data.action,data.amt);
			}
			else
				console.log("An user with no id in this game tried to "+data.action+".");
			
			});

		socket.on('nextHand', function (data) {
			if(gameController.checkValidUser(data.gameid,data.hash)==true)
					gameController.nextHand();
			else
				console.log("An user with no id in this game tried to start the next hand.");
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


app.get('/maketable',function(req,res)
{
	res.render('maketable')

});