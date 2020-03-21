var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var str ='';
var mongoose = require('mongoose');
const URL = "mongodb://localhost:27017/mydb";
const ObjectId = require('mongodb').ObjectID;


function createUser (u) {

	mongoose.connect(URL);

	u.save(function (err, user) {
      if (err) return console.error(err);
      console.log(user.username + " saved to bookstore collection.");
  	});

};


function getUser (id, cb) {

	var MongoClient = require('mongodb').MongoClient;
	var username;

	MongoClient.connect(URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  dbo.collection("users").findOne({_id:ObjectId(id)}.username, function(err, user) {
	    if (err) throw err;
	    username = user.username;
	    db.close();
	  });
	});
	console.log(username);
	return "ServerName";

}

function createTable (t, cb) {
	mongoose.connect(URL);
  	t.save(t,cb);

  	console.log(t.tablename + " saved");
};



exports.createUser = createUser;
exports.createTable = createTable;
exports.getUser = getUser;