

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

var seats = [{

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



$(window).on('load', function(){

 
  var counter=0;
  $.each(seats, walker);

  function walker(key,value) {
  	if(key=='card1'){
  		var img = 
  		$('#player'+counter).children('.cards').children("."+key).prepend('<img id="theImg" src="img/cards/'+value+'.svg" width="100%"/>');
  	}
  	else if(key=='card2') {
  		$('#player'+counter).children('.cards').children("."+key).prepend('<img id="theImg" src="img/cards/'+value+'.svg" width="100%"/>');
  	}
  	else if(key=='balance') {
		$('#player'+counter).children("."+key).append("$"+value);  	}
  	else {
  		$('#player'+counter).children("."+key).append(value);
  	}


	  	if (typeof value === "object") {
	  		$.each(value,walker);
	  			counter++;
	  	}
  	}



});


