var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var url = "mongodb://localhost:27017/";
var mongoose = require('mongoose');
var express=require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var passport = require('passport');
//var gameController = require('./gameController.js');
var newgameController = require('./newgameController.js');
const cors = require("cors");
var flash = require('express-flash');
var session = require('express-session');
var passportSocketIo = require('passport.socketio');
var MongoStore=require('connect-mongo')(session);
var sessionStore = new MongoStore({url: 'mongodb://localhost:27017/mydb'});
var db = require('./db.js');
var initializePassport = require ('./passport-config.js');
var path = require('path');

var io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

var app = express()
  , http = require('http').createServer(app)
  , io = require("socket.io")(http, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});;

http.listen(PORT);

app.set('view engine','pug');
app.set('view cache', false);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(cors());
app.use(cors({credentials: true}));

if(process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client','build','index.html'));
	})
}

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
io.set('origins', '*:*');


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
	
		socket.on('handshake', function () {
			socket.emit('handshake',socket.request.user._id);
		});

	//var hash;
	console.log(socket.request.user._id+' connected.'); 
	socket.on('seatList', function (gameid) {
		newgameController.sendSeatList(gameid,socket.id);
		//gameController.sendDataToAllPlayers();
	});

	if(socket.request.user && socket.request.user.logged_in!=false) {

		socket.on('register', function (regDetails) {
			//(gameHash,_id,balance,status,seat,sessionid) 
			newgameController.addNewPlayerToGame(regDetails.gameHash,
									regDetails.userid,   //CHANGE THIS BACK TO socket.request.user._id
									regDetails.balance,
									regDetails.status,
									regDetails.seat,
									socket.id);
				});
		//	
		//listen for start game
		socket.on('createGame', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true)
				var newid=newgameController.newGame();
				socket.emit('createGame',newid);


			//else
			//	console.log("An user with no id in this game tried to start the game.")
			});

		//listen for start game
		socket.on('startGame', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true)
				newgameController.startGame(data.gameid);
			//else
			//	console.log("An user with no id in this game tried to start the game.")
			});

		socket.on('callClock', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true) {
				newgameController.callClock(data.gameid);
				socket.broadcast.emit('clockCalled',true);
		//	}
		//	else
		//		console.log("An user with no id in this game tried to call the clock.")
			});

		socket.on('toggleSitOut', function (data) {
		//	if(gameController.checkValidUser(data.gameid,data.hash)==true)
				newgameController.toggleSitOut(data.gameid,data.hash);
		//	else
		//		console.log("An user with no id in this game tried to toggle sit out.")
			});

		socket.on('leaveTable', function (data) {
		//	if(gameController.checkValidUser(data.gameid,data.hash)==true)
					newgameController.leaveTableNextHand(data.gameid,data.hash);
		//	else
		//		console.log("An user with no id in this game tried to leave table.")
			});

		socket.on('incomingAction', function (data) {
			//if(gameController.checkValidUser(data.gameid,data.hash)==true){
				newgameController.incomingAction(data.game,data.hash,data.action,data.amt);
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
			newgameController.reconnect(data.gameid,socket.request.user._id,socket.id);
			});
	}//if
	else
		console.log("I hear you but I can't listen to you.");
});




app.get('/',function(req,res)
{
	
	res.redirect('/createTable');


});

app.get('/table',function(req,res)
{
	
	res.render('table',
		{user:req.user})

});

app.get('/createTable',function(req,res)
{
	res.render('createTable')

});

app.post('/createTable',function(req,res)
{
	var id = newgameController.newGame();
	res.redirect('/table?game='+id);

});


app.get('/login',function(req,res)
{
	res.render('login')

});

app.post('/login',
function(req,res,next) {
	next()
},

passport.authenticate('local'),
(req,res) => {


	console.log('logged in', req.user);
	console.log();
	var userInfo= {
		username: req.user._id
	};
	res.send(userInfo);



}
);



app.get('/register',function(req,res)
{
	res.render('register')

});

app.post('/register',async (req,res) => {
try {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const scope = res;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("pokerDB");
		dbo.collection("Users").findOne({"email":req.body.email}, function(err, res) {
			try {
				if(res==null) {
					var user = { name: req.body.name, email: req.body.email,password: hashedPassword };
					dbo.collection("Users").insertOne(user, function(err, result) {
					if (err) throw err;
					console.log('Inserted: '+result);
					scope.send(result);
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

	
}
catch {
	res.redirect('/register');
}

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


exports.io = io;