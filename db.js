const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const LocalStrategy = require('passport-local').Strategy;
ObjectId = require('mongodb').ObjectID;


async function getUserName (_id,cb) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		const dbo = null;
				if(process.env.NODE_ENV === 'production') {
					dbo = db.db('heroku_fbgvjbpl');
				}
				else {
					dbo = db.db('pokerDB');
				
				}
		dbo.collection("Users").findOne({"_id":ObjectId(_id)}, async function(err, user) {
			if (err) throw err;
			return user.name;
				
			db.close();
			resolve(cb);
		});
	})

}


exports.getUserName=getUserName;