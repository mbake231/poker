
var deck = require('./deck.js').deck;
var pot = require('./pot.js').pot;

var pokerCalc = require('poker-calc');
var Hand = require('pokersolver').Hand;

var gameTable = {
	hash:'train',
	game_size:9,
 	seats:[],
	numseats:0,
	isSettled: 'no',
	deck:[],
	board:[null,null,null,null,null],
	dealer:null,
	isTimerGame:false,
	winner:{
		players:[],
		hand:null,
		winningPot:0},
	currentPot:null,
	smallBlind:1,  //add to constructor
	bigBlind:2,
	bettingRound: {
		lastRaiser:null,
		potsTotal:0,
		pots:[],
		actionOn:null,
		actionOnTimer:null,
		actionOnTimeLimit:5,
		nextActionsAvailable:[],
		round:0,
		totalOnLine:0,
		currentRaiseToCall:0,
		currentRaiseToCall:null,
		endByFold:false
		}
};

class game {

	constructor () {
		for (var i=0;i<gameTable.game_size;i++)
			gameTable.seats[i] = "empty";

		gameTable.deck = new deck();
		gameTable.hash = this.makeid(16);
		gameTable.bettingRound.pots[0] =  new pot(0);
		gameTable.currentPot=gameTable.bettingRound.pots[0];


	}



	goToNextHand () {
	if(gameTable.numseats>1){
			gameTable.deck = new deck();
			gameTable.dealer=gameTable.dealer.nextPlayer;
			gameTable.winner.players=null;
			gameTable.winner.hand=null;
			gameTable.winner.winningPot=null;
			gameTable.board=[];
			gameTable.currentPot=0;
			gameTable.bettingRound.lastRaiser=null;
			gameTable.bettingRound.nextActionsAvailable=[];
			gameTable.bettingRound.round=0;
			gameTable.bettingRound.totalOnLine=0;
			gameTable.bettingRound.currentRaiseToCall=0;
			gameTable.bettingRound.currentRaiseToCall=null;
			gameTable.isSettled='no';
			gameTable.bettingRound.endByFold=false;

			//new pots
			gameTable.bettingRound.pots=[];
			gameTable.bettingRound.pots[0] = new pot(0);
			gameTable.currentPot=gameTable.bettingRound.pots[0];


			//clear cards
			for(var i=0;i<gameTable.game_size;i++)
			{
				if(gameTable.seats[i].status=='inhand'||gameTable.seats[i].status=='folded'||gameTable.seats[i].status=='allin'){
					gameTable.seats[i].card1=null;
					gameTable.seats[i].card2=null;
					}
						
			}

			//remove those who were set to leave
			for (var i=0;i<gameTable.game_size;i++) {
				if(gameTable.seats[i].leavenexthand==true) {
					gameTable.seats[i]='empty';
					this.deletePlayer(gameTable.seats[i]);
				}
			}
			//set sitting out
			for (var i=0;i<gameTable.game_size;i++) {
				if(gameTable.seats[i].sitoutnexthand==true) {
					gameTable.seats[i].status='sittingout';
					gameTable.numseats--;
				}

			}

			//set to waiting to play
			for (var i=0;i<gameTable.game_size;i++)
			{
				//if(gameTable.seats[i].status=='inhand' || gameTable.seats[i].status=='folded'|| gameTable.seats[i].status=='allin' )
				if(gameTable.seats[i].sitoutnexthand==false){
					gameTable.seats[i].status='playing';
					console.log(gameTable.seats[i].seat+" is now set to "+gameTable.seats[i].status);
				}
			}

			//restore pointers
			for (var i=0;i<gameTable.game_size;i++) {
				if(gameTable.seats[i].status=='playing' ) {
					this.setNextPlayer(gameTable.seats[i]);
				}
			}

		}
	//if you dont have more than one person
	else
		console.log('need more than one person');
	}

	deletePlayer(player) {
		gameTable.seats[player.seat]="empty";
		gameTable.numseats--;
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
				if(gameTable.seats[i]!="empty" && gameTable.seats[i].status!='allin')
					return gameTable.seats[i];
			}
		for(var i=8;i>player.seat;i--)
			{
				if(gameTable.seats[i]!="empty" && gameTable.seats[i].status!='allin')
					return gameTable.seats[i];
			}
	}

	getNextPlayer(player) {
		for (var i=Number(player.seat)+1;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!="empty" && gameTable.seats[i].status!='sittingout') {
				//console.log(player.seat+" YOUR NEXT PERSON IS NOW TOP "+i+".   f"+ gameTable.seats[i]);
				return gameTable.seats[i];
			}
		}
		for (var i=0;i<player.seat;i++){
			if(gameTable.seats[i]!="empty" && gameTable.seats[i].status!='sittingout') {
				//console.log(player.seat+" YOUR NEXT PERSON IS NOW "+ gameTable.seats[i]);
				return gameTable.seats[i];
			}
		}
	}

