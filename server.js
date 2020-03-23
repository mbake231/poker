
var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var mongoose = require('mongoose');
var User = require('./models/User');
var Table = require('./models/Table');
var Game = require('./models/Game');
var gameData = require('./gameData');
var db = require('./db');
var express=require('express');
//HEREvar app=express();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var bodyParser = require('body-parser');
//HEREvar http = require('http').createServer(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

var gameController = require('./gameController.js');


var app = express()
  , http = require('http').createServer(app)
  , io = io.listen(http);

http.listen(3000);


app.set('view engine','pug');
app.set('view cache', false);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));


app.get('/table',function(req,res)
{
	res.render('table',
		{title:'Neighborhood Poker',message:'Welcome'})

});

app.get('/joinTable',function(req,res)
{
	//var tableid = req.query.tableid;

	res.render('joinTable');


});


app.post('/joinTable', (req, res) => {
	gameController.joinGame(
		userid=req.body.userid,
		cookie=parseInt(req.body.cookie),
		balance=Number(req.body.balance),
		status=req.body.status,
		seat=req.body.seat,
		sessionid=null
		
		);
	res.redirect('/table');

});

exports.io = io;


//var game = require('./classes/game.js').game;

//var newgame = new game();
	/*
//function newPlayer(userid,cookie,balance,status)
var mike =  new player("mike","cookie",23.50,"playing",);
var jim =  new player("jim","cookie",50.50,"playing");
var clint =  new player("clint","cookie",450.50,"playing");
var shane =  new player("shane","cookie",504.50,"playing");
var bob =  new player("bob","cookie",44.50,"playing");


var game1 = new game();
var game2 = new game();


game1.addPlayer(mike,3);
game1.addPlayer(jim,2);
game1.addPlayer(shane,0);
game1.addPlayer(clint,6);
game1.addPlayer(bob,1);
//game1.foldPlayer(bob);
//game1.foldPlayer(clint);
//game1.firstRound();
game1.setDealer(shane);
game1.postBlinds();
game1.dealHands();
game1.printSeats();
game1.getNextAction();
game1.doAction(mike,'call',4);
game1.getNextAction();
game1.doAction(clint,'raise',10);
game1.getNextAction();
game1.doAction(shane,'call',10);
game1.getNextAction();
game1.doAction(bob,'call',10);
game1.getNextAction();
game1.doAction(jim,'call',10);
game1.getNextAction();
game1.doAction(mike,'call',10);
game1.getNextAction();
game1.printSeats();
*/
//game1.dealFlop();
//game1.printBoard();
//game1.dealTurn();
//game1.printBoard();
//game1.dealRiver();
//game1.printBoard();


//newgame.addPlayer(mike1);




/*
app.get('/pokerTable',function(req,res)
{
	var tableid = req.query.tableid;
	res.render('pokerTable');
	gameData.startGame(123);


});

//OLDER WORLD

app.get('/',function(req,res)
{
	var tableid=123;
	var table = new Table({
	tablename: 'test',
	smallblind: 3,
	bigblind: 1,
	tableid: tableid

	});

	db.createTable(table, function (err, resp) {
		if (!err) {
			gameData.startGame(table.tableid)
				
			res.redirect('/pokerTable?tableid='+tableid);
		}
	});
});



//CREATION SHIT

app.get('/createUser',function(req,res)
{
	res.render('createUser',
		{title:'Neighborhood Poker',message:'Welcome'})

});


app.get('/createTable',function(req,res)
{
	res.render('createTable',
		{title:'Neighborhood Poker',message:'Welcome'})

});

app.post('/register', (req, res) => {
  //console.log(req.body);
  const name = req.body.email;

  var user = new User({
	username: req.body.username,
	email: req.body.email,
	token: null,
	hash: req.body.email,
	salt: null,
	userid: crypto.randomBytes(20).toString('hex')

	});

	db.createUser(user);
  	res.end("thanks");
});

app.post('/maketable', (req, res) => {
  console.log(req.body);
  const name = req.body.email;
  var tableid = crypto.randomBytes(20).toString('hex');

  var table = new Table({
	tablename: req.body.tablename,
	smallblind: req.body.smallblind,
	bigblind: req.body.bigblind,
	tableid: tableid

	});

	db.createTable(table);
	gameData.startGame(table.tableid)
  	res.redirect('/pokerTable?tableid='+tableid);
});






*/

