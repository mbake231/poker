
var deck = require('./deck.js').deck;
var pokerCalc = require('poker-calc');
var Hand = require('pokersolver').Hand;

var gameTable = {
	hash:'train',
	game_size:9,
 	seats:[],
	numseats:0,
	deck:[],
	board:[],
	dealer:null,
	winner:{
		player:null,
		hand:null,
		winningPot:0},
	currentPot:0,
	smallBlind:1,  //add to constructor
	bigBlind:2,
	bettingRound: {
		lastRaiser:null,
		actionOn:null,
		nextActionsAvailable:[],
		round:0,
		totalOnLine:0,
		currentRaiseToCall:0,
		currentRaiseToCall:null
		}
};

class game {

	constructor () {
		for (var i=0;i<gameTable.game_size;i++)
			gameTable.seats[i] = "empty";

		gameTable.deck = new deck();
		gameTable.hash = this.makeid(16);


	}

	goToNextHand () {
		gameTable.deck = new deck();
		gameTable.dealer=gameTable.dealer.nextPlayer;
		gameTable.winner.player=null;
		gameTable.winner.hand=null;
		gameTable.winner.winningPot=null;
		gameTable.board=[];
		gameTable.currentPot=0;
		gameTable.bettingRound.lastRaiser=null;
		gameTable.bettingRound.nextActionsAvailable=[];
		gameTable.bettingRound.round=0
		gameTable.bettingRound.totalOnLine=0;
		gameTable.bettingRound.currentRaiseToCall=0;
		gameTable.bettingRound.currentRaiseToCall=null;

	}

	makeid(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
   		return result;
	}

	getPreviousPlayer (player) {
		for(var i=player.seat-1;i>=0;i--)
			{
				if(gameTable.seats[i]!="empty")
					return gameTable.seats[i];
			}
		for(var i=8;i>player.seat;i--)
			{
				if(gameTable.seats[i]!="empty")
					return gameTable.seats[i];
			}
	}