/*	printEveryonesNextPlayer() {
		for (var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i]!='empty')
				console.log("Seat 1's next is"+gameTable.seats[i].nextPlayer.seat+ "and previos us is");
		}
	}*/

	setNextPlayer (player) {
		player.nextPlayer = this.getNextPlayer(player);

		//console.log(player.nextPlayer.seat+" then goes"+player.seat);
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
				//this.printEveryonesNextPlayer();
				//console.log (player.nextPlayer.seat + " the other guy is now pointing at me " + player.nextPlayer.nextPlayer )
			}
			if(gameTable.numseats>2) {
				this.setNextPlayer(gameTable.seats[seat]);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;
			//	this.printEveryonesNextPlayer();
			}
		}
	}

	foldPlayer (player) {
		player.status="folded";
		this.getPreviousPlayer(player).nextPlayer=this.getNextPlayer(player);
		//player.nextPlayer = "folded";

	}

	printSeats () {
		for(var i=0;i<gameTable.game_size;i++) {

			if(gameTable.seats[i]!="empty"){
				console.log("Seat "+i+": "+gameTable.seats[i].userid+
					" Balance:"+gameTable.seats[i].balance+
					" Status: "+gameTable.seats[i].status+
				//	" Next up :"+gameTable.seats[i].nextPlayer.userid+
					" Hand: "+ gameTable.seats[i].card1+" "+gameTable.seats[i].card2+
					" $ in: "+ gameTable.seats[i].moneyOnLine
					);
			}
			else
				console.log("Seat "+i+": Empty");
		}
		for (var i=0;i<gameTable.board.length;i++)
				console.log(gameTable.board[i]+" ");
			
		
			
		
	}

	getNumberPlayersInHand () {
		let counter=0;
		for (var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=="inhand")
				counter++;
		}
		return counter;

	}

	getNumberPlayersAllIn () {
		let counter=0;
		for (var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=="allin")
				counter++;
		}
		return counter;
	}

	//pass me who is the dealer
	setDealer(player) {
		//check to make sure theyre not sitting out, if so next guy gets it
		for(var i=player.seat;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=='playing') {
				gameTable.dealer=gameTable.seats[i];
				return gameTable.seats[i];
			}
		}

		for(var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=='playing') {
				gameTable.dealer=gameTable.seats[i];
				return gameTable.seats[i];
			}
		}

		return false;
		//console.log("the dealer is now "+player.userid +" at seat" +player.seat+" "+gameTable.dealer.seat);
	}
	dealHands() {

		for (var i=0;i<gameTable.game_size;i++)
		{
			if(gameTable.seats[i].status=='playing'|| gameTable.seats[i].status=='folded')
				gameTable.seats[i].status='inhand';
		}
		
		//deal card 1
		var cardGetter = gameTable.seats[gameTable.dealer.seat].nextPlayer;
			while (cardGetter.card1==null && cardGetter.status=='inhand')
			{
				console.log("dealing to seeat "+cardGetter.seat);
				cardGetter.card1=gameTable.deck.dealCard();
				cardGetter = gameTable.seats[cardGetter.seat].nextPlayer;
			}
			//deal card 1
			while (cardGetter.card2==null && cardGetter.status=='inhand')
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
		//var smallBlindPayer = gameTable.seats[gameTable.dealer.seat].nextPlayer;
		var bigBlindPayer = gameTable.seats[this.getSmallBlindPlayer().seat].nextPlayer;
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
		if(gameTable.isTimerGame==true)
			this.actionOnTimer();
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
			if(gameTable.seats[i].status=='inhand'||gameTable.seats[i].status=='folded'||gameTable.seats[i].status=='allin')
				gameTable.seats[i].clearMoneyOnLine();
	}


	getRound() {
		return gameTable.bettingRound.round;
	}



	goToNextRound() {

		if(this.isOnlyOnePlayerNotAllIn()==true) {
			gameTable.bettingRound.round=4;
			this.addMoneyLineToPot();
			this.clearRoundData();
			this.settleTheHand();
		}

		if (gameTable.bettingRound.round==3) {
			gameTable.bettingRound.round++;

			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.clearRoundData();
			this.settleTheHand();
			//console.log("ROUND "+gameTable.bettingRound.round+" STARTER "+this.whoShouldStartRound().userid+" RIGHT?" +this.getActionOnPlayer().userid);

		}
		if (gameTable.bettingRound.round==2) {
			gameTable.bettingRound.round++;
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealRiver();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(this.whoShouldStartRound());
		//	console.log("ROUND "+gameTable.bettingRound.round+" STARTER "+this.whoShouldStartRound().userid+" RIGHT?" +this.getActionOnPlayer().userid);

		}
		if (gameTable.bettingRound.round==1) {

			gameTable.bettingRound.round++;
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealTurn();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(this.whoShouldStartRound());
		//	console.log("ROUND "+gameTable.bettingRound.round+" STARTER "+this.whoShouldStartRound().userid+" RIGHT?" +this.getActionOnPlayer().userid);


		}
		if (gameTable.bettingRound.round==0) {
			gameTable.bettingRound.round++;
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealFlop();
			this.clearRoundData();
			//set action to small blind
			this.setActionOn(this.whoShouldStartRound());
		//	console.log("ROUND "+gameTable.bettingRound.round+" STARTER "+this.whoShouldStartRound().userid+" RIGHT?" +this.getActionOnPlayer().userid);

		}
		
		
	}

	whoShouldStartRound() {

		for (var i=gameTable.dealer.seat+1;i<gameTable.game_size;i++){
			if(gameTable.seats[i].status=='inhand')
				return gameTable.seats[i];
		}
		for (var i=0;i<gameTable.game_size;i++){
			if(gameTable.seats[i].status=='inhand')
				return gameTable.seats[i];
		}
	}


	isSameAmountOnEveryonesMoneyLine() {
		var last = 0;
		for(var i = 0;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!='empty'){
				last = Number(gameTable.seats[i].moneyOnLine);
			}
		}

		//make sure everyone matches last
		for(var i = 0;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!='empty')
				if(Number(gameTable.seats[i].moneyOnLine)!=last){
					return false;
			}
		}
		return true;
	}

	leaveTableNextHand (hash) {
		var playerToLeave = this.getPlayerByHash(hash);
		//make sure i pass dealer to the next player if i am dealer
		if(gameTable.dealer!=null){
			if(gameTable.dealer.hash===playerToLeave.hash)
				gameTable.dealer = playerToLeave.nextPlayer;
		}



		//leave
	
		if(playerToLeave.status=='sittingout' || playerToLeave.status=='folded' || playerToLeave.status=='playing') {
			this.deletePlayer(playerToLeave);

		}
		else
			playerToLeave.leavenexthand = true;		

		
	}

	areMoneyLinesZero() {
	

		for(var i = 0;i<gameTable.game_size;i++){
			if(gameTable.seats[i]!='empty'){
				if(Number(gameTable.seats[i].moneyOnLine)>0)
					return false;
			}
		}

		return true;
	}

	isPlayerMemberofCurrentPot (player) {
		for (var i=0; i<gameTable.currentPot.members.length;i++)
			if(gameTable.currentPot.isMemberByHash(player.hash)==true)
				return true;
		return false;

	}

	deductMoneyLineAndAddToPot (amt){
		//deduct that amount from everyone and add them as a member
		for(var i = 0;i<gameTable.game_size;i++){
				if((gameTable.seats[i].status=='folded'|| gameTable.seats[i].status=='inhand' 
					|| gameTable.seats[i].status=='allin') && gameTable.seats[i].moneyOnLine>0){
						gameTable.seats[i].moneyOnLine-=amt;
						gameTable.currentPot.total+=amt;
						gameTable.bettingRound.potsTotal+=amt;
						//already a member or not?
						if(this.isPlayerMemberofCurrentPot(gameTable.seats[i])==false && gameTable.seats[i].status!='folded'){
							gameTable.currentPot.addMember(gameTable.seats[i]);
							//console.log(gameTable.seats[i].seat+" IS NOW A MEMBER OF POT LOOK HERE: "+gameTable.currentPot.getMemberByHash(gameTable.seats[i].hash).seat);
						}
				}
			}

			//remove all folders
			for(var i=0;i<gameTable.bettingRound.pots.length;i++)
				for(var a=0;a<gameTable.bettingRound.pots[i].members.length;a++)
					if(gameTable.bettingRound.pots[i].members[a]!=null)
						if (gameTable.bettingRound.pots[i].members[a].status=='folded') {
							//console.log('POT '+i+' REMOVED FOLDER NUM '+ a+' NAMED '+gameTable.bettingRound.pots[i].members[a].userid);
							a = gameTable.bettingRound.pots[i].removeMember(gameTable.bettingRound.pots[i].members[a])-1;
				}
	}

	printGamePots() {
		for(var i=0;i<gameTable.bettingRound.pots.length;i++)
			console.log(gameTable.bettingRound.pots[i].printPot());
	}

	addMoneyLineToPot(){

		//if everyone folded and no one is all in then just jam the lines in and pay it out
		var NumberofAllInPlayers=0;
		for (var i=0;i<gameTable.seats.length;i++)
			if(gameTable.seats[i].status==='allin')
				NumberofAllInPlayers++;

		if(NumberofAllInPlayers==0 && gameTable.bettingRound.endByFold==true) {
			for (var i=0;i<gameTable.game_size;i++) {
					if(gameTable.seats[i].status === 'inhand' || gameTable.seats[i].status === 'folded') {
						gameTable.currentPot.total+=gameTable.seats[i].moneyOnLine;
						gameTable.bettingRound.potsTotal+=gameTable.seats[i].moneyOnLine;
						gameTable.seats[i].moneyOnLine-=gameTable.seats[i].moneyOnLine;
						//gameTable.seats[i].moneyOnLine=0;
					}
				}
		}

		else {

			//	for (var i=0;i<gameTable.game_size;i++)
		//		console.log(gameTable.seats[i].userid+" "+gameTable.seats[i].moneyOnLine);

			//find lowest money on line, if its the same for everyone it will be the common denom
			let lowest = 999999999;
				for(var i = 0;i<gameTable.game_size;i++){
					if((gameTable.seats[i].status==='inhand' || gameTable.seats[i].status==='allin') && gameTable.seats[i].moneyOnLine>0){
						if(gameTable.seats[i].moneyOnLine<lowest) {
							lowest=gameTable.seats[i].moneyOnLine;
						}
					}
				}
			this.deductMoneyLineAndAddToPot(lowest);
			//reset counter
			lowest=9999999;

			if(this.areMoneyLinesZero() == true) {
							//		console.log("%%%%%%%%%%%%%%%%%ONE%%%%%%%%%%%%%%%%%%%%%");

				//check to see if members of current pot are all in. if so we need a new one, cuz if i called the 
				//last bet to end the round and it put me all in then we have to make a new pot for next round
				for(var i=0;i<gameTable.currentPot.members.length;i++) {
					if(gameTable.currentPot.members[i].status=='allin') {
						let newPot = new pot(0);
						//console.log("%%%%%%%%%%%%%%%%%%%TWO%%%%%%%%%%%%%%%%%%%");
						gameTable.bettingRound.pots.push(newPot);
						gameTable.currentPot=newPot;
					}

				}
				gameTable.bettingRound.totalOnLine=0;
				//were done!
				return false;

				//what is failed to do is make a new pot after settlining someone all in perfectly in to the last one
			}
			else {
				//we are not done!
				let newPot = new pot(0);
				gameTable.bettingRound.pots.push(newPot);
				gameTable.currentPot=newPot;
				this.addMoneyLineToPot();
			}
		}
	}

	settleTheHand() {
		console.log("SETTLING UP");
		//stop the timer
		clearTimeout(gameTable.bettingRound.actionOnTimer);
		//first lets add the board to the check package cuz its same for all


		//check to see if we have any in players 
		var NumberofAllInPlayers=0;
		for (var i=0;i<gameTable.seats.length;i++)
			if(gameTable.seats[i].status==='allin')
				NumberofAllInPlayers++;

		//if we have all ins, and the game was folded dead, we may need to put more cards out
		if (NumberofAllInPlayers>0 && (gameTable.bettingRound.endByFold==true || this.isOnlyOnePlayerNotAllIn()==true)) {
					//do a show down
			for(var i=0;i<gameTable.board.length;i++){
				if(gameTable.board[i]==null) {
					gameTable.board[i]=gameTable.deck.dealCard();
					}
				}
			}
	
		console.log(gameTable.board);
		var packageCards = {
			boardCards:gameTable.board,
			playerCards:[]
			};
		/*here i am going to looks at all the pots and divide them up amongst winning hands of the members
		
		

		*/
		//check to see if someone didnt win by fold
		if(gameTable.bettingRound.endByFold==false || NumberofAllInPlayers>0) {
			//console.log("HOW MANY POTS DO I GOT "+gameTable.bettingRound.pots.length);

			var selectedPot;
			for(var i=0;i<gameTable.bettingRound.pots.length;i++) {
				

					//NEEDS TO PAY THE WINNERS OF EACH POT MEMBERS
					//1 package the hands of the members to check them
					var playerCardHolder;
					selectedPot = gameTable.bettingRound.pots[i];
					selectedPot.printPot();

					for(var a=0;a<selectedPot.members.length;a++) {

						if(selectedPot.members[a].status=='inhand' || selectedPot.members[a].status=='allin') {

							packageCards.playerCards.push(
								{playerId:selectedPot.members[a].hash,
								cards:[selectedPot.members[a].card1,
										selectedPot.members[a].card2]});
					//		console.log(this.getPlayerByHash(selectedPot.members[a].hash).userid,
						//		selectedPot.members[a].card1,selectedPot.members[a].card2);

						}
					}
					//2 send the package to get winner
					var winner = pokerCalc.getHoldemWinner(packageCards,{ compactCards: true});
				//	console.log("API RESPONSE:  "+JSON.stringify(winner));
					//3 PAY WINNERS
					for (var b=0;b<winner.length;b++) {
						var amtToPay = selectedPot.total/winner.length;
						var winningPlayer = this.getPlayerByHash(winner[b].playerId);
						var winningHand = Hand.solve([winningPlayer.card1,winningPlayer.card2,gameTable.board[0],gameTable.board[1],gameTable.board[2],gameTable.board[3],gameTable.board[4]]).descr;



						winningPlayer.givePot(amtToPay);
							//ANNOUNCE IT
						console.log("POT TOTAL="+selectedPot.total
							+" AND IT PAID "+ this.getPlayerByHash(winner[b].playerId).userid +" $"
							+amtToPay);
					//4 store winner of each pot with beautified hand
						
						selectedPot.winners.push({winner:winningPlayer,
											winningHand:winningHand,
											winningCards:[winningPlayer.card1,winningPlayer.card2]});
					}


				
				//reset card package
				packageCards = {
					boardCards:gameTable.board,
					playerCards:[]
				};
				}
				
			}
			//everyone folded and no one was all in
			else if (gameTable.bettingRound.endByFold==true && NumberofAllInPlayers==0) {
				/*clear the line and shove it into the pot without making new pots
				for (var i=0;i<gameTable.game_size;i++) {
					if(gameTable.seats[i].status === 'inhand' || gameTable.seats[i].status === 'folded') {
						gameTable.currentPot.total+=gameTable.seats[i].moneyOnLine;
						gameTable.seats[i].moneyOnLine-=gameTable.seats[i].moneyOnLine;
						//gameTable.seats[i].moneyOnLine=0;
					}
				}*/



				this.addMoneyLineToPot();
				var amtToPay=0;
				//find winner
				var numAllIn=0;
				var lastManStanding;
				for (var i=0;i<gameTable.seats.length;i++){
					if(gameTable.seats[i].status==='inhand')
						lastManStanding=gameTable.seats[i];
					
				}
				//set all pots winner to last man standing and add amount to pay
				for(var i=0;i<gameTable.bettingRound.pots.length;i++) {
					//set winner
					gameTable.bettingRound.pots[i].winners.push({winner:lastManStanding,
											winningHand:"everyone folding."});
					//total winning
					amtToPay=+gameTable.bettingRound.pots[i].total;

					console.log("POT "+i+" FOLDED POT TOTAL="+gameTable.bettingRound.pots[i].total
							+" AND IT PAID "+ gameTable.bettingRound.pots[i].winners[0].winner.userid +" $"
							+amtToPay);
				}
				//pay the man his money
				lastManStanding.givePot(amtToPay);
			}

			gameTable.isSettled="yes";
		}



