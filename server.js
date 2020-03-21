
var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var mongoose = require('mongoose');
var User = require('./models/User');
var Table = require('./models/Table');
var Game = require('./models/Game');
var gameData = require('./gameData');
var db = require('./db');
var express=require('express');
var app=express();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var crypto = require('crypto');


app.set('view engine','pug');
app.set('view cache', false);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

var server=app.listen(3000,function() {});



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


app.get('/pokerTable',function(req,res)
{
	var tableid = req.query.tableid;

	res.render('pokerTable');


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
  console.log(req.body);
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









