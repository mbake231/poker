
var socket = io('http://localhost:3001');

var userid='1';

console.log('hello');

socket.emit('joinGame', userid);

socket.on('update', function(gameData) {
	//gameUpdate=JSON.parse(gameData);
	console.log(gameData);
	
		document.getElementById('seat1Name').innerHTML='Player 1: ' + gameData.game_info.seatList.seat1.name;
		document.getElementById('seat1Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat1.stack;
		document.getElementById('seat2Name').innerHTML='Player 2: ' + gameData.game_info.seatList.seat2.name;
		document.getElementById('seat2Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat2.stack;
		document.getElementById('seat3Name').innerHTML='Player 3: ' + gameData.game_info.seatList.seat3.name;
		document.getElementById('seat3Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat3.stack;
		document.getElementById('seat4Name').innerHTML='Player 4: ' + gameData.game_info.seatList.seat4.name;
		document.getElementById('seat4Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat4.stack;
		document.getElementById('seat5Name').innerHTML='Player 5: ' + gameData.game_info.seatList.seat5.name;
		document.getElementById('seat5Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat5.stack;
		document.getElementById('seat6Name').innerHTML='Player 6: ' + gameData.game_info.seatList.seat6.name;
		document.getElementById('seat6Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat6.stack;
		document.getElementById('seat7Name').innerHTML='Player 7: ' + gameData.game_info.seatList.seat7.name;
		document.getElementById('seat7Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat7.stack;
		document.getElementById('seat8Name').innerHTML='Player 8: ' + gameData.game_info.seatList.seat8.name;
		document.getElementById('seat8Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat8.stack;
		document.getElementById('seat9Name').innerHTML='Player 9: ' + gameData.game_info.seatList.seat9.name;
		document.getElementById('seat9Stack').innerHTML='Stack: ' + gameData.game_info.seatList.seat9.stack;
	
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
		document.getElementById('actionOnPlayer').innerHTML='Action On:  ' + gameData.game_info.actionOnPlayer;

		






});
	

