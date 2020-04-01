var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var url = "mongodb://localhost:27017/";
var mongoose = require('mongoose');
var express=require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var passport = require('passport');
var gameController = require('./gameController.js');
var flash = require('express-flash');
var session = require('express-session');
var passportSocketIo = require('passport.socketio');
var MongoStore=require('connect-mongo')(session);
var sessionStore = new MongoStore({url: 'mongodb://localhost:27017/mydb'});
var db = require('./db.js');
var initializePassport = require ('./passport-config.js');


var io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

var app = express()
  , http = require('http').createServer(app)
  , io = io.listen(http);

http.listen(PORT);

app.set('view engine','pug');
app.set('view cache', false);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
	secret: 'F4RT',
	store:sessionStore,
	key: 'connect.sid',
	resave: false,
	saveUninitialized: false
}))

//TEMP USER WORK
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


initializePassport(
	passport, 
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id)
);

io.use(passportSocketIo.authorize({
	cookieParser: require('cookie-parser'), //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
	key:          'connect.sid',       //make sure is the same as in your session settings in app.js
	secret:       'F4RT',      //make sure is the same as in your session settings in app.js
	store:        sessionStore,        //you need to use the same sessionStore you defined in the app.use(session({... in app.js
	success:      function(data, accept){accept(null, true)},  // *optional* callback on success
	fail:         function(data, message, critical, accept){accept(null, false)},     // *optional* callback on fail/error
  }));


//TEMP USERWORK

//SOCKETS


	io.on('connection', function(socket){
	//var hash;
	//console.log((socket.request)); 
	socket.on('seatList', function (gameid) {
		gameController.sendSeatList(gameid,socket.id);
		gameController.sendDataToAllPlayers();
	});

	if(socket.request.user && socket.request.user.logged_in!=false) {

		socket.on('register', function (regDetails) {
			//(gameHash,_id,balance,status,seat,sessionid) 
			gameController.addNewPlayerToGame(regDetails.gameHash,
									socket.request.user._id,
									regDetails.balance,
									regDetails.status,
									regDetails.seat,
									socket.id);
				});
		//	

		//listen for start game
		socket.on('startGame', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true)
				gameController.runGame();
			//else
			//	console.log("An user with no id in this game tried to start the game.")
			});

		socket.on('callClock', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true) {
				gameController.callClock(data.gameid);
				socket.broadcast.emit('clockCalled',true);
		//	}
		//	else
		//		console.log("An user with no id in this game tried to call the clock.")
			});

		socket.on('toggleSitOut', function (data) {
		//	if(gameController.checkValidUser(data.gameid,data.hash)==true)
				gameController.toggleSitOut(data.gameid,data.hash);
		//	else
		//		console.log("An user with no id in this game tried to toggle sit out.")
			});

		socket.on('leaveTable', function (data) {
		//	if(gameController.checkValidUser(data.gameid,data.hash)==true)
					gameController.leaveTableNextHand(data.gameid,data.hash);
		//	else
		//		console.log("An user with no id in this game tried to leave table.")
			});

		socket.on('incomingAction', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true){
				gameController.incomingAction(data.game,data.hash,data.action,data.amt);
			//}
			//else
			//	console.log("An user with no id in this game tried to "+data.action+".");
			
			});

		socket.on('nextHand', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true)
					gameController.nextHand();
			//else
			//	console.log("An user with no id in this game tried to start the next hand.");
			});

		socket.on('reconnectionAttempt', function (data) {
			gameController.reconnect(data.gameid,socket.request.user._id,socket.id);
			});
	}//if
});

exports.io = io;


app.get('/',function(req,res)
{
	res.render('table',
		{user:req.user})

});


app.get('/maketable',function(req,res)
{
	res.render('maketable')

});

app.get('/login',function(req,res)
{
	res.render('login')

});

app.post('/login',passport.authenticate('local', {
	successRedirect:'/',
	failureRedirect: '/login',
	failureFlash: true
})


);

app.get('/register',function(req,res)
{
	res.render('register')

});

app.post('/register',async (req,res) => {
try {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("pokerDB");
		dbo.collection("Users").findOne({"email":req.body.email}, function(err, res) {
			try {
				if(res==null) {
					var user = { name: req.body.name, email: req.body.email,password: hashedPassword };
					dbo.collection("Users").insertOne(user, function(err, res) {
					if (err) throw err;
					console.log("1 user inserted");
					db.close();
					});
				}
				else {
					console.log("User with that email already exists");

					throw("User already has that email.")
				}
			}
			catch {
				//console.log(err);
			}
		});
	  });

	res.redirect('/');
}
catch {
	res.redirect('/register');
}
console.log(users);

});

app.get('/logout', async (req, res) => {
	await req.logout();
	req.session = null;
	res.clearCookie("connect.sid")
	return res.redirect('/')
  })

  app.get('/api/user_data', function(req, res) {
	if (req.user === undefined) {
		// The user is not logged in
		res.json({});
	} else {
		res.json({
			_id: req.user._id,
			name: req.user.name
		});
	}
});