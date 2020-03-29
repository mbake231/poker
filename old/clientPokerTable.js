

var socket = io('http://localhost:3000');
var cookie = ('; ' + document.cookie)
.split('; ' + "user" + '=')
.pop()
.split(';')
.shift();

var gameData;

var myid;

cookie = parseInt(cookie);

//console.log("trying "+cookie);
//socket.emit('identify', cookie);

socket.on('update', function(privateData) {
	console.log("incoming update " + privateData);
	gameData = JSON.parse(privateData);
	updateGameData(gameData);
	//document.getElementById('mycards').innerHTML='MY CARDS: ' + JSON.stringify(privateData);

});

socket.on('yourID', function(myNewid) {
	myid=myNewid;
});
/*
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


};*/

function updateGameData(gameData) {

	for (var i=0;i<gameData.game_size;i++) {
		if(gameData.seats[i]!="empty") {

			document.getElementById('player'+i).children[0].innerHTML = gameData.seats[i].userid;
			document.getElementById('player'+i).children[1].innerHTML = gameData.seats[i].balance;
		if(card1!=null){
			document.getElementById('player'+i).children[2].children[0].innerHTML = 
			'<img id="theImg" src="img/cards/'+gameData.seats[i].card1+'.svg" width="100%"/>';

			document.getElementById('player'+i).children[2].children[1].innerHTML = 
			'<img id="theImg" src="img/cards/'+gameData.seats[i].card1+'.svg" width="100%"/>';
			}


		}
		if(gameData.bettingRound.actionOn.seat == i)
		{
			document.getElementById('player'+i).className = "player actionOn";
			document.getElementById('player'+i).className = "player actionOn";

		}

		if(gameData.bettingRound.actionOn.seat != i)
		{
			document.getElementById('player'+i).className = "player";
		}

	}
	location.reload();
}

function startGame() {
	socket.emit('startGame', cookie);
}


/*

$(window).on('load', function(){
var seats=[];

 var seatsStub = [{

userid:"mike",
cookie:"null",
balance:"23.12",
status:"playing",
card1:"Ad",
card2:"Kd",
moneyOnLine:"1.21",
seat:1},
{userid:"jim",
cookie:"null",
balance:"33.12",
status:"playing",
card1:"Jd",
card2:"10d",
moneyOnLine:"2.21",
seat:2},
{userid:"fart",
cookie:"null",
balance:"93.12",
status:"playing",
card1:"Jd",
card2:"10d",
moneyOnLine:"2.21",
seat:2},
{userid:"piss",
cookie:"null",
balance:"83.12",
status:"playing",
card1:"Jd",
card2:"10d",
moneyOnLine:"2.21",
seat:2}
];


$(function () {
    var socket = io('http://localhost:3000');


socket.on('update', function(privateData) {
	console.log("incoming update " + privateData);
	seats = JSON.parse(privateData).seats;


	//console.log(privateData);
	//document.getElementById('mycards').innerHTML='MY CARDS: ' + JSON.stringify(privateData);






  var counter=0;
  $.each(seats, walker);

  function walker(key,value) {
  	if(key=='card1'){
  		var img = 
  		$('#player'+counter).children('.cards').children("."+key).html('<img id="theImg" src="img/cards/'+value+'.svg" width="100%"/>');
  	}
  	else if(key=='card2') {
  		$('#player'+counter).children('.cards').children("."+key).html('<img id="theImg" src="img/cards/'+value+'.svg" width="100%"/>');
  	}
  	else if(key=='balance') {
		$('#player'+counter).children("."+key).text("$"+value);  	}
  	else {
  		$('#player'+counter).children("."+key).text(value);
  	}


	  	if (typeof value === "object") {
	  		$.each(value,walker);
	  			counter++;
	  	}
  	}

});

});

});

*/
