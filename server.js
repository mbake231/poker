var SavedGameSchema = require ('./models/SavedGame.js')
var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/";
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
var sessionStore = new MongoStore({url: process.env.MONGODB_URI || "mongodb://localhost:27017/pokerDB"});
var initializePassport = require ('./passport-config.js');
var path = require('path');
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var db = require('./db.js');

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
if(process.env.NODE_ENV === 'production') {
	app.use(cors({origin:'https://www.thelocalgame.com:'+process.env.PORT ,credentials: true}));
}
else {
	app.use(cors({origin: 'http://localhost:8000',credentials: true}));
//	app.use(cors({origin: 'http://172.20.10.4:8000',credentials: true}));

}

if(process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client','build','index.html'));
	})
}

if(process.env.NODE_ENV === 'production') {
	app.use((req, res, next) => {
	  if (req.header('x-forwarded-proto') !== 'https')
		res.redirect(`https://${req.header('host')}${req.url}`)
	  else
		next()
	})
  }

app.use(session({
	secret: process.env.SECRET || 'F4RT',
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
/*]
if(process.env.NODE_ENV === 'production') {
	io.set('origins', '*:*');
}
else {
	io.set('origins', 'http://localhost:8000');

}
*/

io.use(passportSocketIo.authorize({
	cookieParser: require('cookie-parser'), //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
	key:          'connect.sid',       //make sure is the same as in your session settings in app.js
	secret:       process.env.SECRET || 'F4RT',      //make sure is the same as in your session settings in app.js
	store:        sessionStore,        //you need to use the same sessionStore you defined in the app.use(session({... in app.js
	success:      function(data, accept){accept(null, true)},  // *optional* callback on success
	fail:         function(data, message, critical, accept){accept(null, false)},     // *optional* callback on fail/error
  }));


//TEMP USERWORK

//SOCKETS


	io.on('connection', function(socket){
//	console.log(socket);
//	console.log(socket.request);
		socket.on('handshake', function () {
			socket.emit('handshake',socket.request.user._id);
			console.log('sending hankshake');
		});

	
	console.log(socket.request.user._id+' connected.'); 


	//ask for public seat list
	socket.on('seatList', function (gameid) {
		newgameController.sendSeatList(gameid,socket.id);
	});

	socket.on('createGame', function (data) {
		var newid=newgameController.newGame(false, null, data.smallblind,data.bigblind,data.playSeventwo);
		socket.emit('createGame',newid);
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


		//listen for start game
		socket.on('startGame', function (data) {
				newgameController.startGame(data.gameid);
			});

		socket.on('callClock', function (data) {
				newgameController.callClock(data.gameid,data.hash);
			});

		socket.on('toggleSitOut', function (data) {
				newgameController.toggleSitOut(data.gameid,data.hash);
			});

		socket.on('sitBackDown', function (data) {
				newgameController.sitBackDown(data.gameid,data.hash);
			});
		
		socket.on('addChips', function (data) {
				newgameController.addChips(data.gameid,data.hash,data.amt);
			});

		socket.on('leaveTable', function (data) {
				newgameController.leaveTableNextHand(data.gameid,data.hash);
			});

		socket.on('incomingAction', function (data) {
				newgameController.incomingAction(data.gameid,data.hash,data.action,parseInt(data.amt));			
			});

		socket.on('nextHand', function (data) {
				gameController.nextHand();
			});

		socket.on('reconnectionAttempt', function (data) {
			newgameController.reconnect(data.gameid,socket.request.user._id,socket.id);
			});

		socket.on('chatMessage', function (data) {
			newgameController.incomingChat(data.gameid,data.hash,data.message);
		})

		socket.on('showMyCard', function (data) {
			newgameController.showPlayerCard(data.gameid,data.hash,data.cardToShow);
			socket.broadcast.emit('flippedCard','nodata');
		})
	}//if
	else
		console.log("I hear you but I can't listen to you.");
});




app.post('/login',
function(req,res,next) {

	next()
},

passport.authenticate('local'),
(req,res) => {


	console.log('logged in', req.user);
	var userInfo= {
		username: req.user._id
	};
	res.send(userInfo);
	res.end();


}
);

app.post('/register',async (req,res) => {
try {
	if(req.body.password==req.body.confirmpassword)
	{
		if(req.body.password.length>5)
		{
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const scope = res;
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = null;
						if(process.env.NODE_ENV == 'production') {
							dbo = db.db('heroku_fbgvjbpl');
						}
						else {
							dbo = db.db('pokerDB');
						}
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

							return scope.status(400).send({
								message: "That email already exists."
							 });
						}
					}
					catch {
						//console.log(err);
					}
				});
			});
		}
		else {
			console.log('password needs to be 6 characters')
			return res.status(400).send({
				message: "Password too short."
			 });	
		}
	}
	else {
		console.log('passwords dont match')
		return res.status(400).send({
			message: "Passwords don't match."
		 });
		}
	
}
catch {
	res.redirect('/register');
}

});

app.post('/logout', async (req, res) => {
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