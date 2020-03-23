var Deck = require('./Deck');
var PlayerList = require('./PlayerList');
var gameData = require('./gameData');
var PlayerList = require('./PlayerList');

/*var playersPlaying=0;
var betsMade=0;
var firstBettor=0;
var bigblind=-4;
var smallblind=-3;

var currentPot=0;
var currentBet=0;
var lastBet=0;
var betsMade=0;

var currentPlayer=0;
var nextPlayer=0;*/

var nextCard=0;
var server = require('./server');
var deck;
var handDetails = {
	playersPlaying:0,
	betsMade:0,
	dealer:0,
	bigblind:4,
	smallblind:2,
	currentPot:0,
	currentBet:0,
	lastBet:0,
	betsMade:0,
	currentPlayer:0,
	nextPlayer:0,
	currentRound:0,
	card1:null,
	card2:null,
	card3:null,
	card4:null,
	card5:null
}

/*CURRRENT ROUND KEY
0 = ante + betting
1 = flop & betting
2 = turn & betting
3 = river & betting
*/

function startHand(cb){

	//set people who are in the hand
	var ctr=0;
	for (var i =0; i<9;i++) {
		if(PlayerList.getPlayer(i).status=="playing") {
			PlayerList.changeStatus(i,"inhand");
		}
	}

	//get num of people in hand
	for (var i=0;i<9;i++) {
		if(PlayerList.getPlayer(i).status=="inhand")
			handDetails.playersPlaying++;
	}

	//set dealer to lowest playing seat
	handDetails.dealer=setDealer();

	//setCurrentPlayer to the seat under the gun
	handDetails.currentPlayer=getUnderTheGun();



	console.log('In hand ct: '+handDetails.playersPlaying);

	payBlinds();

	

}
function getUnderTheGun () {


}


function setDealer () {
	for(var i=0;i<8;i++) {
		if(PlayerList.getPlayer(i).status=="inhand")
			return i;
	}
}

function moveToNextPlayer () {
	handDetails.currentPlayer = getNextinHandSeat(handDetails.currentPlayer);
	handDetails.nextPlayer = getNextinHandSeat(handDetails.currentPlayer);
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
	PlayerList.addToLine(handDetails.firstBettor,handDetails.smallblind);
	handDetails.currentPot += handDetails.smallblind;
	PlayerList.addToLine(getNextinHandSeat(handDetails.firstBettor),handDetails.bigblind);
	handDetails.currentPot += handDetails.bigblind;

	handDetails.currentBet = handDetails.bigblind;

	dealOutHands();


}

function dealOutHands() {
	deck = Deck.getDeck();
	
	//deal first card
	for (var i=0; i<handDetails.playersPlaying;i++) {
		PlayerList.setCardOne(handDetails.currentPlayer, deck[nextCard]);
		nextCard++;
		moveToNextPlayer();
	}
	//deal second card
	for (var i=0; i<handDetails.playersPlaying;i++) {
		PlayerList.setCardTwo(handDetails.currentPlayer, deck[nextCard]);
		nextCard++;
		moveToNextPlayer();
	}
	console.log("after deal next player is: "+handDetails.nextPlayer);
	//console.log(PlayerList.getPlayerList());
	gameData.sendHands();
	bettingRound();
}

function dealFlop () {

	var burnCard = deck[nextCard];
	nextCard++;
	handDetails.card1= deck[nextCard];
	nextCard++;
	handDetails.card2= deck[nextCard];
	nextCard++;
	handDetails.card3= deck[nextCard];
	nextCard++;
	bettingRound();
}

function dealTurn() {
	var burnCard = deck[nextCard];
	nextCard++;
	handDetails.card4= deck[nextCard];
	bettingRound();
}

function dealRiver() {
	var burnCard = deck[nextCard];
	nextCard++;
	handDetails.card5= deck[nextCard];
	bettingRound();
}

