var express=require('express');
var app=express();
var db = require('./db');
var server = require('./server');
var player = require('./classes/player.js').player;
var game = require('./classes/game.js').game;
var Promise = require("bluebird");
var Promise=require('bluebird');

const games = [];

//TEST

//var thisGame = new game();
//games.push(thisGame);

//addNewPlayerToGame('fart',"5e83a80f4aeeda2c0a258d4f",290,'playing',0,"mike");
//addNewPlayerToGame('fart',"5e83aa2c8391902cc37073b9",400,'playing',1,'sid',"kim");
//addNewPlayerToGame('fart',"5e848f1cc52dc04e0a5a2470",10000,'playing',3,'sid',"shane");
//addNewPlayerToGame('fart',"5e83ab2844d4db2d4038c095",100,'playing',5,'sid',"kev");

        
//startGame('fart');
//ameid,user,action,amt
/*incomingAction('fart','5e83ab2844d4db2d4038c095','raise',5);
incomingAction('fart','5e83ab2844d4db2d4038c095','call');
incomingAction('fart','5e83a80f4aeeda2c0a258d4f','call');
incomingAction('fart','5e83aa2c8391902cc37073b9','call');
*/


//TEST



function newGame(smallBlind,bigBlind,isTimerGame,timerLength,maxPlayers) {
    var thisGame = new game();

    games.push(thisGame);
    console.log("New game made ID:"+findGameById(thisGame.getGameId()).getGameId());
    return thisGame.getGameId();
}

function findGameById(id) {
    for (var i = 0; i<games.length;i++) {
        if(games[i].getGameId()==id)
            return games[i];
    }
       
    console.log('game not found');
}

function startGame(gameid) {
    let thisGame = findGameById(gameid);
    if(thisGame != null)
      thisGame.startGame();
    else
        console.log('No game with that ID.');
}

function callClock(gameid,hash) {
    let thisGame = findGameById(gameid);
    if(thisGame != null)
        if(thisGame.isClockCalled() != true)
            if(thisGame.getPlayerByHash(hash) != false)
                if(thisGame.getPlayerByHash(hash).status != 'sittingout' && thisGame.getPlayerByHash(hash).status != 'playing')
                    thisGame.callClock();
    else
        console.log('No game with that ID.');
}

function toggleSitOut(gameid,hash) {
    let thisGame = findGameById(gameid);
    if(thisGame != null)
        if(thisGame.getPlayerByHash(hash) != false)
            thisGame.getPlayerByHash(hash).toggleSitOut();
    else
        console.log('No game with that ID.');

}

function sitBackDown(gameid,hash) {
    let thisGame = findGameById(gameid);
    if(thisGame != null)
        if(thisGame.getPlayerByHash(hash) != false)
            thisGame.sitPlayerBackDown(hash);
    else
        console.log('No game with that ID.');

}

function leaveTableNextHand(gameid,hash){
    let thisGame = findGameById(gameid);
    if(thisGame != null)
        if(thisGame.getPlayerByHash(hash) != false)
            thisGame.leaveTableNextHand(hash);
    else
        console.log('No game with that ID.');

}

function reconnect(gameid,_id,sid){
    if(gameid!=null && _id != null){
        let thisGame = findGameById(gameid);
        if(thisGame != null)
        thisGame.reconnect(_id,sid);
        else
            console.log('No game with that ID.');
    }

}

function  addNewPlayerToGame (gameid,_id,balance,status,seat,sessionid) {
    var thisGame = findGameById(gameid);
    if(thisGame!=null){
        if(thisGame.getPlayerByHash(_id) == false) {
            
            var newPlayer = new player(_id,Number(balance),status,sessionid);
            newPlayer.setUserName(_id);
            thisGame.addPlayer(newPlayer,seat);
        }
        else {
            console.log("User ID"+_id+" is already sitting at Game ID "+thisGame.getGameId()+".");
        }
    }
    else
        console.log('No game with that ID.');


}

function incomingAction(gameid,user,action,amt){
    if(gameid!=null && user!=null) {
        var game = findGameById(gameid);
        var userActing = game.getPlayerByHash(user);
        game.doAction(userActing, action, amt);
    }
    else
        console.log("Can't find game or user, data is null");
}

function sendSeatList(gameid,sessionid) {
    
    let thisGame = findGameById(gameid);
    if(thisGame != null)
        server.io.to(sessionid).emit('publicSeatList',thisGame.getPublicSeatList());
    else
        console.log('No game with that ID.');

}


exports.sendSeatList=sendSeatList;
exports.newGame=newGame;
exports.addNewPlayerToGame = addNewPlayerToGame;
exports.incomingAction = incomingAction;
exports.reconnect = reconnect;
exports.toggleSitOut=toggleSitOut;
exports.leaveTableNextHand=leaveTableNextHand;
exports.callClock=callClock;
exports.startGame=startGame;
exports.sitBackDown=sitBackDown;
