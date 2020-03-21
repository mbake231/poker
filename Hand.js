var Deck = require('./Deck');
var PlayerList = require('./PlayerList');
var gameData = require('./gameData');
var PlayerList = require('./PlayerList');

var playersPlaying=0;
var firstBettor=0;
var bigblind=-4;
var smallblind=-3;

var currentPot=0;

var currentPlayer=0;
var nextPlayer=0;

var nextCard=0;


function startHand(){

	//set people who are in the hand
	var ctr=0;
	for (var i =0; i<9;i++) {
		if(PlayerList.getPlayer(i).status=="playing") {
			PlayerList.changeStatus(i,"inhand");
		}
	}
	//set firstbettor to lowest playing seat
	firstBettor=findFirstBettor();

	//setCurrentPlayer to firstBettor
	currentPlayer=firstBettor;

	//get num of people in hand
	for (var i=0;i<9;i++) {
		if(PlayerList.getPlayer(i).status=="inhand")
			playersPlaying++;
	}

	console.log('In hand ct: '+playersPlaying);

	payBlinds();

	

}

function findFirstBettor () {
	for(var i=0;i<8;i++) {
		if(PlayerList.getPlayer(i).status=="inhand")
			return i;
	}
}

function moveToNextPlayer () {
	currentPlayer = getNextinHandSeat(currentPlayer);
	nextPlayer = getNextinHandSeat(currentPlayer);
}

function getNextinHandSeat (currentSeat) {
	var ctr=0;
	if (currentSeat<8) {
		ctr = currentSeat+1;
		while (ctr<=8) {
			if(PlayerList.getPlayer(ctr).status=="inhand")
				return ctr;
			else
				ctr++;
		}
	}
		ctr=0;
		while (ctr<currentSeat) {
			if(PlayerList.getPlayer(ctr).status=="inhand")
				return ctr;
			else
				throw "cant find next player";

		}
}

function payBlinds() {
	PlayerList.changeBalance(firstBettor,smallblind);
	currentPot += smallblind;
	PlayerList.changeBalance(getNextinHandSeat(firstBettor),bigblind);
	currentPot += bigblind;

	dealOutHands();


}

function dealOutHands() {
	var deck = Deck.getDeck();
	
	//deal first card
	for (var i=0; i<playersPlaying;i++) {
		PlayerList.setCardOne(currentPlayer, deck[nextCard]);
		nextCard++;
		moveToNextPlayer();
	}
	//deal second card
	for (var i=0; i<playersPlaying;i++) {
		PlayerList.setCardTwo(currentPlayer, deck[nextCard]);
		nextCard++;
		moveToNextPlayer();
	}
	console.log("after deal next player is: "+nextPlayer);
	console.log(PlayerList.getPlayerList());
	gameData.update();
}

exports.startHand= startHand;
