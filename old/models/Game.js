var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
//var jwt = require('jsonwebtoken');
//var secret = require('./config').secret;

var GameSchema = new mongoose.Schema({
	currentPot: Number,
	minRaise: Number,
	seatList: [String],
	actionOnPlayer: String,
	card1: String,
	card2: String,
	card3: String,
	card4: String,
	card5: String


	},
		{timestamps: true}
);

GameSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var Game = mongoose.model("Game", GameSchema);

module.exports = Game;