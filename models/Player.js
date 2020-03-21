var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
//var jwt = require('jsonwebtoken');
//var secret = require('./config').secret;

var PlayerSchema = new mongoose.Schema({
	myCard1: String,
	myCard2: String


	},
		{timestamps: true}
);

PlayerSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;