/*
		if(this.getNumberPlayersInHand()+this.getNumberPlayersAllIn()>1) {
			gameTable.bettingRound.round=4;
			

			
			
			//get the winner(s)
			
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


		}//if
		else {
			this.clearRoundData();
			//find last guy and guy pot
			for(var i=0;i<gameTable.game_size;i++){
				if(gameTable.seats[i].status=='inhand'){
					gameTable.winner.players=[gameTable.seats[i]];
					gameTable.winner.hand="everyone folded";
					gameTable.winner.winningPot=gameTable.currentPot.toFixed(2);
					gameTable.seats[i].givePot(gameTable.currentPot.toFixed(2));
				}
			}
		}
	}
*/

	

	
	putPlayerAllIn(player){
		player.status="allin";
		var myPreviousPlayer = this.getPreviousPlayer(player);
		//console.log(myPreviousPlayer+myPreviousPlayer+myPreviousPlayer+myPreviousPlayer);
		var myNextPlayer = this.getNextPlayer(player);

		myPreviousPlayer.nextPlayer = myNextPlayer;

		console.log(myPreviousPlayer.userid + " NOW GOES TO "+myNextPlayer.userid);
		//player.nextPlayer = "folded";


	}

	isOnlyOnePlayerNotAllIn() {
		var counter=0;
		for(var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].status=='inhand')
				counter++;
		}

		if(counter==1){
			return true;
		}
		return false;
	}

	callClock() {
			this.actionOnTimer();
	}

	getTimerLength () {
		return gameTable.bettingRound.actionOnTimeLimit;
	}

	actionOnTimer() {
		var scope = this;
		clearTimeout(gameTable.bettingRound.actionOnTimer);
		//here im gunnan set a timer session id and store it globally, the next person should change the global variable
		gameTable.bettingRound.actionOnTimer=setTimeout(

			function (){
				scope.doAction(gameTable.bettingRound.actionOn,'fold');
				gameTable.bettingRound.actionOn.sitoutnexthand=true;
				//gameController.sendDataToAllPlayers();
				scope.getNextAction();

			}

			, 1000*gameTable.bettingRound.actionOnTimeLimit);

		




		/*var personToTime=gameTable.bettingRound.actionOn;
		var timerLengthSeconds = gameTable.bettingRound.actionOnTimer;
		var thisTimerSession = this.makeid(16);
		gameTable.bettingRound.actionOnTimerSession = thisTimerSession;

		
		setTimeout(function(){ 
			if(thisTimerSession===gameTable.bettingRound.actionOnTimerSession)
				this.doAction(gameTable.bettingRound.actionOn,'fold');

		 }, 1000*timerLengthSeconds);
		*/
		
	}

	getNextAction () {


		//if someone is all in and only one person left
	//	if(this.isOnlyOnePlayerNotAllIn()==true && gameTable.bettingRound.lastBet==='raise') {
	//		gameTable.bettingRound.nextActionsAvailable = ['call','fold']; 
	//	}
	/*	console.log('my status is '+gameTable.bettingRound.actionOn.status
			+" and num all in is "+this.getNumberPlayersAllIn()
			+" my seat is: "+gameTable.bettingRound.actionOn.seat
			+" and next person to go is seat "+gameTable.bettingRound.actionOn.nextPlayer.seat
			);
		//so if someone is all in, and im not, i can call
		 if(this.getNumberPlayersAllIn()>0 && gameTable.bettingRound.actionOn.status=='inhand' && gameTable.bettingRound.lastBet=='raise'){
				gameTable.bettingRound.nextActionsAvailable = ['call','fold']; 
				
		}


	
			
		}*/


		//check to see if this call was the last call to another players all in and no one is left
		//else if(this.isOnlyOnePlayerNotAllIn()==true && gameTable.bettingRound.lastBet==='call' && gameTable.bettingRound.actionOn.status=='allin'){
		//		gameTable.bettingRound.nextActionsAvailable = ['call','fold']; 
				
		//}

	//	else if(this.isOnlyOnePlayerNotAllIn()==true && gameTable.bettingRound.lastBet==='call' && gameTable.bettingRound.actionOn.status=='inhand'){
	//			this.doAShowDown();
	//			this.settleTheHand();
				
	//	}
		//		console.log(this.getActionOnPlayer().user+" vs "+this.whoShouldStartRound().userid);


		//BIG BLIND CAN ACT AT END OF PRE-FLOP BETTING
		//IF ACTION IS TO BIGBLIND + AND NO ONE RAISED AKA LAST BET IS CALL AND THE CALL IS SAME AS BIG BLIND
		//THEN BIG BLIND AND 
		//console.log("ROUND "+gameTable.bettingRound.round);
		 if(this.getActionOnPlayer().hash === this.getBigBlindPlayer().hash
			&& gameTable.bettingRound.currentRaiseToCall == gameTable.bigBlind
			&& gameTable.bettingRound.lastBet==='call'
			&& gameTable.bettingRound.round==0) {
			gameTable.bettingRound.nextActionsAvailable = ['raise','check']; 
			if(gameTable.isTimerGame==true)
				this.actionOnTimer();
		}

		//else if(gameTable.bettingRound.lastBet=='check' && )

		//SEE IF BIG BLIND CHECKED
		else if(gameTable.bettingRound.lastBet=='check' && gameTable.bettingRound.currentRaiseToCall == gameTable.bigBlind && gameTable.bettingRound.round==0){
			console.log("round over the big blind checked");
			if(gameTable.isTimerGame==true)
				this.actionOnTimer();
		}

		//if someone is all in, and i am last person in hand (pointing to myself)
	//	else if(this.getNumberPlayersAllIn()>0 && gameTable.bettingRound.actionOn.nextPlayer.hash===gameTable.bettingRound.actionOn.hash) {
	//		this.doAShowDown();
	//		this.settleTheHand();

		//ROUND OVER IF LAST BET WAS CHECK AND first guy up
		else if(gameTable.bettingRound.lastBet==='check' && this.getActionOnPlayer().hash===this.whoShouldStartRound().hash){
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
			if(gameTable.isTimerGame==true)
				this.actionOnTimer();
		}

		else if(gameTable.bettingRound.lastBet=='call') {
			//if this call puts them all in
			if(this.getActionOnPlayer().balance<=(gameTable.currentRaiseToCall-this.getActionOnPlayer().moneyOnLine)){
				gameTable.bettingRound.nextActionsAvailable = ['call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);
				if(gameTable.isTimerGame==true)
					this.actionOnTimer();
			}
			//if it doesnt put them all in
			else {
				gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);
				if(gameTable.isTimerGame==true)
					this.actionOnTimer();
			}


		}
		//raise
		else if(gameTable.bettingRound.lastBet=='raise') {
			if(this.getActionOnPlayer().balance<=(gameTable.currentRaiseToCall-this.getActionOnPlayer().moneyOnLine)){
				gameTable.bettingRound.nextActionsAvailable = ['call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);
				if(gameTable.isTimerGame==true)
					this.actionOnTimer();
			}
			//if it doesnt put them all in
			else {
				gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);
				if(gameTable.isTimerGame==true)
					this.actionOnTimer();
			}


		}

		//IF THE LAST THING TO HAPPEN WAS BLINDS POSTING, AND MY MOL IS < BLINDS, I NEED TO PAY BLIND OR RAISE OR FOLD
		else if(gameTable.bettingRound.lastBet=='blinds'
			&& gameTable.seats[gameTable.bettingRound.actionOn.seat].moneyOnLine != gameTable.currentRaiseToCall) {
			
			gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold']; 
			
			console.log("action: "+gameTable.seats[gameTable.bettingRound.actionOn.seat].userid +" "+gameTable.bettingRound.nextActionsAvailable);
			if(gameTable.isTimerGame==true)
				this.actionOnTimer();
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
		clearTimeout(gameTable.bettingRound.actionOnTimer);
		var foldCounter=0;
		//check to see we have right player
		if(player.hash == gameTable.seats[gameTable.bettingRound.actionOn.seat].hash) {
			//check to see we have valid option
			if(gameTable.bettingRound.nextActionsAvailable.includes(action)){

				if(action=="check") {
					gameTable.bettingRound.lastBet='check';
					this.advanceToNextPlayer();
					console.log(player.userid+" has checked");
				
				}
				else if (action=="fold") {
					console.log(player.userid+" has folded");
					this.foldPlayer(player);
					
					//chek to see if only one guy left
					for(var i=0;i<gameTable.game_size;i++){
						if(gameTable.seats[i].status=='inhand')
							foldCounter++;
						
					}
					if(foldCounter==1){
						gameTable.bettingRound.endByFold=true;
						gameTable.bettingRound.round=4;
						//we actually add the money line in the settling logi in this case, because we dont want
						//to make new pots if someone folded and didnt call with different MOL sizes
						this.addMoneyLineToPot();
						this.settleTheHand();
					}
					else{
						//must avance first cuz i unload nextplayer on fold
						this.advanceToNextPlayer();
						
					}
					

				}
				else if (action=="call") {
						var amtToCall = gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine;
					//	console.log('amt to call '+amtToCall+" hasEnough?"+player.hasEnough(gameTable.bettingRound.currentRaiseToCall));
					
					//either they have enough to cover or theyre all in
					if(player.hasEnough(amtToCall)||player.balance<amtToCall) {

						//are they all in?
						if(player.balance<amtToCall) {
							this.putPlayerAllIn(player);
							player.addMoneyToLine(player.balance);
							gameTable.bettingRound.totalOnLine+=player.balance;
						}
						else {
							player.addMoneyToLine(amtToCall);
							gameTable.bettingRound.totalOnLine+=amtToCall;
						}

						//need to get diff of what player has in vs whats to call
						
						gameTable.bettingRound.lastBet='call';

						
						
						this.advanceToNextPlayer();

						console.log(player.userid+" has called "+gameTable.bettingRound.currentRaiseToCall);

						//check to see if this call sets player all in all in
						//will need to allow a call if it puts someone all in
						if(player.balance==0){
							this.putPlayerAllIn(player);
							console.log("ALL IN");
						}

						
					}
					else
						console.log("amount doesnt have enough for call");

				}
				else if (action=='raise') {
					//when you raise you need to call current pot and then raise further
					var amtToRaise = (gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine) + amt;
					//console.log("is this 12?"+amtToRaise);
					if(player.hasEnough(amtToRaise)) {
						player.addMoneyToLine(amtToRaise);
						gameTable.bettingRound.totalOnLine+=amtToRaise;
						gameTable.bettingRound.lastBet='raise';
						gameTable.bettingRound.lastRaiser=player;
						//so when player had to put more in, the actual raise number only goes up how much he raised it
						gameTable.bettingRound.currentRaiseToCall+=amt;
						this.advanceToNextPlayer();
						console.log(player.userid+" has raised to "+gameTable.bettingRound.currentRaiseToCall);
						if(player.balance==0)
							this.putPlayerAllIn(player);
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
	doAShowDown() {
		if(gameTable.bettingRound.round==3) {
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			gameTable.bettingRound.round=4;	
			this.clearRoundData();
		}
		else if (gameTable.bettingRound.round==2){
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealRiver();
			gameTable.bettingRound.round=4;
			this.clearRoundData();
			//this.settleTheHand();
		}
		else if (gameTable.bettingRound.round==1){
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealTurn();
			this.dealRiver();
			gameTable.bettingRound.round=4;
			this.clearRoundData();
			//this.settleTheHand();
		}
		else if (gameTable.bettingRound.round==0){
			//gameTable.currentPot+=gameTable.bettingRound.totalOnLine;
			this.addMoneyLineToPot();
			this.dealFlop();
			this.dealTurn();
			this.dealRiver();
			gameTable.bettingRound.round=4;
			this.clearRoundData();
		//	this.settleTheHand();

		}
		
	}

	//so we can send data to everyone
    getAllPlayerSessionIDs () {
    	var allPlayers = [];

    	for (var i=0;i<gameTable.game_size;i++){
    		if(gameTable.seats[i]!="empty") {
    			allPlayers.push({sessionid:gameTable.seats[i].sessionid,
    							hash:gameTable.seats[i].hash});
    		}
    	}
    	console.log(JSON.stringify(allPlayers));
    	return allPlayers;
    }


    //so we can send data to everyone
    findPlayerBySessionID (findThisSessionid) {
    	for (var i=0;i<gameTable.game_size;i++){
    		//console.log(gameTable.seats[i].sessionid +' vs '+findThisSessionid);

    		if(gameTable.seats[i].sessionid===findThisSessionid) 
	    		return gameTable.seats[i];
    	}		 
    	return false;
    }
    //so we can package the data to send to everyone
	generatePrivatePlayerData (thisHash) {
		var privateGameTable =  JSON.stringify(gameTable,function( key, value) {
			//remove circular stuff
 			if(key == 'nextPlayer') { 
    			return "removedForStringify";
  			} 
  			if(key == 'previousPlayer') { 
    			return "removedForStringify";
  			} 
  			if(key == 'actionOnTimer') { 
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
				&&  privateGameTable.seats[i].hash!=thisHash) {
					privateGameTable.seats[i].card1 = "private";
					privateGameTable.seats[i].card2 = "private";

			}
		}
		//console.log(privateGameTable.seats[i].hash+" vs "+thisHash);
		return JSON.stringify(privateGameTable);
	}

	getPublicSeatList() {
		var publicSeatList =  JSON.stringify(gameTable,function( key, value) {
 			if(key == 'nextPlayer') { 
    			return "removedForStringify";
  			} 
  			if(key == 'previousPlayer') { 
    			return "removedForStringify";
  			} 
  			if(key == 'actionOnTimer') { 
    			return "removedForStringify";
  			} 
  			else {
    			return value;
  			};
		});

		publicSeatList = JSON.parse(publicSeatList);

		for(var i=0; i<gameTable.game_size;i++){
			if(publicSeatList.seats[i] != 'empty') {
					publicSeatList.seats[i].card1 = "private";
					publicSeatList.seats[i].card2 = "private";

			}
		}
		return JSON.stringify(publicSeatList);
	}

	
	getPlayerByCookie(cookie) {
		for(var i=0;i<gameTable.game_size;i++) {
			if(gameTable.seats[i].cookie===cookie)
				return gameTable.seats[i];
		}
		return false;
	}

}


exports.game=game;
//exports.addPlayer=addPlayer;