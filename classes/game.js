
var deck = require('./deck.js').deck;

var gameTable = {
	game_size:9,
 	seats:[],
	numseats:0,
	deck:[],
	board:[],
	dealer:null,
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
			lastBet:null
		}
};

class game {

	constructor () {
		for (var i=0;i<gameTable.game_size;i++)
			gameTable.seats[i] = "empty";

		gameTable.deck = new deck();
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
		for (var i=player.seat+1;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!="empty") {
				return gameTable.seats[i];
			}
		}
		for (var i=0;i<player.seat;i++){
			if(gameTable.seats[i]!="empty") {
				return gameTable.seats[i];
			}
		}
	}

	setNextPlayer (player) {
		player.nextPlayer = this.getNextPlayer(player);
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
				console.log(player.userid+" joined game!")
			}
			
			if(gameTable.numseats!=1) {
				this.setNextPlayer(gameTable.seats[seat]);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;
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
		return bigBlindPayer;
	}

	postBlinds() {
		var smallBlindPayer = gameTable.seats[gameTable.dealer.seat].nextPlayer;
		var bigBlindPayer = gameTable.seats[smallBlindPayer.seat].nextPlayer;

		//withdraw and add to line
		gameTable.seats[smallBlindPayer.seat].addMoneyToLine(gameTable.smallBlind);
		gameTable.totalOnLine+=gameTable.smallBlind;

		gameTable.seats[bigBlindPayer.seat].addMoneyToLine(gameTable.bigBlind);
		gameTable.totalOnLine+=gameTable.bigBlind;

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


	getNextAction () {

		//BIG BLIND CAN ACT AT END OF PRE-FLOP BETTING
		//IF ACTION IS TO BIGBLIND + AND NO ONE RAISED AKA LAST BET IS CALL AND THE CALL IS SAME AS BIG BLIND
		//THEN BIG BLIND AND 
		if(this.getActionOnPlayer().userid == this.getBigBlindPlayer().userid
			&& this.getBigBlindPlayer().currentRaiseToCall == gameTable.bigBlind
			&& gameTable.bettingRound.lastBet=='call') {
			gameTable.bettingRound.nextActionsAvailable = ['raise','call','check']; 
		}

		//ROUND OVER IF LAST BET WAS CHECK AND UNDERGUN IS UP
		if(gameTable.bettingRound.lastBet=='check' && this.getActionOnPlayer().userid==this.getUnderTheGunPlayer()){
			console.log("round over everyone checked");
			return false;
		}

		//ROUND OVER IF LAST BET WAS CALL AND PLAYER UP HAS MOL = CURRENTRAISE
		if(gameTable.bettingRound.lastBet=='call' && this.getActionOnPlayer().moneyOnLine==gameTable.bettingRound.currentRaiseToCall){
			console.log("round over all bets in");
			return false;
		}

		

		if(gameTable.bettingRound.lastBet=='check') {
			gameTable.bettingRound.nextActionsAvailable = ['raise','call','check'];
			console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);

		}

		if(gameTable.bettingRound.lastBet=='call') {
				gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);


		}

		//IF THE LAST THING TO HAPPEN WAS BLINDS POSTING, AND MY MOL IS < BLINDS, I NEED TO PAY BLIND OR RAISE OR FOLD
		if(gameTable.bettingRound.lastBet=='blinds'
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
					if(player.hasEnough(gameTable.bettingRound.currentRaiseToCall)) {
						player.addMoneyToLine(gameTable.bettingRound.currentRaiseToCall);
						gameTable.bettingRound.totalOnLine+=gameTable.bettingRound.currentRaiseToCall;
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
						gameTable.bettingRound.currentRaiseToCall+amt;
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
	generatePrivatePlayerData (player) {}


}


exports.game=game;
//exports.addPlayer=addPlayer;