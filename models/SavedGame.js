var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SavedGameSchema = new Schema({

  game_data: {
    gameid: String,
    game_size: Number,
    handCount: Number,
    handLongSentIndex:Number,
    board: Array,
    dealer: Schema.Types.Mixed,
    isTimerGame: Boolean,
    smallBlind: Number,
    bigBlind: Number,
    deck: Array,

  },
  round_information: {
    lastRaiser: Schema.Types.Mixed,
    potsTotal: Number,
    pots: Array,
    actionOn: Schema.Types.Mixed,
    nextActionsAvailable: Array,
    round: Number,
    totalOnLine: Number,
    currentRaiseToCall: Number,
    lastBet: String,
    bigBlindHash: String
  },
  seats: [],
  lastUpdated: Date

  
});

const SavedGameModel = mongoose.model('SavedGames',SavedGameSchema);

module.exports = SavedGameModel;