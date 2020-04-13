const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const LocalStrategy = require('passport-local').Strategy;
ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');

var mongooseURL = process.env.MONGODB_URI || "mongodb://localhost:27017/pokerDB"

mongoose.connect(mongooseURL, { useNewUrlParser: true });
var mongooseConnection = mongoose.connection;
mongooseConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function getUserName (_id,cb) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = null;
				if(process.env.NODE_ENV === 'production') {
					dbo = db.db('heroku_fbgvjbpl');
				}
				else {
					dbo = db.db('pokerDB');
				
				}
		dbo.collection("Users").findOne({"_id":ObjectId(_id)}, async function(err, user) {
			if (err) throw err;
		
			db.close();
			return user.name;

			resolve(cb);
		});
	})

}

async function saveGame(thisGameModel) {
	thisGameModel.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
}

async function findArchivedGameById(gameid, cb) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = null;
		//pick the right mongoURL 
		if(process.env.NODE_ENV === 'production') {dbo = db.db('heroku_fbgvjbpl');} else {dbo = db.db('pokerDB');}
		
		 dbo.collection("savedgames").findOne({"game_data.gameid":gameid}, 
			 function(err, game) {
				if (err) throw err;
			
				db.close();
				if(game!=null)
					return cb(game._id);
				else
					console.log('Mongo could not find archived game');

				
			});
	
		})
}

async function getSavedGame (_id,cb) {
	  MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = null;
		//pick the right mongoURL 
		if(process.env.NODE_ENV === 'production') {dbo = db.db('heroku_fbgvjbpl');} else {dbo = db.db('pokerDB');}
		
		 dbo.collection("savedgames").findOne({"_id":ObjectId(_id)}, 
			 function(err, game) {
				if (err) throw err;
			
				db.close();
				return cb(game);

				
			});
	
		})

}


exports.getUserName=getUserName;
exports.saveGame=saveGame;
exports.getSavedGame=getSavedGame;
exports.findArchivedGameById=findArchivedGameById;
