
var socket = io('http://localhost:3000');

var cookie = ('; ' + document.cookie)
.split('; ' + "user" + '=')
.pop()
.split(';')
.shift();

cookie = parseInt(cookie);

console.log("trying "+cookie);

socket.emit('identify', cookie);

socket.on('handshake', function() {
	console.log("APPROVED");
});

socket.on('newhand', function(privateData) {
	console.log("MY HAND " + JSON.stringify(privateData));
	document.getElementById('mycards').innerHTML='MY CARDS: ' + JSON.stringify(privateData);

});

socket.on('openActionToMe', function () {
	console.log("OPEN ACTION TO ME");
	document.getElementById('openBettingBar').style= "display: block";
});

socket.on('handdetails', function (handData) {
	document.getElementById('handDetails').innerHTML='HAND DETAILS: ' + JSON.stringify(handData);
});

socket.on('betToMe', function () {
	console.log("BET TO ME");
	document.getElementById('betBettingBar').style= "display: block";
});

function sendAction (bet) {
	socket.emit('sendBet', bet);
	document.getElementById('betBettingBar').style= "display: none";
	document.getElementById('openBettingBar').style= "display: none";


};
/*
socket.emit('joinGame', {
	userid:"fart",
	seat:1,
	balance:100,
	status:"playing"}
	);

socket.emit('joinGame', {
	userid:"poop",
	seat:0,
	balance:100,
	status:"playing"}
	);

socket.emit('joinGame', {
	userid:"leigh",
	seat:8,
	balance:100,
	status:"playing"}
	);*/

socket.on('update', function(gameData) {
	//gameUpdate=JSON.parse(gameData);
	//console.log(gameData);
	
		//document.getElementById('seat1Name').innerHTML='Player 1: ' + gameData[0].userid;
		document.getElementById('seat1Name').innerHTML=JSON.stringify(gameData);
		document.getElementById('seat1Stack').innerHTML='Stack: ' + gameData[0].balance;
		document.getElementById('seat2Name').innerHTML='Player 2: ' + gameData[1].userid;
		document.getElementById('seat2Stack').innerHTML='Stack: ' + gameData[1].balance;
		document.getElementById('seat3Name').innerHTML='Player 3: ' + gameData[2].userid;
		document.getElementById('seat3Stack').innerHTML='Stack: ' + gameData[2].balance;
		document.getElementById('seat4Name').innerHTML='Player 4: ' + gameData[3].userid;
		document.getElementById('seat4Stack').innerHTML='Stack: ' + gameData[3].balance;
		document.getElementById('seat5Name').innerHTML='Player 5: ' + gameData[4].userid;
		document.getElementById('seat5Stack').innerHTML='Stack: ' + gameData[4].balance;
		document.getElementById('seat6Name').innerHTML='Player 6: ' + gameData[5].userid;
		document.getElementById('seat6Stack').innerHTML='Stack: ' + gameData[5].balance;
		document.getElementById('seat7Name').innerHTML='Player 7: ' + gameData[6].userid;
		document.getElementById('seat7Stack').innerHTML='Stack: ' + gameData[6].balance;
		document.getElementById('seat8Name').innerHTML='Player 8: ' + gameData[7].userid;
		document.getElementById('seat8Stack').innerHTML='Stack: ' + gameData[7].balance;
		document.getElementById('seat9Name').innerHTML='Player 9: ' + gameData[8].userid;
		document.getElementById('seat9Stack').innerHTML='Stack: ' + gameData[8].balance;
	/*
		document.getElementById('card1').innerHTML='C1: ' + gameData.game_info.card1;
		document.getElementById('card2').innerHTML='C2:  ' + gameData.game_info.card2;
		document.getElementById('card3').innerHTML='C3:  ' + gameData.game_info.card3;
		document.getElementById('card4').innerHTML='C4:  ' + gameData.game_info.card4;
		document.getElementById('card5').innerHTML='C5:  ' + gameData.game_info.card5;

		document.getElementById('currentPot').innerHTML='Pot:  ' + gameData.game_info.currentPot;
		document.getElementById('minRaise').innerHTML='Min Raise:  ' + gameData.game_info.minRaise;

		document.getElementById('tablename').innerHTML='Table Name:  ' + gameData.table_info.tablename;
		document.getElementById('smallblind').innerHTML='Small Blind:  ' + gameData.table_info.smallblind;
		document.getElementById('bigblind').innerHTML='Big Blind:  ' + gameData.table_info.bigblind;
		document.getElementById('actionOnPlayer').innerHTML='Action On:  ' + gameData.game_info.actionOnPlayer;*/
});
	