function nextRound() {
	/*CURRRENT ROUND KEY
0 = ante + betting
1 = flop & betting
2 = turn & betting
3 = river & betting
*/
	clearBettingRoundData();

	if(handDetails.currentRound==3)
	{

		handDetails.currentRound++;
		console.log("settle up");
		//dealRiver();
	}
	if(handDetails.currentRound==2)
	{

		handDetails.currentRound++;
		console.log("to the river");
		dealRiver();
	}

	else if(handDetails.currentRound==1)
	{
		handDetails.currentRound++;
		console.log("to the turn");
		dealTurn();
	}

	else if(handDetails.currentRound==0)
	{
		//change to round 1
		handDetails.currentRound++;
		//deal flop
		console.log("to the flop");
		dealFlop();
	}
	

}

function clearBettingRoundData(){
	handDetails.betsMade=0;
	handDetails.currentBet=0;
	handDetails.lastBet=0;

	PlayerList.clearMoneyOnLine();
}

function bettingRound() {

	//if new round of betting
	if(handDetails.betsMade==0&&handDetails.currentRound!=0){
		//set current player for firstbettor incase
		console.log("in here for round "+handDetails.currentRound);
		handDetails.currentPlayer=handDetails.firstBettor;
		server.io.to(
		PlayerList.getPlayer(handDetails.currentPlayer).sessionid)
				.emit(
				'openActionToMe',
				PlayerList.getPrivatePlayerData(PlayerList.getPlayer(handDetails.currentPlayer))
				);
	}

	//if player needs to add to pot so you can either CALL, RAISE, FOLD
	if(PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine < handDetails.currentBet) {
		server.io.to(
		PlayerList.getPlayer(handDetails.currentPlayer).sessionid)
				.emit(
				'betToMe',
				PlayerList.getPrivatePlayerData(PlayerList.getPlayer(handDetails.currentPlayer))
				);
	}
	//if everyone has called
	else if(PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine == handDetails.currentBet 
		&& PlayerList.getPlayer(handDetails.currentPlayer).seat==handDetails.firstBettor 
		&& handDetails.betsMade!=0) {
				nextRound();
	}


	//let the next person to check go
	else if(PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine == handDetails.currentBet && handDetails.lastBet == 'check') {
		server.io.to(
		PlayerList.getPlayer(handDetails.currentPlayer).sessionid)
				.emit(
				'openActionToMe',
				PlayerList.getPrivatePlayerData(PlayerList.getPlayer(handDetails.currentPlayer))
				);
	}

	//big blind to check
	else if(PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine == handDetails.currentBet 
		&& handDetails.betsMade==handDetails.playersPlaying-1 && handDetails.currentRound==0) {
		server.io.to(
		PlayerList.getPlayer(handDetails.currentPlayer).sessionid)
				.emit(
				'openActionToMe',
				PlayerList.getPrivatePlayerData(PlayerList.getPlayer(handDetails.currentPlayer))
				);
	}

}

function processAction(sessionid, bet) {
	if (PlayerList.getPlayer(handDetails.currentPlayer).sessionid == sessionid)
	{
		if(bet=='call') {
			var toPutIn = handDetails.currentBet - PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine;
			PlayerList.addToLine(handDetails.currentPlayer,toPutIn);
			handDetails.currentPot += toPutIn;
			handDetails.betsMade++;

			//is this the last caller?
			//if(handDetails.currentPlayer)
			moveToNextPlayer();

			/*
			//SOLVE BIG BLIND TO CHECK 
			if(PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine==handDetails.currentBet && ) {
				nextRound();
			}
			else
				bettingRound();*/

		}

		else if(bet=='fold') {
			//fold
		}

		else if(bet=='check') {
			handDetails.lastBet='check';
			handDetails.betsMade++;
			moveToNextPlayer();
			bettingRound();
		}

		//is a raise
		else {
			//Here i first need to match the caller than raise
			var toPutIn = handDetails.currentBet - PlayerList.getPlayer(handDetails.currentPlayer).moneyOnLine + Number(bet);
			handDetails.currentBet = handDetails.currentBet+Number(bet);
			PlayerList.addToLine(handDetails.currentPlayer,toPutIn);
			handDetails.betsMade++;
			moveToNextPlayer();
			bettingRound();
		}	
	}
	
}

function getHandDetails () {
	return handDetails;
}




exports.getHandDetails=getHandDetails;
exports.processAction=processAction;
exports.startHand= startHand;
