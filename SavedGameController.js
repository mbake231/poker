var db = require('./db.js');
var mongoose = require('mongoose');
var SavedGameModel = require ('./models/SavedGame.js')
var gc = require ('./newgameController');


function saveThisGame(thisGame,cb) {
    var savedSeats = [];

    if(thisGame.gameTable.seats.length>0)
        for (var i=0; i<thisGame.gameTable.seats.length;i++){
            if(thisGame.gameTable.seats[i]=='empty')
                savedSeats.push('empty')
            else
                savedSeats.push({
                    hash: thisGame.gameTable.seats[i].hash,
                    balance: thisGame.gameTable.seats[i].balance,
                    moneyOnLine: thisGame.gameTable.seats[i].moneyOnLine,
                    card1: thisGame.gameTable.seats[i].card1,
                    card2: thisGame.gameTable.seats[i].card2,
                    nextPlayer: thisGame.gameTable.seats[i].nextPlayer,
                    status: thisGame.gameTable.seats[i].status,
                    sitoutnexthand: thisGame.gameTable.seats[i].sitoutnexthand,
                    leavenexthand: thisGame.gameTable.seats[i].leavenexthand
                })
        }
    return cb(createDocument(thisGame, savedSeats, function(id) {
        return cb(id);
    }));
}


function createDocument(thisGame,savedSeats,cb) {

    var thisSavedGame = ({  //new SavedGameModel({

        game_data: {
            gameid: thisGame.gameTable.gameid,
            game_size: thisGame.gameTable.game_size,
            handCount: thisGame.gameTable.handCount,
            handLogSentIndex:thisGame.gameTable.handLogSentIndex,
            board: thisGame.gameTable.board,
            dealer: thisGame.gameTable.dealer,
            isTimerGame: thisGame.gameTable.isTimerGame,
            currentPot: thisGame.gameTable.currentPot,
            smallBlind: thisGame.gameTable.smallBlind,
            bigBlind: thisGame.gameTable.bigBlind,
            deck: thisGame.deck,
        
          },
          round_information: {
            lastRaiser: thisGame.gameTable.bettingRound.lastRaiser,
            potsTotal: thisGame.gameTable.bettingRound.potsTotal,
            pots: thisGame.gameTable.bettingRound.pots,
            actionOn: thisGame.gameTable.bettingRound.actionOn,
            nextActionsAvailable: thisGame.gameTable.bettingRound.nextActionsAvailable,
            round: thisGame.gameTable.bettingRound.round,
            totalOnLine: thisGame.gameTable.bettingRound.TotalOnLine,
            currentRaiseToCall: thisGame.gameTable.bettingRound.currentRaiseToCall,
            lastBet: thisGame.gameTable.bettingRound.lastBet,
            bigBlindHash: thisGame.gameTable.bettingRound.bigBlindHash
          },
          seats: savedSeats

    })
/*
    thisSavedGame.save(function (err,res) {
        if (err) console.log(err);
        else {console.log('saved!'); return cb(res._id);}
    });*/

    
    SavedGameModel.findOneAndUpdate({"game_data.gameid":thisGame.gameTable.gameid}, thisSavedGame, {upsert:true}, function(err, doc){ 

        if (err) console.log("save failed err:"+err); 
        
        else console.log("succesfully saved"+doc); 
        
        });
    
    
}

async function rebuildSavedGame(_id) {
    
    var foundGame = await db.getSavedGame(_id,function(buildData) {
        console.log(buildData)
    gc.newGame('no test',buildData);
    });
    
   
    

}

exports.rebuildSavedGame=rebuildSavedGame;
exports.saveThisGame=saveThisGame;