	getNextPlayer(player) {
		for (var i=Number(player.seat)+1;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!="empty") {
				console.log(player+" YOUR NEXT PERSON IS NOW TOP "+i+".   f"+ gameTable.seats[i]);
				return gameTable.seats[i];
			}
		}
		for (var i=0;i<player.seat;i++){
			if(gameTable.seats[i]!="empty") {
								console.log(player+" YOUR NEXT PERSON IS NOW "+ gameTable.seats[i]);

				return gameTable.seats[i];
			}
		}
	}

	printEveryonesNextPlayer() {
		for (var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i]!='empty')
				console.log("Seat 1's next is"+gameTable.seats[i].nextPlayer.seat+ "and previos us is");
		}
	}

	setNextPlayer (player) {
		player.nextPlayer = this.getNextPlayer(player);

		console.log(player.nextPlayer.seat+" then goes"+player.seat);
	}

	getPlayerByHash(myhash) {
		for (var i=0;i<gameTable.game_size;i++){
			if(gameTable.seats[i].hash===myhash)
				return gameTable.seats[i];
		}
		console.log("found no user by that hash");
	}

	addPlayer(player,seat) {
		if(gameTable.seats[seat]!="empty") {
			console.log("Seat full");
		}

		else {
			if(gameTable.seats[seat]=="empty") {
				gameTable.seats[seat] = player;
				player.setSeat(seat);
				gameTable.numseats++;
				console.log(player.userid+" joined game! at seat "+player.seat)
			}
			//need to ensure first guy gets his pointer set
			if(gameTable.numseats==2) {
				this.setNextPlayer(player);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;

				//set the other guy to tyou
				for (var i=0;i<gameTable.game_size;i++)
					if(gameTable.seats[i]!="empty" && i!=seat){
						gameTable.seats[i].nextPlayer = player;
						gameTable.seats[i].previousPlayer = player;
					}
				this.printEveryonesNextPlayer();
				//console.log (player.nextPlayer.seat + " the other guy is now pointing at me " + player.nextPlayer.nextPlayer )
			}
			if(gameTable.numseats>2) {
				this.setNextPlayer(gameTable.seats[seat]);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;
				this.printEveryonesNextPlayer();
			}
		}
	}

	foldPlayer (player) {
		player.status="folded";
		this.getPreviousPlayer(player).nextPlayer=this.getNextPlayer(player);
		player.nextPlayer = "folded";

	}

	printSeats () {
		for(var i=0;i<gameTable.game_size;i++) {

			if(gameTable.seats[i]!="empty")
				console.log("Seat "+i+": "+gameTable.seats[i].userid+
					" Balance:"+gameTable.seats[i].balance+
					" Status: "+gameTable.seats[i].status+
				//	" Next up :"+gameTable.seats[i].nextPlayer.userid+
					" Hand: "+ gameTable.seats[i].card1+" "+gameTable.seats[i].card2+
					" $ in: "+ gameTable.seats[i].moneyOnLine);
			else
				console.log("Seat "+i+": Empty");
		}
	}

	getNumberPlayersInHand () {
		let counter=0;
		for (var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=="playing")
				counter++;
		}
		return counter;

	}

	//pass me who is the dealer
	setDealer(player) {
		gameTable.dealer=player;
		//console.log("the dealer is now "+player.userid +" at seat" +player.seat+" "+gameTable.dealer.seat);
	}
	dealHands() {
		
		//deal card 1
		var cardGetter = gameTable.seats[gameTable.dealer.seat].nextPlayer;
			while (cardGetter.card1==null)
			{
				cardGetter.card1=gameTable.deck.dealCard();
				cardGetter = gameTable.seats[cardGetter.seat].nextPlayer;
			}

			while (cardGetter.card2==null)
			{
				cardGetter.card2=gameTable.deck.dealCard();
				cardGetter = gameTable.seats[cardGetter.seat].nextPlayer;
			}

	}
	getUnderTheGunPlayer () {
		var smallBlindPayer = gameTable.seats[gameTable.dealer.seat].nextPlayer;
		var bigBlindPayer = gameTable.seats[smallBlindPayer.seat].nextPlayer;
		var theGun = gameTable.seats[bigBlindPayer.seat].nextPlayer
		return theGun;
	}

	dealFlop() {
		var burnCard = gameTable.deck.dealCard();
		gameTable.board[0] = gameTable.deck.dealCard();
		gameTable.board[1] = gameTable.deck.dealCard();
		gameTable.board[2] = gameTable.deck.dealCard();

		

	}
	dealTurn() {
		var burnCard = gameTable.deck.dealCard();
		gameTable.board[3]=gameTable.deck.dealCard();
	}
	dealRiver() {
		var burnCard = gameTable.deck.dealCard();
		gameTable.board[4] = gameTable.deck.dealCard();
	}

	printBoard() {
		console.log(gameTable.board);
	}

	getBigBlindPlayer() {
		var smallBlindPayer = gameTable.seats[gameTable.dealer.seat].nextPlayer;
		var bigBlindPayer = gameTable.seats[smallBlindPayer.seat].nextPlayer;
		//console.log("Big Blind on Seat: "+bigBlindPayer.seat);
		return bigBlindPayer;
	}

	getSmallBlindPlayer () {
		var smallBlindPayer = gameTable.seats[gameTable.dealer.seat].nextPlayer;
		//console.log("Small Blind on Seat: "+smallBlindPayer.seat);
		return smallBlindPayer;
	}

	postBlinds() {
		var smallBlindPayer = this.getSmallBlindPlayer();
		var bigBlindPayer = this.getBigBlindPlayer();


		//withdraw and add to line
		gameTable.seats[smallBlindPayer.seat].addMoneyToLine(gameTable.smallBlind);
		gameTable.bettingRound.totalOnLine+=gameTable.smallBlind;

		gameTable.seats[bigBlindPayer.seat].addMoneyToLine(gameTable.bigBlind);
		gameTable.bettingRound.totalOnLine+=gameTable.bigBlind;

		//set the person under the gun to be next
		this.setActionOn(this.getUnderTheGunPlayer());
		gameTable.bettingRound.lastBet='blinds';
		gameTable.bettingRound.round=0;
		gameTable.bettingRound.currentRaiseToCall = gameTable.bigBlind;


	}

	setActionOn(player) {
		gameTable.bettingRound.actionOn=player;
	}

	getActionOnPlayer() {
		return gameTable.bettingRound.actionOn;
	}

	getLowestOccupiedSeat() {
		for (var i=0;i<gameTable.game_size;i++){
			if (gameTable.seats[i]!="empty")
				return gameTable.seats[i];
		}
	}

	clearRoundData() {
		//clear data we dont need for next round, keeping round count OBVI
		gameTable.bettingRound.lastRaiser=null;
		gameTable.bettingRound.actionOn=null;
		//set this for fuirst to act
		gameTable.bettingRound.nextActionsAvailable=['raise','check'];
		gameTable.bettingRound.totalOnLine=0;
		gameTable.bettingRound.currentRaiseToCall=0;
		gameTable.bettingRound.lastBet=null;
	

		for (var i=0;i<gameTable.game_size;i++)
			if(gameTable.seats[i].status=='playing')
				gameTable.seats[i].clearMoneyOnLine();
	}


	getRound() {
		return gameTable.bettingRound.round;
	}

	goToNextRound() {

		if (gameTable.bettingRound.round==3) {
			gameTable.bettingRound.round++;
			gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.clearRoundData();
			this.settleTheHand();
		}
		if (gameTable.bettingRound.round==2) {
			gameTable.bettingRound.round++;
			gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.dealRiver();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(gameTable.dealer.nextPlayer);
		}
		if (gameTable.bettingRound.round==1) {
			gameTable.bettingRound.round++;
			gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.dealTurn();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(gameTable.dealer.nextPlayer);
			

		}
		if (gameTable.bettingRound.round==0) {
			gameTable.bettingRound.round++;
			gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.dealFlop();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(gameTable.dealer.nextPlayer);
			
		}
		
		
	}

	settleTheHand() {
		console.log("SETTLING UP");

		var packageCards = {
			boardCards:[],
			playerCards:[]
		};
		var playerCardHolder;
		packageCards.boardCards=gameTable.board;


		for(var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=='playing'){
				playerCardHolder = {playerId:gameTable.seats[i].hash,
									cards:[gameTable.seats[i].card1,gameTable.seats[i].card2]
					};

				packageCards.playerCards.push(playerCardHolder);
				}
			}
		
		//get the winner(s)
		var winner = pokerCalc.getHoldemWinner(packageCards,{ compactCards: true});
		var storeWinners = [];

		for (var i=0;i<winner.length;i++) {
			winner = winner[i].playerId;
			winner=(this.getPlayerByHash(winner));
			storeWinners.push(winner);

	}
		//i can get hand desc just once cuz if they tie itll be the same
		var winningHand = [storeWinners[0].card1,storeWinners[0].card2,gameTable.board[0],gameTable.board[1],gameTable.board[2],gameTable.board[3],gameTable.board[4]];
		winningHand = Hand.solve(winningHand).descr;
		
		gameTable.winner.players=storeWinners;
		gameTable.winner.hand=winningHand;

		//save and give the pot
		gameTable.winner.winningPot=(gameTable.currentPot/storeWinners.length).toFixed(2);
		for (var i=0;i<storeWinners.length;i++) {
			storeWinners[i].givePot((gameTable.currentPot/storeWinners.length).toFixed(2));

		}


	}

	getNextAction () {

		//BIG BLIND CAN ACT AT END OF PRE-FLOP BETTING
		//IF ACTION IS TO BIGBLIND + AND NO ONE RAISED AKA LAST BET IS CALL AND THE CALL IS SAME AS BIG BLIND
		//THEN BIG BLIND AND 
		console.log("ROUND "+gameTable.bettingRound.round);
		if(this.getActionOnPlayer().hash === this.getBigBlindPlayer().hash
			&& gameTable.bettingRound.currentRaiseToCall == gameTable.bigBlind
			&& gameTable.bettingRound.lastBet==='call'
			&& gameTable.bettingRound.round==0) {
			gameTable.bettingRound.nextActionsAvailable = ['raise','check']; 
		}

		//SEE IF BIG BLIND CHECKED
		else if(gameTable.bettingRound.lastBet=='check' && gameTable.bettingRound.currentRaiseToCall == gameTable.bigBlind && gameTable.bettingRound.round==0){
			console.log("round over the big blind checked");
			this.goToNextRound();
		}

		//ROUND OVER IF LAST BET WAS CHECK AND SMALL IS UP

	//	console.log(this.getActionOnPlayer().hash +" vs "+this.getSmallBlindPlayer().hash);
		else if(gameTable.bettingRound.lastBet==='check' && this.getActionOnPlayer().hash===this.getSmallBlindPlayer().hash){
			//console.log(this.getActionOnPlayer().hash +" vs "+this.getSmallBlindPlayer().hash);
			console.log("round over everyone checked");
			if(gameTable.bettingRound.round<4)
				this.goToNextRound();
			else
				this.settleTheHand();
		}

		//ROUND OVER IF LAST BET WAS CALL AND PLAYER UP HAS MOL = CURRENTRAISE
		else if(gameTable.bettingRound.lastBet==='call' && this.getActionOnPlayer().moneyOnLine==gameTable.bettingRound.currentRaiseToCall){
			console.log("round over all bets in");
			if(gameTable.bettingRound.round<4)
				this.goToNextRound();
			else
				this.settleTheHand();
		}

		

		else if(gameTable.bettingRound.lastBet=='check') {
			gameTable.bettingRound.nextActionsAvailable = ['raise','check'];
			console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);

		}

		else if(gameTable.bettingRound.lastBet=='call') {
				gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);


		}
		//raise
		else if(gameTable.bettingRound.lastBet=='raise') {
				gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);


		}

		//IF THE LAST THING TO HAPPEN WAS BLINDS POSTING, AND MY MOL IS < BLINDS, I NEED TO PAY BLIND OR RAISE OR FOLD
		else if(gameTable.bettingRound.lastBet=='blinds'
			&& gameTable.seats[gameTable.bettingRound.actionOn.seat].moneyOnLine != gameTable.currentRaiseToCall) {
			
			gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold']; 
			
			console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);

			//var result = {'actionOn':gameTable.seats[gameTable.bettingRound.actionOn.seat,
			//		'options':availableOptions
			//		};
			//return result;

			//}
		}
	}

	advanceToNextPlayer(){
		gameTable.bettingRound.actionOn=gameTable.seats[gameTable.bettingRound.actionOn.seat].nextPlayer;
	}

	doAction(player,action,amt) {

		//check to see we have right player
		if(player.userid == gameTable.seats[gameTable.bettingRound.actionOn.seat].userid) {
			//check to see we have valid option
			if(gameTable.bettingRound.nextActionsAvailable.includes(action)){

				if(action=="check") {
					gameTable.bettingRound.lastBet='check';
					this.advanceToNextPlayer();
					console.log(player.userid+" has checked");
				
				}
				else if (action=="fold") {
					//must avance first cuz i unload nextplayer on fold
					this.advanceToNextPlayer();
					this.foldPlayer(player);
					console.log(player.userid+" has folded");


				}
				else if (action=="call") {
						var amtToCall = gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine;
					if(player.hasEnough(gameTable.bettingRound.currentRaiseToCall)) {
						//need to get diff of what player has in vs whats to call
						player.addMoneyToLine(amtToCall);
						gameTable.bettingRound.totalOnLine+=amtToCall;
						gameTable.bettingRound.lastBet='call';
						this.advanceToNextPlayer();
						console.log(player.userid+" has called "+gameTable.bettingRound.currentRaiseToCall);

					}
					else
						console.log("amount doesnt have enough for call");

				}
				else if (action=='raise') {
					//when you raise you need to call current pot and then raise further
					var amtToRaise = (gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine) + amt;
					console.log("is this 12?"+amtToRaise);
					if(player.hasEnough(amtToRaise)) {
						player.addMoneyToLine(amtToRaise);
						gameTable.bettingRound.totalOnLine+=amtToRaise;
						gameTable.bettingRound.lastBet='raise';
						gameTable.bettingRound.lastRaiser=player;
						//so when player had to put more in, the actual raise number only goes up how much he raised it
						gameTable.bettingRound.currentRaiseToCall+=amt;
						this.advanceToNextPlayer();
						console.log(player.userid+" has raised to "+gameTable.bettingRound.currentRaiseToCall);
					}
					else
						console.log("amount doesnt have enough for raise");
				}
			}
			else
				console.log("this is the right player, but you can't do that action");
		}

		else {
			console.log("this player is not up");
		}
	}


	//so we can send data to everyone
    getAllPlayerSessionIDs () {
    	var allPlayers = [];

    	for (var i=0;i<gameTable.game_size;i++){
    		if(gameTable.seats[i]!="empty") {
    			allPlayers.push({sessionid:gameTable.seats[i].sessionid,
    							userhash:gameTable.seats[i].hash});
    		}
    	}
    	return allPlayers;
    }
    //so we can package the data to send to everyone
	generatePrivatePlayerData (thisSessionId) {
		var privateGameTable =  JSON.stringify(gameTable,function( key, value) {
 			if(key == 'nextPlayer') { 
    			return "removedForStringify";
  			} 
  			if(key == 'previousPlayer') { 
    			return "removedForStringify";
  			} 
  			else {
    			return value;
  			};
		});

		privateGameTable = JSON.parse(privateGameTable);

		for(var i=0; i<gameTable.game_size;i++){
			if(privateGameTable.seats[i] != 'empty' 
				&&  privateGameTable.seats[i].card1!=null
				&&  !(privateGameTable.seats[i].sessionid===thisSessionId)) {
					privateGameTable.seats[i].card1 = "private";
					privateGameTable.seats[i].card2 = "private";

			}
		}
		return JSON.stringify(privateGameTable);
	}
}


exports.game=game;
//exports.addPlayer=addPlayer;