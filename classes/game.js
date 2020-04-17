var deck = require('./deck.js').deck;
var pot = require('./pot.js').pot;
var pokerCalc = require('poker-calc');
var Hand = require('pokersolver').Hand;
var server = require('../server.js');
var saveGameController = require ('../SavedGameController.js')
var player = require ('./player.js').player;

class game {
	constructor (isTest, rebuild, passedSmallBlind,passedBigBlind,seventwogame) {
		this.gameTable = {
			isTest:false,
			gameid:null,
			game_size:9,
			seats:[],
			numPlayersInHand:0,
			gameRunning:false,
			handCount:0,
			clockCalled: false,
			handLogSentIndex:0,
			seven_two_game:true,
			isSettled: 'no',
			handLog: [],
			board:[null,null,null,null,null],
			dealer:null,
			isTimerGame:false,
			winner:{
				players:[],
				hand:null,
				winningPot:0},
			currentPot:null,
			smallBlind:parseInt(20),  //add to constructor
			bigBlind:parseInt(40),
			bettingRound: {
				lastRaiser:null,
				potsTotal:parseInt(0),
				pots:[],
				actionOn:null,
				actionOnTimer:null,
				actionOnTimeLimit:10,
				nextActionsAvailable:[],
				round:0,
				totalOnLine:parseInt(0),
				currentRaiseToCall:parseInt(0),
				endByFold:false,
				lastBet:null,
				bigBlindHash:null
				}
		};

		if(passedBigBlind!=null && passedSmallBlind!=null){
		
			this.gameTable.smallBlind = parseInt(passedSmallBlind);
			this.gameTable.bigBlind = parseInt(passedBigBlind);
		}
		if(seventwogame) {
			this.gameTable.seven_two_game=true;
			console.log('Bluff Master Bonus Activated!');
		}

		for (var i=0;i<this.gameTable.game_size;i++)
			this.gameTable.seats[i] = "empty";
		this.cardsToReveal = [];
		for (var i=0;i<this.gameTable.game_size;i++)
			this.cardsToReveal.push({card1:'private',card2:'private'});
		this.deck = [];
		this.deck = new deck();
		this.gameTable.gameid = this.makeid(16);
		this.gameTable.bettingRound.pots[0] =  new pot(0);
		this.gameTable.currentPot=this.gameTable.bettingRound.pots[0];
		this.newHandLog();
		this.chat = [];
		//mongo id
		this.save_id;
		this.chatSentIndex=0;
		if(isTest=='test')
			this.gameTable.isTest=true;
		this.saveThisGame();



		if(rebuild!=null){
			
			this.gameTable.game_size = rebuild.game_data.game_size;
			this.gameTable.gameid = rebuild.game_data.gameid;
			//rebuild the players & add to seat
			for(var i=0;i<this.gameTable.game_size;i++) {
				if(rebuild.seats[i]!='empty') {
					//convet next player hashes to player objs
					let rebuiltPlayer = new player(rebuild.seats[i].hash,
												rebuild.seats[i].balance,
												rebuild.seats[i].status,
												'no_sid',
												'');
					//rebuiltPlayer.setUserName(rebuiltPlayer.hash);
					rebuiltPlayer.moneyOnLine=parseInt(rebuild.seats[i].moneyOnLine);
					rebuiltPlayer.card1=rebuild.seats[i].card1;
					rebuiltPlayer.card2=rebuild.seats[i].card2;
					rebuiltPlayer.sitoutnexthand=rebuild.seats[i].sitoutnexthand;
					rebuiltPlayer.leavenexthand=rebuild.seats[i].leavenexthand;
					rebuiltPlayer.nextPlayer = rebuild.seats[i].nextPlayer;
					this.addPlayer(rebuiltPlayer, i	);

				}
				else	
					this.gameTable.seats[i]='empty';
			}

			if(rebuild.game_data.dealer!=null)
				this.gameTable.dealer = this.getPlayerByHash(rebuild.game_data.dealer.hash)

			//restore next players
			for(var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i].status=='inhand') {
					this.gameTable.seats[i].nextPlayer=this.getPlayerByHash(this.gameTable.seats[i].nextPlayer);	
					console.log(this.gameTable.seats[i].hash +"goes to"+this.gameTable.seats[i].nextPlayer);
				}
			}

			//rebuild the pots
			for(var i=0;i<rebuild.round_information.pots.length;i++) {
				let potData = {total:rebuild.round_information.pots[i].total,
					members:rebuild.round_information.pots[i].members,
					winners:rebuild.round_information.pots[i].winners,
					numMembers:rebuild.round_information.pots[i].numMembers}
				let rebuiltPot = new pot(null,potData);
				this.gameTable.bettingRound.pots.push(rebuiltPot);
			}
			this.gameTable.currentPot=this.gameTable.bettingRound.pots[this.gameTable.bettingRound.pots.length-1];

			//set game data
			this.gameTable.seven_two_game=rebuild.game_data.seven_two_game;
			this.gameTable.board= rebuild.game_data.board;
			this.gameTable.deck = rebuild.game_data.deck;
			this.gameTable.game_size = rebuild.game_data.game_size;
			this.gameTable.hand_count= rebuild.game_data.hand_count;
			this.gameTable.isTimerGamer=rebuild.game_data.isTimerGamer;
			this.gameTable.smallBlind=rebuild.game_data.smallBlind;
			this.gameTable.bigBlind=rebuild.game_data.bigBlind;
			this.gameTable.bettingRound.nextActionsAvailable=rebuild.round_information.nextActionsAvailable;
			this.gameTable.bettingRound.lastRaiser=rebuild.round_information.lastRaiser;
			this.gameTable.bettingRound.potsTotal=rebuild.round_information.potsTotal;
			if(rebuild.round_information.actionOn != null)
				this.gameTable.bettingRound.actionOn=this.getPlayerByHash(rebuild.round_information.actionOn.hash)
			this.gameTable.bettingRound.round=rebuild.round_information.round;
			this.gameTable.bettingRound.currentRaiseToCall=rebuild.round_information.currentRaiseToCall;
			this.gameTable.bettingRound.lastBet=rebuild.round_information.lastBet;
			this.gameTable.bettingRound.bigBlindHash=rebuild.round_information.bigBlindHash;
			this.sendDataToAllPlayers();

