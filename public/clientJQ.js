//var socket = io('http://localhost:3000');
//const PORT = process.env.PORT || 3000;
//var socket = io(window.location.hostname+":3000");
//script(src='./socket.io/socket.io.js')
//var socket = io.connect(window.location.hostname);


var socket = io();
var gameData;
var seats = [];
var myid;
var mySeatData;
var gameid='train';

var storedCookie = ('; ' + document.cookie)
.split('; ' + "clientID" + '=')
.pop()
.split(';')
.shift();

function leaveTable () {
	socket.emit('leaveTable', gameid);
}

function cookieIsset(name)
{
    var cookies = document.cookie.split(";");
    for (var i in cookies)
    {
        if (cookies[i].indexOf(name + "=") == 0)
            return true;
    }
    return false;
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function register () {
		var register = {
			gameHash: 'train',
			userid: $('#userid').val(),
			balance: $('#balance').val(),
			status: 'playing',
			seat: $('#seat').val(),
			storedCookie:storedCookie
		}
		$('#overlay').css('display','none');

		socket.emit('register', register);
	}

	function sit (seat) {
		console.log("ON SIT " +storedCookie);
		var register = {
			gameHash: 'train',
			storedCookie: storedCookie,
			userid: $('#player'+seat).find('.nameInput').val(),
			balance: $('#player'+seat).find('.balanceInput').val(),
			status: 'playing',
			seat: seat
		}
		//$('#overlay').css('display','none');

		socket.emit('register', register);
	}

	function nextHand() {
		socket.emit('nextHand', gameid);
	}

	function startGame() {
		if(gameData.numseats>1)
			socket.emit('startGame', gameid);
		else
			console.log("need more than 1 person");
	}

	function check() {
		socket.emit('incomingAction', {game:gameid,userhash:myid,action:'check'});
	}

	function call() {
		socket.emit('incomingAction', {game:gameid,userhash:myid,action:'call'});
	}

	function fold() {
		socket.emit('incomingAction', {game:gameid,userhash:myid,action:'fold'});
	}

	function reconnect() {
		console.log('ATTEMPTING RECONNECT: '+gameid+' '+storedCookie);
		socket.emit('reconnectionAttempt', {gameid:gameid,storedCookie:storedCookie,hash:myid});
	}

	function toggleSitOut() {
		socket.emit('toggleSitOut', {gameid:gameid,hash:myid});
	}

	function raise() {
		var inputedAmt = $("#raise").find('.raiseInput').val();
		if(Number(inputedAmt)<=Number(mySeatData.balance)) {
			console.log('sending raise of '+inputedAmt);
			$('#raise').find('.raiseInput').css('color','black');
			socket.emit('incomingAction', {game:gameid,userhash:myid,action:'raise',amt:Number(inputedAmt)});
		}
		else {
			$('#raise').find('.raiseInput').css('color','red');
		}
	}

$(window).on('load', function(){

	//updateGameData();
	if(cookieIsset('clientID')==false) {
		var id = makeid(16);
		document.cookie = "clientID="+id;
		storedCookie = id;
	}
	else {
		reconnect();
	}

	socket.emit('seatList', gameid);



	function updateGameData(gameData){
		//store MY data
		$.each(seats,function(index) {
			if(seats[index].hash === myid){
				mySeatData = seats[index];
				//console.log("MY SEAT "+mySeatData.seat);
			}
		})
		
		$.each(seats, function(index) {
			if (seats[index]=='empty') {
				$('#player'+index).removeClass('actionOn');
				$('#player'+index).removeClass('sittingOut');
				$('#player'+index).addClass('empty');
			}
			if (seats[index]!='empty') {
				$.each(seats[index], function (k,v) {
					$('#player'+index).addClass('seatfull');
					$('#player'+index).removeClass('sittingOut');
					$('#player'+index).find('#join').css('display','none');
					if(seats[index].status=='sittingout') {
						$('#player'+index).removeClass('empty');
						$('#player'+index).addClass('sittingOut');
						$('#player'+index).find('.card1').html("");
						$('#player'+index).find('.card2').html("");
					}
					//console.log("spinning on "+seats[index] );
					if(k=='userid')
						$('#player'+index).find('.userid').html(v);
					else if(k=='balance')
						$('#player'+index).find('.balance').html("$"+Number(v).toFixed(2));
					else if(k=='card1') {
						if(gameData.seats[index].status=='inhand')
							$('#player'+index).find('.card1').html('<img id="theImg" src="img/cards/'+v+'.svg" width="100%"/>');
						else if(gameData.seats[index].status=='folded')
							$('#player'+index).find('.card1').html('<img id="theImg" src="img/cards/fold.svg" width="100%"/>');

						//$('#player'+index).find('.card1').append(v);
					}
					else if(k=='card2') {
						if(gameData.seats[index].status=='inhand')
							$('#player'+index).find('.card2').html('<img id="theImg" src="img/cards/'+v+'.svg" width="100%"/>');
						else if(gameData.seats[index].status=='folded')
							$('#player'+index).find('.card2').html('<img id="theImg" src="img/cards/fold.svg" width="100%"/>');

					}
				});
			}

		});
		//clear actionOn

		if(gameData.bettingRound.actionOn!=null){
			$('#start').css('display','none');
			//console.log("on me? "+gameData.bettingRound.actionOn.hash+" vs "+myid);
			$('#player'+gameData.bettingRound.actionOn.seat).addClass('actionOn');
			if(gameData.bettingRound.actionOn.hash===myid && gameData.bettingRound.round!=null) {
				//SHOW MY BAR
				$.each(gameData.bettingRound.nextActionsAvailable, function(index) {
					$('#actionBar').find('#'+gameData.bettingRound.nextActionsAvailable[index]).css('display','block');
				})

				$('#actionBar').css('display','block');
			}
			else {

				$('#actionBar').find('#raise').css('display','none');
				$('#actionBar').find('#check').css('display','none');
				$('#actionBar').find('#raiseInput').css('display','none');
				$('#actionBar').find('#call').css('display','none');
				$('#actionBar').find('#fold').css('display','none');
				$('#actionBar').css('display','none');
			}

			
			//add pot
			$('#statusArea').html("Pot $"+gameData.currentPot.total+"<br>Line $"+gameData.bettingRound.totalOnLine);


		}
		
		//iff actionon is null
		else {
			$('#actionBar').find('#raise').css('display','none');
			$('#actionBar').find('#raiseInput').css('display','none');
			$('#actionBar').find('#check').css('display','none');
			$('#actionBar').find('#call').css('display','none');
			$('#actionBar').find('#fold').css('display','none');
			$('#actionBar').css('display','none');
		}

		if(gameData.board[0]!=null){
			$('#board').html("");
			$.each(gameData.board, function(index) {
				$('#board').append('<img id="theImg" src="img/cards/'+gameData.board[index]+'.svg" width="40%"/>');
			});
		}
		if(gameData.board[0]==null){
			$('#board').html("");
		}


		
		/*if(gameData.currentPot.winners!=null) {
			$('.winner').css('visibility','visible');
			$.each(gameData.winner.players, function (index) {
				$('#winner').html(gameData.winner.players[index].userid+" won $"+gameData.winner.winningPot+"with a "+gameData.winner.hand+"!");
				
			})
			
		}*/

		if(gameData.isSettled=='no') {
				$('.winner').css('visibility','hidden');
				$('#winner').html('')

		}
		if(gameData.isSettled=='yes') {
			$('.winner').css('visibility','visible');
			$.each(gameData.bettingRound.pots, function (index) {
				$('#winner').append("Pot "+index+" winner(s) are ");
					$.each(gameData.bettingRound.pots[index].winners, function (i) {
						$('#winner').append(gameData.bettingRound.pots[index].winners[i].winner.userid+" ");
						$('#winner').append("with "+gameData.bettingRound.pots[index].winners[i].winningHand);
						$('#player'+gameData.bettingRound.pots[index].winners[i].winner.seat).find('.card1').html('<img id="theImg" src="img/cards/'+
							gameData.bettingRound.pots[index].winners[i].winningCards[0]+'.svg" width="100%"/>');
						$('#player'+gameData.bettingRound.pots[index].winners[i].winner.seat).find('.card2').html('<img id="theImg" src="img/cards/'+
							gameData.bettingRound.pots[index].winners[i].winningCards[0]+'.svg" width="100%"/>');
						})
						
				});
			}
		
	}

	socket.on('publicSeatList', function(publicData) {
		//console.log("incoming update " + privateData);
		gameData = JSON.parse(publicData);
		seats = gameData.seats;
		updateGameData(gameData);
		console.log(gameData);

	});

	socket.on('update', function(privateData) {
	//console.log("incoming update " + privateData);
		gameData = JSON.parse(privateData);
		seats = gameData.seats;
		console.log(gameData);
		updateGameData(gameData);

	});

	socket.on('yourHash', function(myNewid) {
	myid=myNewid;
	console.log("MY ID:"+myid);
	});

});