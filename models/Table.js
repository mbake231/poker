var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
//var jwt = require('jsonwebtoken');
//var secret = require('./config').secret;

var TableSchema = new mongoose.Schema({
	tablename: String,
	smallblind: Number,
	bigblind: Number,
	tableid: String

	},
		{timestamps: true}
);

TableSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var Table = mongoose.model("Table", TableSchema);

module.exports = Table;