			//check to see if game is stuck on settled
			if(this.gameTable.isSettled=='yes' || this.gameTable.bettingRound.actionOn==null)
				this.nextHand();
		}
	}

	getHandCount() {
		return this.gameTable.handCount;
	}

	startGame() {
		var playersReady=0;
		for (var i=0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i].status=='playing' && this.gameTable.seats[i].hasEnough(this.gameTable.bigBlind))
				playersReady++;
		}

		if(this.getNumberPlayersPlaying()>1 && playersReady>1) {
			console.log("This is the first hand!");
			var lowestSeat = this.getLowestOccupiedSeat();

			//setDealer expect gettng the CURRENT DEALER so it can move it to the next person
			//if we pass seat 0 then the next seat will be dealer. so we will send seat-1 so next seat is 0 or highter
			this.setDealer(lowestSeat-1);
			this.runGame();
			this.gameTable.gameRunning=true;
		}
		else {
			console.log('not enough players');
			this.gameTable.gameRunning=false;
		}
	}

	runGame() {
		this.gameTable.handCount++;
		if(this.gameTable.handCount>1) {
			console.log("This is hand #"+this.gameTable.handCount+".");
			//pass the current dealer so setdealer can find nextdealer
			this.setDealer(this.gameTable.dealer);
		}
		
		this.postBlinds();
		this.dealHands();
		this.printSeats();
		this.getNextAction();
		if(this.gameTable.isTest==false)
			this.sendDataToAllPlayers();
		
	}

	nextHand() {
		this.goToNextHand();
		if(this.gameTable.isTest==false)
			this.sendDataToAllPlayers();

		if(this.canIDeal())
			this.runGame();
		else {
			console.log("Not enough players with enough money at the table.");
			this.updateHandLog("Not enough players with enough money at the table.");
			this.gameTable.gameRunning=false; 
		}
	}

	sendSeatList(sessionid) {
		server.io.to(sessionid).emit('publicSeatList',this.getPublicSeatList());
	}

	updateHandLog(event) {

		this.gameTable.handLog.push(event);
	}

	sendDataToAllPlayers() {
		//console.log('send data');
		this.gameTable.numPlayersInHand=this.getNumberPlayersInHand();
		var sendList = this.getAllPlayerSessionIDs();
		var sessionidToSend;
		var handlogThisSession = (this.getHandLog().length) - this.gameTable.handLogSentIndex;
		var chatSendThisSession = (this.chat.length - this.chatSentIndex);
		for (var i=0; i<sendList.length;i++)
		{
				sessionidToSend=sendList[i].sessionid;
				if(sendList[i]!=null) {
					server.io.to(sessionidToSend).emit('update',this.generatePrivatePlayerData(sendList[i].hash));
	
								for(var b = 0; b <= handlogThisSession;b++) {
									server.io.to(sessionidToSend).emit('logEvent',{gameid:this.gameTable.gameid,event:this.getHandLog()[this.gameTable.handLogSentIndex+b] });
								}
								for(var c = 0; c <= chatSendThisSession;c++) {
									server.io.to(sessionidToSend).emit('incomingChat',{gameid:this.gameTable.gameid,message:this.chat[this.chatSentIndex+c] });
								}
					}
		}
		this.gameTable.handLogSentIndex+=handlogThisSession;
		this.chatSentIndex+=chatSendThisSession;
	}

	reconnect(hash,newSessionId) {
		console.log("TRYING TO RECONNECT: "+hash);
		if (this.getPlayerByHash(hash) != false) {
	
			this.getPlayerByHash(hash).updateSessionId(newSessionId);
			//server.io.to(newSessionId).emit('yourHash',game1.getPlayerByCookie(cookie).hash);
			if(this.gameTable.isTest==false)
				this.sendDataToAllPlayers();
			//console.log (this.getPlayerByHash(hash).userid+" RECONNECTED");
		}
		else 
			console.log('couldnt reconnect player: didnt find clientID');
	
	}

	getGameId() {
		return this.gameTable.gameid;
	}

	newHandLog(){
		var newHandLog = [];
		newHandLog.push(this.makeid(24));
		newHandLog.push(Date.now());
		this.gameTable.handLog=newHandLog;
	}
	getHandLog() {

		return this.gameTable.handLog;
	}


	canIDeal () {
		
		var playersReady=0;
		for (var i=0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i].status=='playing' && this.gameTable.seats[i].hasEnough(this.gameTable.bigBlind))
				playersReady++;
		}

		if (this.getNumberPlayersPlaying()>1 && playersReady>1)
			return true;
		else
			return false;
	}

	isSettled() {
		if(this.gameTable.isSettled=='yes')
			return true;
		return false;

	}


	goToNextHand () {
			this.deck = new deck();
			this.gameTable.winner.players=null;
			this.gameTable.winner.hand=null;
			this.gameTable.winner.winningPot=null;
			this.gameTable.board=[null,null,null,null,null];
			this.gameTable.currentPot=0;
			this.gameTable.bettingRound.lastRaiser=null;
			this.gameTable.bettingRound.nextActionsAvailable=[];
			this.gameTable.bettingRound.round=0;
			this.gameTable.bettingRound.totalOnLine=0;
			this.gameTable.bettingRound.currentRaiseToCall=0;
			this.gameTable.bettingRound.currentRaiseToCall=null;
			this.gameTable.isSettled='no';
			this.gameTable.bettingRound.endByFold=false;
			this.gameTable.bettingRound.bigBlindHash=null;
			this.newHandLog();
			//new pots
			this.gameTable.bettingRound.potsTotal=0;
			this.gameTable.bettingRound.pots=[];
			this.gameTable.bettingRound.pots[0] = new pot(0);
			this.gameTable.currentPot=this.gameTable.bettingRound.pots[0];

	
			//clear cards
			for(var i=0;i<this.gameTable.game_size;i++)
			{
				if(this.gameTable.seats[i].status=='inhand'||this.gameTable.seats[i].status=='folded'||this.gameTable.seats[i].status=='allin'){
					this.gameTable.seats[i].card1=null;
					this.gameTable.seats[i].card2=null;
					}
						
			}

			//set all hands to private
			for (var i=0;i<this.gameTable.game_size;i++){
				this.cardsToReveal[i].card1='private';
				this.cardsToReveal[i].card2='private';
			}

			//remove those who were set to leave
			for (var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i].leavenexthand==true) {
					var deletedSID = this.gameTable.seats[i].sessionid;
					console.log(this.gameTable.seats[i].userid+" has left the table.");
					this.updateHandLog(this.gameTable.seats[i].userid+" has left the table.");
					this.deletePlayer(this.gameTable.seats[i]);
					this.sendSeatList(deletedSID);
				}
			}
			//set sitting out
			for (var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i].sitoutnexthand==true) {
					this.gameTable.seats[i].status='sittingout';
					console.log(this.gameTable.seats[i].userid+" is now sitting out per their request.");
					this.updateHandLog(this.gameTable.seats[i].userid+" is now sitting out per their request.");
				}

			}

			//set sitting out for people who have 0 balance
			for (var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i]!='empty')
					if(this.gameTable.seats[i].hasEnough(this.gameTable.bigBlind)==false) {
						this.gameTable.seats[i].status='sittingout';
						this.gameTable.seats[i].sitoutnexthand=true;
						console.log(this.gameTable.seats[i].userid+" is now sitting out because their balance is less than the big blind.");
						this.updateHandLog(this.gameTable.seats[i].userid+"  is now sitting out because their balance is less than the big blind.");
					}

			}

			//set to waiting to play
			for (var i=0;i<this.gameTable.game_size;i++)
			{
				if(this.gameTable.seats[i].sitoutnexthand==false && this.gameTable.seats[i].balance>=this.gameTable.bigBlind){
					this.gameTable.seats[i].status='playing';
				}
			}

			//restore pointers
			for (var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i].status=='playing' ) {
					this.setNextPlayer(this.gameTable.seats[i]);
				}
			}

		
	//if you dont have more than one person

	}

	deletePlayer(player) {
		this.gameTable.seats[player.seat]="empty";
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
				if(this.gameTable.seats[i]!="empty" && this.gameTable.seats[i].status!='allin')
					return this.gameTable.seats[i];
			}
		for(var i=8;i>player.seat;i--)
			{
				if(this.gameTable.seats[i]!="empty" && this.gameTable.seats[i].status!='allin')
					return this.gameTable.seats[i];
			}
	}

	getNextPlayer(player) {
		for (var i=Number(player.seat)+1;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i]!="empty" && this.gameTable.seats[i].status!='sittingout') {
				return this.gameTable.seats[i];
			}
		}
		for (var i=0;i<player.seat;i++){
			if(this.gameTable.seats[i]!="empty" && this.gameTable.seats[i].status!='sittingout') {
				return this.gameTable.seats[i];
			}
		}
	}


	setNextPlayer (player) {
		player.nextPlayer = this.getNextPlayer(player);

	}

	getPlayerByHash(myhash) {
		for (var i=0;i<this.gameTable.game_size;i++){
			if((this.gameTable.seats[i].hash)==(myhash)) {
				return this.gameTable.seats[i];
			}
		}
		
		//console.log("No user by that hash to return.");
		return false;
	}

	doesPlayerExistByHash(myhash) {
		for (var i=0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i].hash==myhash && myhash!=null) {
				return true;
			}
		}
		console.log("No user exists in this game with that hash.");
		return false;
	}

	getLastEvent() {
		return this.gameTable.lastEvent;
	}

	getLastBet() {
		return this.gameTable.bettingRound.lastBet;
	}



	setLastEvent(str) {
		this.gameTable.lastEvent=str;
	}

	addPlayer(player,seat) {
		if(this.gameTable.seats[seat]!="empty") {
			console.log("Seat full");
		}

		else {
			if(this.gameTable.seats[seat]=="empty") {
				this.gameTable.seats[seat] = player;
				player.setSeat(seat);
				console.log(player.userid+" joined game! at seat "+player.seat+"!");
				this.updateHandLog((this,player.userid+" joined game at seat "+player.seat+"!"));
			}
			//need to ensure first guy gets his pointer set
			if(this.getNumberPlayersPlaying()==2) {
				this.setNextPlayer(player);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;

				//set the other guy to tyou
				for (var i=0;i<this.gameTable.game_size;i++)
					if(this.gameTable.seats[i]!="empty" && i!=seat){
						this.gameTable.seats[i].nextPlayer = player;
						this.gameTable.seats[i].previousPlayer = player;
					}
			}
			if(this.getNumberPlayersPlaying()>2) {
				this.setNextPlayer(this.gameTable.seats[seat]);

				//find person before them and set it to the new guy
				this.getPreviousPlayer(player).nextPlayer=player;
			}
		}
		if(this.gameTable.isTest==false)
			this.sendDataToAllPlayers();
	}

	foldPlayer (player) {
		player.status="folded";
		this.getPreviousPlayer(player).nextPlayer=this.getNextPlayer(player);
		//player.nextPlayer = "folded";

	}

	printSeats () {
		for(var i=0;i<this.gameTable.game_size;i++) {

			if(this.gameTable.seats[i]!="empty"){
				console.log("Seat "+i+": "+this.gameTable.seats[i].userid+
					" Balance:"+this.gameTable.seats[i].balance+
					" Status: "+this.gameTable.seats[i].status+
				//	" Next up :"+this.gameTable.seats[i].nextPlayer.userid+
					" Hand: "+ this.gameTable.seats[i].card1+" "+this.gameTable.seats[i].card2+
					" $ in: "+ this.gameTable.seats[i].moneyOnLine +
					" Hash: "+this.gameTable.seats[i].hash +
					" SID: "+this.gameTable.seats[i].sessionid 
					);
			}
			else
				console.log("Seat "+i+": Empty");
		}
		
		console.log("Raise to call:"+this.gameTable.bettingRound.currentRaiseToCall);
		//print board
		console.log("Board: "+this.gameTable.board);

			
		
	}

	getNumberPlayersPlaying () {
		let counter=0;
		for (var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=="playing")
				counter++;
		}
		return counter;

	}

	getNumberPlayersInHand () {
		var counter=0;
		for (var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=="inhand") {
				console.log('hello')
				counter++;
			}
		}
		return counter;

	}

	getNumberPlayersAllIn () {
		let counter=0;
		for (var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=="allin")
				counter++;
		}
		return counter;
	}

	//pass me who was the dealer last game
	setDealer(player) {
		//find the next seat who is playing
		for(var i=player.seat+1;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=='playing') {
				console.log('The dealer is now '+this.gameTable.seats[i].userid+".");
				this.updateHandLog("The dealer is now "+this.gameTable.seats[i].userid+".");
				this.gameTable.dealer=this.gameTable.seats[i];
				return this.gameTable.seats[i];
			}
		}
		//if we didnt find it that go around start again
		for(var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=='playing') {
				console.log('The dealer is now '+this.gameTable.seats[i]+".");
				this.updateHandLog("The dealer is now "+this.gameTable.seats[i].userid+".");
				this.gameTable.dealer=this.gameTable.seats[i];
				return this.gameTable.seats[i];
			}
		}

		return false;
	}

	dealHands() {

		for (var i=0;i<this.gameTable.game_size;i++)
		{
			if(this.gameTable.seats[i].status=='playing'|| this.gameTable.seats[i].status=='folded')
				this.gameTable.seats[i].status='inhand';
		}

		//deal card 1
		var cardGetter = this.gameTable.seats[this.gameTable.dealer.seat].nextPlayer;
			while (cardGetter.card1==null && cardGetter.status=='inhand')
			{
				console.log("Dealing to seat "+cardGetter.seat+".");
				this.updateHandLog("Dealing to seat "+cardGetter.seat+".");
				cardGetter.card1=this.deck.dealCard();
				cardGetter = this.gameTable.seats[cardGetter.seat].nextPlayer;
			}
			//deal card 2
			while (cardGetter.card2==null && cardGetter.status=='inhand')
			{
				cardGetter.card2=this.deck.dealCard();
				cardGetter = this.gameTable.seats[cardGetter.seat].nextPlayer;
			}

	}
	getUnderTheGunPlayer () {
		var smallBlindPayer = this.gameTable.seats[this.gameTable.dealer.seat].nextPlayer;
		var bigBlindPayer = this.gameTable.seats[smallBlindPayer.seat].nextPlayer;
		var theGun = this.gameTable.seats[bigBlindPayer.seat].nextPlayer
		return theGun;
	}

	dealFlop() {
		var burnCard = this.deck.dealCard();
		this.gameTable.board[0] = this.deck.dealCard();
		this.gameTable.board[1] = this.deck.dealCard();
		this.gameTable.board[2] = this.deck.dealCard();

		

	}
	dealTurn() {
		var burnCard = this.deck.dealCard();
		this.gameTable.board[3]=this.deck.dealCard();
	}
	dealRiver() {
		var burnCard = this.deck.dealCard();
		this.gameTable.board[4] = this.deck.dealCard();
	}

	printBoard() {
		console.log(this.gameTable.board);
	}

	getBigBlindPlayer() {
		var bigBlindPayer = this.gameTable.seats[this.getSmallBlindPlayer().seat].nextPlayer;
		return bigBlindPayer;
	}

	addPlayerChips (hash,amt) {
		var playerToAdd = this.getPlayerByHash(hash);
		playerToAdd.givePot(parseInt(amt));
		console.log(playerToAdd.userid+" has added $"+(amt/100).toFixed(2)+" in chips.");
		this.updateHandLog(playerToAdd.userid+" has added $"+(amt/100).toFixed(2)+" in chips. Good luck!");
		this.sendDataToAllPlayers();
		this.checkToRestartGame();


	}

	getSmallBlindPlayer () {
		var smallBlindPayer = this.gameTable.seats[this.gameTable.dealer.seat].nextPlayer;
		return smallBlindPayer;
	}

	postBlinds() {
		var smallBlindPayer = this.getSmallBlindPlayer();
		var bigBlindPayer = this.getBigBlindPlayer();
		
		//store bigblind seat for front end to help with off action bar
		this.gameTable.bettingRound.bigBlindHash=bigBlindPayer.hash;

		//withdraw and add to line
		this.gameTable.seats[smallBlindPayer.seat].addMoneyToLine(this.gameTable.smallBlind);
		this.gameTable.bettingRound.totalOnLine+=this.gameTable.smallBlind;

		this.gameTable.seats[bigBlindPayer.seat].addMoneyToLine(this.gameTable.bigBlind);
		this.gameTable.bettingRound.totalOnLine+=this.gameTable.bigBlind;


		//set the person under the gun to be next
		this.setActionOn(this.getUnderTheGunPlayer());
		if(this.gameTable.isTimerGame==true)
			this.actionOnTimer();
		this.gameTable.bettingRound.lastBet='blinds';
		this.gameTable.bettingRound.round=0;
		this.gameTable.bettingRound.currentRaiseToCall = this.gameTable.bigBlind;


	}

	setActionOn(player) {
		this.gameTable.bettingRound.actionOn=player;
	}

	getActionOnPlayer() {
		return this.gameTable.bettingRound.actionOn;
	}

	getLowestOccupiedSeat() {
		for (var i=0;i<this.gameTable.game_size;i++){
			if (this.gameTable.seats[i]!="empty")
				return this.gameTable.seats[i];
		}
	}

	clearRoundData() {
		//clear data we dont need for next round, keeping round count OBVI
		this.gameTable.bettingRound.lastRaiser=null;
		this.gameTable.bettingRound.actionOn=null;
		//set this for fuirst to act
		this.gameTable.bettingRound.nextActionsAvailable=['raise','check'];
		this.gameTable.bettingRound.totalOnLine=0;
		this.gameTable.bettingRound.currentRaiseToCall=0;
		this.gameTable.bettingRound.lastBet=null;
	

		for (var i=0;i<this.gameTable.game_size;i++)
			if(this.gameTable.seats[i].status=='inhand'||this.gameTable.seats[i].status=='folded'||this.gameTable.seats[i].status=='allin')
				this.gameTable.seats[i].clearMoneyOnLine();
	}


	getRound() {
		return this.gameTable.bettingRound.round;
	}



	goToNextRound() {

		if(this.isOnlyOnePlayerNotAllIn()==true) {
			this.sendDataToAllPlayers();
			this.gameTable.bettingRound.round=4;
			this.sendPlayersEndofRound();
			var scope=this;

			setTimeout(
				function() {
					scope.addMoneyLineToPot();
					scope.clearRoundData();
					//set action to small blind
					scope.settleTheHand();
					scope.sendDataToAllPlayers();
				},
				1500);
		}

		if (this.gameTable.bettingRound.round==3) {
			this.sendDataToAllPlayers();
			this.gameTable.bettingRound.round++;
			this.sendPlayersEndofRound();
			var scope=this;

			setTimeout(
				function() {
					scope.addMoneyLineToPot();
					scope.clearRoundData();
					//set action to small blind
					scope.settleTheHand();
					scope.sendDataToAllPlayers();
				},
				1500);

		}
		if (this.gameTable.bettingRound.round==2) {
			this.sendDataToAllPlayers();
			this.gameTable.bettingRound.round++;
			this.sendPlayersEndofRound();
			var scope=this;


			setTimeout(
				function() {
					scope.addMoneyLineToPot();
					scope.dealRiver();
					scope.clearRoundData();
					//set action to small blind
					scope.setActionOn(scope.whoShouldStartRound());
					scope.sendDataToAllPlayers();
				},
				1500);


		}
		if (this.gameTable.bettingRound.round==1) {
			this.sendDataToAllPlayers();
			this.gameTable.bettingRound.round++;
			this.sendPlayersEndofRound();
			var scope=this;


			setTimeout(
				function() {
					scope.addMoneyLineToPot();
					scope.dealTurn();
					scope.clearRoundData();
					//set action to small blind
					scope.setActionOn(scope.whoShouldStartRound());
					scope.sendDataToAllPlayers();
				},
				1500);

		}
		if (this.gameTable.bettingRound.round==0) {
			this.sendDataToAllPlayers();
			this.gameTable.bettingRound.round++;
			this.sendPlayersEndofRound();
			var scope=this;
			
			setTimeout(
				function() {
					scope.addMoneyLineToPot();
					scope.dealFlop();
					scope.clearRoundData();
					//set action to small blind
					scope.setActionOn(scope.whoShouldStartRound());
					scope.sendDataToAllPlayers();
				},
				1500);
	
		}
		
		
	}

	sendPlayersEndofRound() {
		var sendlist = this.getAllPlayerSessionIDs();
		var data = {gameid:this.gameTable.gameid};
		for(var i=0; i<=sendlist.length-1;i++) {
			server.io.to(sendlist[i].sessionid).emit('endOfRound', data);
		}
	}

	sendSevenTwoAlert() {
		var sendlist = this.getAllPlayerSessionIDs();
		var data = {gameid:this.gameTable.gameid};
		for(var i=0; i<=sendlist.length-1;i++) {
			server.io.to(sendlist[i].sessionid).emit('sevenTwoWinner', data);
		}
	}

	whoShouldStartRound() {

		for (var i=this.gameTable.dealer.seat+1;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i].status=='inhand')
				return this.gameTable.seats[i];
		}
		for (var i=0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i].status=='inhand')
				return this.gameTable.seats[i];
		}
	}


	isSameAmountOnEveryonesMoneyLine() {
		var last = 0;
		for(var i = 0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i]!='empty'){
				last = Number(this.gameTable.seats[i].moneyOnLine);
			}
		}

		//make sure everyone matches last
		for(var i = 0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i]!='empty')
				if(Number(this.gameTable.seats[i].moneyOnLine)!=last){
					return false;
			}
		}
		return true;
	}

	leaveTableNextHand (hash) {
		var playerToLeave = this.getPlayerByHash(hash);

		//make sure i pass dealer to the next player if i am dealer
		if(this.gameTable.dealer!=null){
			if(this.gameTable.dealer.hash==playerToLeave.hash)
				this.gameTable.dealer = playerToLeave.nextPlayer;
		}



		//leave
	
		if(playerToLeave.status=='sittingout' || playerToLeave.status=='folded' || playerToLeave.status=='playing') {
			var deletedSID = playerToLeave.sessionid;
			this.deletePlayer(playerToLeave);
			this.sendSeatList(deletedSID);
			this.sendDataToAllPlayers();
		}
		else
			playerToLeave.leavenexthand = true;		

		
	}

	checkToRestartGame () {
		if(this.gameTable.gameRunning==false) {
			var playersReady=0;
			for (var i=0;i<this.gameTable.game_size;i++){
				if(this.gameTable.seats[i].status=='playing' && this.gameTable.seats[i].hasEnough(this.gameTable.bigBlind))
					playersReady++;
			}
			if(this.getNumberPlayersPlaying()>1 && playersReady>1) {
				console.log("We have enough players, starting up!")
				this.updateHandLog("We have enough players, starting up!");
				if(this.gameTable.handCount==0)
					this.startGame();
				else
					this.nextHand();
			this.gameTable.gameRunning=true;
			}
		}
	}

	sitPlayerBackDown(hash) {
		var playerToSit = this.getPlayerByHash(hash);
		var sittingSID = playerToSit.sessionid;

		if(playerToSit.status=='sittingout' && playerToSit.hasEnough(this.gameTable.bigBlind)==true) {
			playerToSit.sitBackDown();
			playerToSit.toggleSitOut(); //set this back to true!
			this.sendSeatList(sittingSID);
			console.log(playerToSit.userid+" has sat back down!");
			this.updateHandLog(playerToSit.userid+" has sat back down!");
			this.sendDataToAllPlayers();
			this.checkToRestartGame();
			
		}
		else
			console.log('Not enough money!');

	}

	areMoneyLinesZero() {
	

		for(var i = 0;i<this.gameTable.game_size;i++){
			if(this.gameTable.seats[i]!='empty'){
				if(Number(this.gameTable.seats[i].moneyOnLine)>0)
					return false;
			}
		}

		return true;
	}

	isPlayerMemberofCurrentPot (player) {
		for (var i=0; i<this.gameTable.currentPot.members.length;i++)
			if(this.gameTable.currentPot.isMemberByHash(player.hash)==true)
				return true;
		return false;

	}

	deductMoneyLineAndAddToPot (amt){
		//deduct that amount from everyone if they are not folded, and if they still have $ on line, and add them as a member
		for(var i = 0;i<this.gameTable.game_size;i++){
				if((this.gameTable.seats[i].status=='inhand' || this.gameTable.seats[i].status=='allin') && this.gameTable.seats[i].moneyOnLine>0){
						this.gameTable.seats[i].moneyOnLine-=parseInt(amt);
						this.gameTable.currentPot.total+=parseInt(amt);
						this.gameTable.bettingRound.potsTotal+=parseInt(amt);
						//if not already a member of this pot add them if they didnt fold
						if(this.isPlayerMemberofCurrentPot(this.gameTable.seats[i])==false && this.gameTable.seats[i].status!='folded'){
							this.gameTable.currentPot.addMember(this.gameTable.seats[i]);
						}
				} 
				//since a folded player could have money on line before they folded, we just sweep it into the pot
				if(this.gameTable.seats[i].status=='folded'){
					this.gameTable.currentPot.total+=this.gameTable.seats[i].moneyOnLine;
					this.gameTable.bettingRound.potsTotal+=this.gameTable.seats[i].moneyOnLine;
					this.gameTable.seats[i].moneyOnLine=0;
				}

			}

			//remove all folders as pot member from all pots as they may have jonined in previous rounds
			for(var i=0;i<this.gameTable.bettingRound.pots.length;i++)
				for(var a=0;a<this.gameTable.bettingRound.pots[i].members.length;a++)
					if(this.gameTable.bettingRound.pots[i].members[a]!=null)
						if (this.gameTable.bettingRound.pots[i].members[a].status=='folded') {
							a = this.gameTable.bettingRound.pots[i].removeMember(this.gameTable.bettingRound.pots[i].members[a])-1;
				}
	}

	printGamePots() {
		for(var i=0;i<this.gameTable.bettingRound.pots.length;i++)
			console.log(this.gameTable.bettingRound.pots[i].printPot());
	}

	addMoneyLineToPot(){

		//if everyone folded and no one is all in then just jam the lines in and pay it out
		var NumberofAllInPlayers=0;
		for (var i=0;i<this.gameTable.game_size;i++)
			if(this.gameTable.seats[i].status=='allin')
				NumberofAllInPlayers++;
		if(NumberofAllInPlayers==0 && this.gameTable.bettingRound.endByFold==true) {
			for (var i=0;i<this.gameTable.game_size;i++) {
					if(this.gameTable.seats[i].status == 'inhand' || this.gameTable.seats[i].status == 'folded') {
						this.gameTable.currentPot.total+=this.gameTable.seats[i].moneyOnLine;
						this.gameTable.bettingRound.potsTotal+=this.gameTable.seats[i].moneyOnLine;
						this.gameTable.seats[i].moneyOnLine-=this.gameTable.seats[i].moneyOnLine;
						//this.gameTable.seats[i].moneyOnLine=0;
					}
				}
		}

		//Cover other cases when not everyone folded
		else {

			//find lowest money on line, if its the same for everyone it will be the common denom to start with
			var lowest = 999999999;
				for(var i = 0;i<this.gameTable.game_size;i++){
					if((this.gameTable.seats[i].status=='inhand' || this.gameTable.seats[i].status=='allin') && this.gameTable.seats[i].moneyOnLine>0){
						if(this.gameTable.seats[i].moneyOnLine<lowest) {
							lowest=this.gameTable.seats[i].moneyOnLine;
						}
					}
				}
			//shave off the common denom
			this.deductMoneyLineAndAddToPot(lowest);
			//reset counter so we cna find lowest again
			lowest=9999999;
			//now we check to see if there is more money to put into the pot
			if(this.areMoneyLinesZero() == true) {

				//check to see if members of current pot are all in. if so we need a new one, cuz if i called the 
				//last bet to end the round and it put me all in then we have to make a new pot for next round
				for(var i=0;i<this.gameTable.currentPot.members.length;i++) {
					if(this.gameTable.currentPot.members[i].status=='allin') {
						let newPot = new pot(0);
						this.gameTable.bettingRound.pots.push(newPot);
						this.gameTable.currentPot=newPot;
					}

				}
				this.gameTable.bettingRound.totalOnLine=0;
				//were done!
				return false;

				//what is failed to do is make a new pot after settlining someone all in perfectly in to the last one
			}
			else {
				//we are not done! so create a new pot and do it again
				let newPot = new pot(0);
				this.gameTable.bettingRound.pots.push(newPot);
				this.gameTable.currentPot=newPot;
				this.addMoneyLineToPot();
			}
		}
	}

	settleTheHand() {
		console.log("Hand over. Settling up.");
		var delay=0;
		this.updateHandLog("Hand over. Settling up.");
		//stop the timer
		clearTimeout(this.gameTable.bettingRound.actionOnTimer);

		//remove actionon player so we can clear buttons
		this.gameTable.bettingRound.actionOn=null;
		this.sendDataToAllPlayers();

		//check to see if we have any in players 
		var NumberofAllInPlayers=0;
		for (var i=0;i<this.gameTable.game_size;i++)
			if(this.gameTable.seats[i].status=='allin')
				NumberofAllInPlayers++;

		//if we have all ins and the game was folded dead or ended before river, we need to put more cards out
		//but we are also going to show the cards of the user


		console.log('Number all in players:'+NumberofAllInPlayers);
		if (NumberofAllInPlayers>0 && (this.gameTable.bettingRound.endByFold==true || this.isOnlyOnePlayerNotAllIn()==true)) {
			console.log("Doing a card run out.");

			//reveal player cards cards
			for(var i=0;i<this.gameTable.game_size;i++) {
				if(this.gameTable.seats[i].status=='inhand' || this.gameTable.seats[i].status=='allin') {
					this.revealCards(this.gameTable.seats[i],true,true);
					this.sendDataToAllPlayers();
				}
			}

			//slowly run out cards	
			for(var i=0;i<this.gameTable.board.length;i++){
				if(this.gameTable.board[i]==null) {
					this.gameTable.board[i]=this.deck.dealCard();
					delay+=1500;
					}
				}
				this.sendDataToAllPlayers();
		

			}
		
		// lets add the board to the check package cuz its same for all
		console.log(this.gameTable.board);
		var packageCards = {
			boardCards:this.gameTable.board,
			playerCards:[]
			};
		/*here i am going to looks at all the pots and divide them up amongst winning hands of the members
		
		

		*/
		//check to see if someone didnt win by fold
		if(this.gameTable.bettingRound.endByFold==false || NumberofAllInPlayers>0) {

			var selectedPot;
			for(var i=0;i<this.gameTable.bettingRound.pots.length;i++) {
				

					//NEEDS TO PAY THE WINNERS OF EACH POT MEMBERS
					//1 package the hands of the members to check them
					var playerCardHolder;
					selectedPot = this.gameTable.bettingRound.pots[i];
					selectedPot.printPot();

					for(var a=0;a<selectedPot.members.length;a++) {

						if(selectedPot.members[a].status=='inhand' || selectedPot.members[a].status=='allin') {
							
							packageCards.playerCards.push(
								{playerId:selectedPot.members[a].hash,
								cards:[selectedPot.members[a].card1,
										selectedPot.members[a].card2]});

						}
					}
					//2 send the package to get winner
					var winner = pokerCalc.getHoldemWinner(packageCards,{ compactCards: true});
					//console.log("API RESPONSE:  "+JSON.stringify(winner) + 'PACKAGE WAS'+JSON.stringify(packageCards));
					//3 PAY WINNERS
					for (var b=0;b<winner.length;b++) {
						var amtToPay = selectedPot.total/winner.length;
						var winningPlayer = this.getPlayerByHash(winner[b].playerId);
						var winningHand = Hand.solve([winningPlayer.card1,winningPlayer.card2,this.gameTable.board[0],this.gameTable.board[1],this.gameTable.board[2],this.gameTable.board[3],this.gameTable.board[4]]).descr;



						winningPlayer.givePot(amtToPay);
							//ANNOUNCE IT
						console.log(this.getPlayerByHash(winner[b].playerId).userid+" WINS with ["
							+winningPlayer.card1
							+","
							+winningPlayer.card2
							+'] '+winningHand+"! "
							+ "The pot total was $"+(selectedPot.total/100).toFixed()
							+" and it paid "+ this.getPlayerByHash(winner[b].playerId).userid +" $"
							+(amtToPay/100).toFixed(2)+".");
						this.updateHandLog(this.getPlayerByHash(winner[b].playerId).userid+" WINS with ["
						+winningPlayer.card1
						+","
						+winningPlayer.card2
						+'] '+winningHand+"! "
						+ "The pot total was $"+(selectedPot.total/100).toFixed(2)
						+" and it paid "+ this.getPlayerByHash(winner[b].playerId).userid +" $"
						+(amtToPay/100).toFixed(2)+".");
					//4 store winner of each pot with beautified hand
						
						selectedPot.winners.push({winner:winningPlayer,
											winningHand:winningHand,
											winningCards:[winningPlayer.card1,winningPlayer.card2]});
					}


				
				//reset card package
				packageCards = {
					boardCards:this.gameTable.board,
					playerCards:[]
				};
				}
				
			}
			//everyone folded and no one was all in
			else if (this.gameTable.bettingRound.endByFold==true && NumberofAllInPlayers==0) {
				/*clear the line and shove it into the pot without making new pots
				for (var i=0;i<this.gameTable.game_size;i++) {
					if(this.gameTable.seats[i].status == 'inhand' || this.gameTable.seats[i].status == 'folded') {
						this.gameTable.currentPot.total+=this.gameTable.seats[i].moneyOnLine;
						this.gameTable.seats[i].moneyOnLine-=this.gameTable.seats[i].moneyOnLine;
						//this.gameTable.seats[i].moneyOnLine=0;
					}
				}*/



				this.addMoneyLineToPot();
				var amtToPay=0;
				//find winner
				var numAllIn=0;
				var lastManStanding;
				this.clearRoundData();
				for (var i=0;i<this.gameTable.seats.length;i++){
					if(this.gameTable.seats[i].status=='inhand') {
						lastManStanding=this.gameTable.seats[i];
						console.log('LMS is '+lastManStanding.seat);
					}
					
				}
				//set all pots winner to last man standing and add amount to pay
				for(var i=0;i<this.gameTable.bettingRound.pots.length;i++) {
					//set winner
					this.gameTable.bettingRound.pots[i].winners.push({winner:lastManStanding,
											winningHand:"everyone folding."});
					
					//total winning
					amtToPay=+this.gameTable.bettingRound.pots[i].total;
					
					console.log("Everyone folded so "+this.gameTable.bettingRound.pots[i].winners[0].winner.userid+" wins $"+(amtToPay/100).toFixed(2)+".");
					this.updateHandLog("Everyone folded so "+this.gameTable.bettingRound.pots[i].winners[0].winner.userid+" wins $"+(amtToPay/100).toFixed(2)+".");

				}
				//pay the man his money
				console.log('We gave seat '+lastManStanding.seat+ ' $'+(amtToPay/100).toFixed(2));
				lastManStanding.givePot(parseInt(amtToPay));
				
			}
			//7-2 magic, if any winner has 7+2 any suit they get paid a big blind by everyone
			//who is able
			this.clearRoundData();
			this.sendDataToAllPlayers();

			if(this.gameTable.seven_two_game==true) {
				var payers=0;
				var c1;
				var c2;
				var seven_two_winners = [];
				for (var i=0;i<this.gameTable.bettingRound.pots.length;i++) {
					for(var a=0;a<this.gameTable.bettingRound.pots[i].winners.length;a++) {
						c1=(this.gameTable.bettingRound.pots[i].winners[a].winner.card1.slice(0,1));
						c2=(this.gameTable.bettingRound.pots[i].winners[a].winner.card2.slice(0,1));
						if((c1=='7' && c2=='2') || (c1=='2' && c2=='7'))
							seven_two_winners.push(this.gameTable.bettingRound.pots[i].winners[a].winner.hash);
					}
				}

				for (var i=0;i<seven_two_winners.length;i++) {
					delay+=2000;
					for(var a=0;a<this.gameTable.game_size;a++) {
						if(this.gameTable.seats[a].status!='empty' && this.gameTable.seats[a].status!='sittingout' && this.gameTable.seats[a].status!='playing')
							if(this.gameTable.seats[a].hash!=seven_two_winners[i]) {
								if(this.gameTable.seats[a].balance>=this.gameTable.bigBlind) {
									this.gameTable.seats[a].addMoneyToLine(this.gameTable.bigBlind);
									this.gameTable.bettingRound.totalOnLine+=this.gameTable.bigBlind;
									payers++;
								}

						}
					}
					let scope = this;
					setTimeout(
						function() {
				
							scope.sendDataToAllPlayers();
							scope.sendPlayersEndofRound();
							scope.sendSevenTwoAlert();

							
						}
						.bind(scope),
						3500);
						this.getPlayerByHash(seven_two_winners[i]).givePot(payers*this.gameTable.bigBlind)
						console.log(this.getPlayerByHash(seven_two_winners[i]).userid+" won with 7-2, everyone pay up!");
						this.updateHandLog(this.getPlayerByHash(seven_two_winners[i]).userid+" won with 7-2, everyone pay up!");
							payers=0;
					
				}
				console.log('Game is now settled.');
				this.gameTable.isSettled="yes";
				let scope=this;
				this.saveThisGame();
				if(this.gameTable.isTest==false)
					if(this.getNumberPlayersAllIn()>0)
						setTimeout(function(){ 
							scope.clearRoundData();
							scope.nextHand(); }, 8000+delay);
					else
						setTimeout(function(){ 
							scope.clearRoundData();
							scope.nextHand(); }, 8000);




			}


			else {
			console.log('Game is now settled.');
			this.gameTable.isSettled="yes";
			this.sendDataToAllPlayers();
			let scope=this;
			this.saveThisGame();
			if(this.gameTable.isTest==false)
				if(this.getNumberPlayersAllIn()>0)
					setTimeout(function(){ scope.nextHand(); }, 6000+delay);
				else
					setTimeout(function(){ scope.nextHand(); }, 6000);
			}

		}


	

	
	putPlayerAllIn(player){
		if(this.isOnlyOnePlayerNotAllIn()==false ) {
		player.status="allin";
		var myPreviousPlayer = this.getPreviousPlayer(player);
		//console.log(myPreviousPlayer+myPreviousPlayer+myPreviousPlayer+myPreviousPlayer);
		var myNextPlayer = this.getNextPlayer(player);

		myPreviousPlayer.nextPlayer = myNextPlayer;

		console.log("Pointer update: "+myPreviousPlayer.userid + " now goes to "+myNextPlayer.userid+".");
		//player.nextPlayer = "folded";
		return true;
		}
		else {
			console.log(player.userid+" is all in!");
			this.updateHandLog(player.userid+" is all in!");
			this.addMoneyLineToPot();
			this.settleTheHand();
			return false;
		}
	}

	isOnlyOnePlayerNotAllIn() {
		var counter=0;
		for(var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].status=='inhand')
				counter++;
		}

		if(counter==1){
			return true;
		}
		return false;
	}

	callClock() {
			this.actionOnTimer();
			this.gameTable.clockCalled = true;
			this.sendDataToAllPlayers();

	}

	getTimerLength () {
		return this.gameTable.bettingRound.actionOnTimeLimit;
	}

	sitActionOnPlayerOut(player) {
		this.gameTable.bettingRound.actionOn.toggleSitOut();
	}

	isClockCalled() {
		return this.gameTable.clockCalled;
	}

	actionOnTimer() {
		var scope = this;
		this.updateHandLog("The clock has been called.");
		console.log("The clock has been called.");
		clearTimeout(this.gameTable.bettingRound.actionOnTimer);
		//here im gunnan set a timer session id and store it globally, the next person should change the global variable
		this.gameTable.bettingRound.actionOnTimer=setTimeout(

			function (){
				scope.sitActionOnPlayerOut();
				scope.doAction(scope.gameTable.bettingRound.actionOn,'fold-clock');
				scope.gameTable.clockCalled=false;
				if(scope.gameTable.isTest==false)
					scope.sendDataToAllPlayers();

			}
			, (1000*this.gameTable.bettingRound.actionOnTimeLimit)+1500);
	}

	getNextAction () {

		this.printSeats();
		this.printGamePots();

		//BIG BLIND CAN ACT AT END OF PRE-FLOP BETTING
		//IF ACTION IS TO BIGBLIND + AND NO ONE RAISED AKA LAST BET IS CALL AND THE CALL IS SAME AS BIG BLIND
		//THEN BIG BLIND AND 
		//console.log("ROUND "+this.gameTable.bettingRound.round);
		 if(this.getActionOnPlayer().hash == this.getBigBlindPlayer().hash
			&& this.gameTable.bettingRound.currentRaiseToCall == this.gameTable.bigBlind
			&& this.gameTable.bettingRound.lastBet=='call'
			&& this.gameTable.bettingRound.round==0) {
			this.gameTable.bettingRound.nextActionsAvailable = ['raise','check']; 
			if(this.gameTable.isTimerGame==true)
				this.actionOnTimer();
		}

		//else if(this.gameTable.bettingRound.lastBet=='check' && )

		//SEE IF BIG BLIND CHECKED
		else if(this.gameTable.bettingRound.lastBet=='check' && this.gameTable.bettingRound.currentRaiseToCall == this.gameTable.bigBlind && this.gameTable.bettingRound.round==0){
			console.log("Betting round over, the big blind checked");
			this.updateHandLog("Betting round over, the big blind checked");
			
			if(this.gameTable.isTimerGame==true)
				this.actionOnTimer();
			this.goToNextRound();
			return true;
		}

		//IM THE ONLY GUY IN THE  HAND AND I NEED TO DECIDE IF I WANT TO CALL AN ALL IN
		else if(this.isOnlyOnePlayerNotAllIn()==true && this.getActionOnPlayer().moneyOnLine<this.gameTable.bettingRound.currentRaiseToCall) {
				this.gameTable.bettingRound.nextActionsAvailable = ['call','fold'];
				console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
				if(this.gameTable.isTimerGame==true)
					this.actionOnTimer();
		}

		//IM THE ONLY GUY IN THE  HAND AND I WAS THE PREVIOUS RASIER
		else if(this.isOnlyOnePlayerNotAllIn()==true && this.getActionOnPlayer().hash==this.gameTable.bettingRound.lastRaiser.hash) {
			this.addMoneyLineToPot();
			this.settleTheHand();
			return true;
		}

		//IM THE ONLY GUY IN THE  HAND AND MY MOL IS HIGHer OR EQUAL TO CURRENT RAISE
		else if(this.isOnlyOnePlayerNotAllIn()==true && this.getActionOnPlayer().moneyOnLine>=this.gameTable.bettingRound.currentRaiseToCall) {
			this.addMoneyLineToPot();
			this.settleTheHand();
			return true;
		}


		
		//ROUND OVER IF LAST BET WAS CHECK AND first guy up
		else if(this.gameTable.bettingRound.lastBet=='check' && this.getActionOnPlayer().hash==this.whoShouldStartRound().hash){
			//console.log(this.getActionOnPlayer().hash +" vs "+this.getSmallBlindPlayer().hash);
			console.log("Betting round over, everyone checked.");
			this.updateHandLog("Betting round over, everyone checked.");
			if(this.gameTable.bettingRound.round<4)
				this.goToNextRound();
			else {
				this.addMoneyLineToPot();
				this.settleTheHand();
				return true;
			}
		}

		//ROUND OVER IF LAST BET WAS CALL AND PLAYER UP HAS MOL = CURRENTRAISE
		else if(this.gameTable.bettingRound.lastBet=='call' && this.getActionOnPlayer().moneyOnLine==this.gameTable.bettingRound.currentRaiseToCall){
			console.log("Betting round over,all bets in");
			this.updateHandLog("Betting round over,all bets in");
			if(this.gameTable.bettingRound.round<4) {
			
				this.goToNextRound();
				return true;

			}
			else {
				this.addMoneyLineToPot();
				this.settleTheHand();
				return true;
			}
		}

		

		else if(this.gameTable.bettingRound.lastBet=='check') {
			this.gameTable.bettingRound.nextActionsAvailable = ['raise','check'];
			console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
			if(this.gameTable.isTimerGame==true)
				this.actionOnTimer();
		}

		else if(this.gameTable.bettingRound.lastBet=='call') {
			//if this call puts them all in
			if(this.getActionOnPlayer().balance<=(this.gameTable.currentRaiseToCall-this.getActionOnPlayer().moneyOnLine)){
				this.gameTable.bettingRound.nextActionsAvailable = ['call','fold'];
				console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
				if(this.gameTable.isTimerGame==true)
					this.actionOnTimer();
			}
			//if it doesnt put them all in
			else {
				this.gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
				if(this.gameTable.isTimerGame==true)
					this.actionOnTimer();
			}


		}
		//raise
		else if(this.gameTable.bettingRound.lastBet=='raise') {
			if(this.getActionOnPlayer().balance<=(this.gameTable.currentRaiseToCall-this.getActionOnPlayer().moneyOnLine)){
				this.gameTable.bettingRound.nextActionsAvailable = ['call','fold'];
				console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
				if(this.gameTable.isTimerGame==true)
					this.actionOnTimer();
			}
			//if it doesnt put them all in
			else {
				this.gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold'];
				console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
				if(this.gameTable.isTimerGame==true)
					this.actionOnTimer();
			}


		}

		//IF THE LAST THING TO HAPPEN WAS BLINDS POSTING, AND MY MOL IS < BLINDS, I NEED TO PAY BLIND OR RAISE OR FOLD
		else if(this.gameTable.bettingRound.lastBet=='blinds'
			&& this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].moneyOnLine != this.gameTable.currentRaiseToCall) {
			
			this.gameTable.bettingRound.nextActionsAvailable = ['raise','call','fold']; 
			
			console.log("action: "+this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].userid +" "+this.gameTable.bettingRound.nextActionsAvailable);
			if(this.gameTable.isTimerGame==true)
				this.actionOnTimer();
			//var result = {'actionOn':this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat,
			//		'options':availableOptions
			//		};
			//return result;

			//}
		}
		if(this.gameTable.isTest==false)
			this.sendDataToAllPlayers();
	}

	getNextActionsAvailable() {
		return this.gameTable.bettingRound.nextActionsAvailable;
	}

	advanceToNextPlayer(){
		this.gameTable.bettingRound.actionOn=this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].nextPlayer;
	}

	saveThisGame() {
	

		var saveFormat =  JSON.stringify(this,function( key, value) {
			//remove circular stuff
 			if(key == 'nextPlayer') { 
				if(value!=null) 
    				return value.hash;
  			} 
  			if(key == 'previousPlayer') { 
				if(value!=null) 
					return value.hash;
  			} 
  			if(key == 'actionOnTimer') { 
    			return "removedForStringify";
  			} 
  			else {
				if(value!=null) 
    				return value;
  			};
		});

		saveFormat = JSON.parse(saveFormat);
		var that = this;
		saveGameController.saveThisGame(saveFormat, function(id) {
			
			that.save_id=id;
		});
		

	}

	doAction(player,action,amt) {
		clearTimeout(this.gameTable.bettingRound.actionOnTimer);
		var foldCounter=0;
		//check to see we have right player
		if(player.hash == this.gameTable.seats[this.gameTable.bettingRound.actionOn.seat].hash) {
			//check to see we have valid option
			if(this.gameTable.bettingRound.nextActionsAvailable.includes(action) || action=='fold-clock'){

				if(action=="check") {
					this.gameTable.bettingRound.lastBet='check';
					this.advanceToNextPlayer();
					console.log(player.userid+" has checked.");
					this.updateHandLog(player.userid+" has checked.");
					this.getNextAction();
					this.saveThisGame();
					return true;
				
				}
				else if (action=="fold" || action=='fold-clock') {
					player.status='folded';
					console.log(player.userid+" has folded");
					this.updateHandLog(player.userid+" has folded.");
					
					//chek to see if only one NON-FOLDED guy left, if someone is all in we need another solution
					for(var i=0;i<this.gameTable.game_size;i++){
						//if i include allin here then some games wont settle
						if(this.gameTable.seats[i].status=='inhand' || this.gameTable.seats[i].status=='allin')
							foldCounter++;
					
					//but if there is only one inhand guys left (everyone else all in, we need to see if he should act or not)

					}
					if(foldCounter==1){
						//player.status='folded';
						this.gameTable.bettingRound.endByFold=true;
						this.gameTable.bettingRound.round=4;
						//we actually add the money line in the settling logi in this case, because we dont want
						//to make new pots if someone folded and didnt call with different MOL sizes
						this.addMoneyLineToPot();
						this.settleTheHand();
						this.saveThisGame();
						return true;
					}
					else{
						//must avance first cuz i unload nextplayer on fold
						this.foldPlayer(player);
						this.advanceToNextPlayer();
						this.getNextAction();
						this.saveThisGame();
						return true;
					}
					this.getNextAction();
					this.saveThisGame();
					return true;

				}
				else if (action=="call") {
						var amtToCall = parseInt(this.gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine);
					//	console.log('amt to call '+amtToCall+" hasEnough?"+player.hasEnough(this.gameTable.bettingRound.currentRaiseToCall));
					
					//either they have enough to cover or theyre all in
					if(player.hasEnough(amtToCall)||player.balance<amtToCall) {

						//are they all in?
						if(player.balance<amtToCall) {
							//putPlayerAllIn actually checks if it shoudl end the game, in which case stop stuff here
							if(this.putPlayerAllIn(player)) {
								player.addMoneyToLine(player.balance);
								this.gameTable.bettingRound.totalOnLine+=player.balance;
								console.log(player.userid+" is all in!");
								this.updateHandLog(player.userid+" is all in!");
							}
							else
								return true;
							

						}
						else {
							player.addMoneyToLine(amtToCall);
							this.gameTable.bettingRound.totalOnLine+=amtToCall;
						}

						//need to get diff of what player has in vs whats to call
						
						this.gameTable.bettingRound.lastBet='call';

						
						
						this.advanceToNextPlayer();
						//console.log('INSIDE ACTION ON:'+this.gameTable.bettingRound.actionOn.userid);

						console.log(player.userid+" has called $"+(this.gameTable.bettingRound.currentRaiseToCall/100).toString());
						this.updateHandLog(player.userid+" has called $"+(this.gameTable.bettingRound.currentRaiseToCall/100).toString());

						//check to see if this call sets player all in all in
						//will need to allow a call if it puts someone all in
						if(player.balance==0){
							if(this.isOnlyOnePlayerNotAllIn()==true) {
								this.goToNextRound();
								return true;
							}
							//i think this is only if they happen to go call it perfectly and its not caught above with <
							else {
							this.putPlayerAllIn(player);
							console.log(player.userid+" is all in!");
							this.updateHandLog(player.userid+" is all in!");
							
							}
						}


						
					}
					else {
						console.log("amount doesnt have enough for call");
						return false;
					}
					this.getNextAction();
					this.saveThisGame();
					return true;
				}
				else if (action=='raise') {
					//when you raise you need to call current pot and then raise further
					var amtToRaise = (this.gameTable.bettingRound.currentRaiseToCall-player.moneyOnLine) + amt;
					if(player.hasEnough(amtToRaise)) {
						player.addMoneyToLine(amtToRaise);
						this.gameTable.bettingRound.totalOnLine+=amtToRaise;
						this.gameTable.bettingRound.lastBet='raise';
						this.gameTable.bettingRound.lastRaiser=player;
						//so when player had to put more in, the actual raise number only goes up how much he raised it
						this.gameTable.bettingRound.currentRaiseToCall+=amt;
						this.advanceToNextPlayer();
						console.log(player.userid+" has raised to $"+(this.gameTable.bettingRound.currentRaiseToCall/100).toFixed(2)+".");
						this.updateHandLog(player.userid+" has raised to $"+(this.gameTable.bettingRound.currentRaiseToCall/100).toFixed(2)+".");
						if(player.balance==0)
							this.putPlayerAllIn(player);
						this.getNextAction();
						this.saveThisGame();
						return true;
					}
					else {
						console.log(player.userid+" doesn't have enough for a raise of"+(amt/100).toFixed(2));
						return false;
					}
				}
			}
			else
				console.log(player.userid+" is the right player, but they can't "+action);
				return false;
		}

		else {
			console.log(player.userid+" tried to "+action+", but this player is not up.");
			return false;
		}
	}
	
	//so we can send data to everyone
    getAllPlayerSessionIDs () {
    	var allPlayers = [];

    	for (var i=0;i<this.gameTable.game_size;i++){
    		if(this.gameTable.seats[i]!="empty") {
    			allPlayers.push({sessionid:this.gameTable.seats[i].sessionid,
    							hash:this.gameTable.seats[i].hash});
    		}
    	}
    	//console.log(JSON.stringify(allPlayers));
    	return allPlayers;
    }


    //so we can send data to everyone
    findPlayerBySessionID (findThisSessionid) {
    	for (var i=0;i<this.gameTable.game_size;i++){
    		//console.log(this.gameTable.seats[i].sessionid +' vs '+findThisSessionid);

    		if(this.gameTable.seats[i].sessionid==findThisSessionid) 
	    		return this.gameTable.seats[i];
    	}		 
    	return false;
    }
    //so we can package the data to send to everyone
	generatePrivatePlayerData (thisHash) {
		var privategameTable = this.gameTable;
		privategameTable.yourid=thisHash;
		privategameTable =  JSON.stringify(privategameTable,function( key, value) {
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

		privategameTable = JSON.parse(privategameTable);

		//hide or reveal player cards
		for(var i=0; i<this.gameTable.game_size;i++){
			if(privategameTable.seats[i] != 'empty' 
				&&  privategameTable.seats[i].card1!=null
				&&  privategameTable.seats[i].hash!=thisHash) 
				{
				if(privategameTable.seats[i].status=='folded') 
					privategameTable.seats[i].card1 = null;
				else if(this.cardsToReveal[i].card1=='private') 
					privategameTable.seats[i].card1 = "private";
				
				if(privategameTable.seats[i].status=='folded') 
					privategameTable.seats[i].card2 = null;
				else if(this.cardsToReveal[i].card2=='private') 
					privategameTable.seats[i].card2 = "private";
					
			}
			else if(privategameTable.seats[i].hash==thisHash) {
				if(privategameTable.seats[i].status=='folded') {
					privategameTable.seats[i].card1 = privategameTable.seats[i].card1;
					privategameTable.seats[i].card2 = privategameTable.seats[i].card2;
				}
			}
		}

		//sanitize cards out of br.acitionOn, dealer, nextPlayer
		if(privategameTable.bettingRound.actionOn!=null) {
			privategameTable.bettingRound.actionOn.card1 = 'private';
			privategameTable.bettingRound.actionOn.card2 = 'private';

		}

		if(privategameTable.dealer!=null) {
			privategameTable.dealer.card1 = 'private';
			privategameTable.dealer.card2 = 'private';

		}

		return JSON.stringify(privategameTable);
	}

	revealCards(player,card1, card2) {
		if(card1) {
			this.cardsToReveal[player.seat].card1 = 'reveal'
		}
		if(card2) {
			this.cardsToReveal[player.seat].card2 = 'reveal'
		}
	}

	getPublicSeatList() {
		var publicSeatList =  JSON.stringify(this.gameTable,function( key, value) {
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

		for(var i=0; i<this.gameTable.game_size;i++){
			if(publicSeatList.seats[i] != 'empty') {
				if(publicSeatList.seats[i].card1 != null && publicSeatList.seats[i].status != 'folded') {
					publicSeatList.seats[i].card1 = "private";
					publicSeatList.seats[i].card2 = "private";
				}
				else {
					publicSeatList.seats[i].card1 = null;
					publicSeatList.seats[i].card2 = null;
				}

			}
		}

		//sanitize cards out of br.acitionOn, dealer, nextPlayer
		if(publicSeatList.bettingRound.actionOn!=null) {
			publicSeatList.bettingRound.actionOn.card1 = 'private';
			publicSeatList.bettingRound.actionOn.card2 = 'private';
		
		}
		
		if(publicSeatList.dealer!=null) {
			publicSeatList.dealer.card1 = 'private';
			publicSeatList.dealer.card2 = 'private';
		}



		return JSON.stringify(publicSeatList);
	}

	
	getPlayerByCookie(cookie) {
		for(var i=0;i<this.gameTable.game_size;i++) {
			if(this.gameTable.seats[i].cookie==cookie)
				return this.gameTable.seats[i];
		}
		return false;
	}

	sendChat(hash,message) {
		var transmission = this.getPlayerByHash(hash).userid + ": "+message;
		this.chat.push(transmission);
		this.sendDataToAllPlayers();
	}

}


exports.game=game;
