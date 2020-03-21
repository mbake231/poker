var Promise=require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var str ='';
var mongoose = require('mongoose');


function createUser (u) {

	mongoose.connect("mongodb://localhost:27017/mydb");

	u.save(function (err, user) {
      if (err) return console.error(err);
      console.log(user.username + " saved to bookstore collection.");
  	});

};

function createTable (t, cb) {
	mongoose.connect("mongodb://localhost:27017/mydb");
  	t.save(t,cb);

  	console.log(t.tablename + " saved");
};



exports.createUser = createUser;
exports.createTable = createTable;