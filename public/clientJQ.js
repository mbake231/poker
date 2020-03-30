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



function format () {
  return Array.prototype.slice.call(arguments).join(' ')
}

//precache images
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

//SOUNDS
var callAudio = document.createElement('audio');
callAudio.setAttribute('src', './audio/raise.wav');

var yourturnAudio = document.createElement('audio');
yourturnAudio.setAttribute('src', './audio/yourturn.wav');

var shuffleAudio = document.createElement('audio');
shuffleAudio.setAttribute('src', './audio/shuffle.wav');

var raiseAudio = document.createElement('audio');
raiseAudio.setAttribute('src', './audio/raise.wav');

var checkAudio = document.createElement('audio');
checkAudio.setAttribute('src', './audio/check.wav');

var storedCookie = ('; ' + document.cookie)
.split('; ' + "clientID" + '=')
.pop()
.split(';')
.shift();

function leaveTable () {
	if(myid!=null) {
		socket.emit('leaveTable', {gameid:gameid,hash:myid});
		//location.reload(true);
	}
}

function clockCalled() {
	$('#clock').prop('disabled','true');
	$('#clock').html(gameData.bettingRound.actionOnTimeLimit+' Second clock called');
	setTimeout(function(){
			$('#clock').html('Call clock');
			$('#clock').prop('disabled',null);
		}, 1000*(gameData.bettingRound.actionOnTimeLimit+3));
}

function callClock() {
	if(gameData.bettingRound.actionOn!=null) {
		socket.emit('callClock', {gameid:gameid});
		$('#clock').prop('disabled','true');
		$('#clock').html(gameData.bettingRound.actionOnTimeLimit+' Second clock called');
		setTimeout(function(){
			$('#clock').html('Call clock');
			$('#clock').prop('disabled',null);
		}, 1000*(gameData.bettingRound.actionOnTimeLimit+3));
	}

}

function cookieIsset(name)
{
    var cookies = document.cookie.split(";");
    //console.log(cookies);
    for (var i in cookies)
    {
        if (cookies[i].indexOf('clientID' + "=") == 0){
            return true;
        }
        else if (cookies[i].indexOf(' clientID' + "=") == 0){
            return true;
        }
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
		checkAudio.play();
		if($('#player'+seat).find('.nameInput').val().length!=0 &&  $('#player'+seat).find('.balanceInput').val().length!=0) {
		var register = {
			gameHash: 'train',
			storedCookie: storedCookie,
			userid: $('#player'+seat).find('.nameInput').val(),
			balance: $('#player'+seat).find('.balanceInput').val(),
			status: 'playing',
			seat: seat}
			$('#player'+seat).find('.balanceInput').css('border','1px solid black;');
			$('#player'+seat).find('.balanceInput').css('border','1px solid black;');
			socket.emit('register', register);
		}
		if ($('#player'+seat).find('.balanceInput').val().length===0) {
			console.log('fart');
			$('#player'+seat).find('.nameInput').css('border','1px solid red;')
		}
		if ($('#player'+seat).find('.nameInput').val().length===0 )
			$('#player'+seat).find('.balanceInput').css('border','1px solid red;')



		//$('#overlay').css('display','none');

		
	}



	function nextHand() {
		socket.emit('nextHand', {gameid:gameid,hash:myid});
	}

	function startGame() {
			socket.emit('startGame', {gameid:gameid,hash:myid});

	}

	function check() {
		checkAudio.play();
		socket.emit('incomingAction', {game:gameid,hash:myid,action:'check'});
	}

	function call() {
		callAudio.play();
		socket.emit('incomingAction', {game:gameid,hash:myid,action:'call'});
	}

	function fold() {
		socket.emit('incomingAction', {game:gameid,hash:myid,action:'fold'});
	}

	function reconnect() {
		console.log('ATTEMPTING RECONNECT: '+gameid+' '+storedCookie);
		socket.emit('reconnectionAttempt', {gameid:gameid,storedCookie:storedCookie,hash:myid});
	}

	function toggleSitOut() {
		socket.emit('toggleSitOut', {gameid:gameid,hash:myid});
	}

	function raise() {
		if($('.raiseInput').val().length!=0) {
			raiseAudio.play();
			var inputedAmt = $("#raise").find('.raiseInput').val();
			if(Number(inputedAmt)<=Number(mySeatData.balance)) {
				console.log('sending raise of '+inputedAmt);
				$('#raise').find('.raiseInput').css('color','black');
				socket.emit('incomingAction', {game:gameid,hash:myid,action:'raise',amt:Number(inputedAmt)});
			}
			else {
				$('#raise').find('.raiseInput').css('color','red');
			}

		}
		else
			$('.raiseInput').css('border','1px solid red;')

	}

$(window).on('load', function(){

	//pre-cache cards
	var cards = new Array(52);
	var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K");
	var suits = new Array("c", "d", "h", "s");
	var i, j;
	for (i = 0; i < suits.length; i++) {
		for (j = 0; j < ranks.length; j++) {
			cards[i*ranks.length + j] = 'img/cards/'+ranks[j] + suits[i] + '.svg';
		   // console.log(ranks[j] + suits[i]);
			}
		}
	preloadImages(cards);


	//updateGameData();
	if(cookieIsset('clientID')==false) {
		var id = makeid(16);
		document.cookie = "clientID="+id+'; expires=Wed, 1 Apr 2020 00:00:01 UTC';
		storedCookie = id;
		//console.log('neww cook');
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

		if(mySeatData.leavenexthand==true) {
			$('#leaveTable').html('Leaving table next hand');
		}
		else if (mySeatData.leavenexthand==false)
			$('#leaveTable').html('Leave table');
		
		$.each(seats, function(index) {
			if (seats[index]=='empty') {
				$('#player'+index).find('.userid').html('');
				$('#player'+index).find('.balance').html('');
				$('#player'+index).find('#join').css('display','block');
				$('#player'+index).removeClass('actionOn');
				$('#player'+index).removeClass('sittingOut');
				$('#player'+index).addClass('empty');
			}
			if (seats[index]!='empty') {
				$.each(seats[index], function (k,v) {
					$('#player'+index).addClass('seatfull');
					$('#player'+index).removeClass('sittingOut');
					$('#player'+index).removeClass('empty');
					$('#player'+index).find('#join').css('display','none');
					if(seats[index].status=='sittingout') {
						$('#player'+index).removeClass('empty');
						$('#player'+index).addClass('sittingOut');
						$('#player'+index).find('.card1').html("");
						$('#player'+index).find('.card2').html("");
					}

					if(seats[index].moneyOnLine>0) {
					  $('#player'+index).find('#chipsleft').css('visibility','visible');
					  $('#player'+index).find('#chipstop').css('visibility','visible');
					  $('#player'+index).find('#chipsbottom').css('visibility','visible');
					  $('#player'+index).find('#chipsright').css('visibility','visible');
					  $('#player'+index).find('#moneyOnLine').html("$"+seats[index].moneyOnLine);
					}
					else {
					  $('#player'+index).find('#chipsleft').css('visibility','hidden');
					  $('#player'+index).find('#chipstop').css('visibility','hidden');
					  $('#player'+index).find('#chipsbottom').css('visibility','hidden');
					  $('#player'+index).find('#chipsright').css('visibility','hidden');
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
		if(gameData.bettingRound.actionOn==null)
			$('#start').css('display','block');

		//IF GAME IS GOING
		if(gameData.bettingRound.actionOn!=null){
			$('#start').css('display','none');
			

					//SOUNDS
			
				if(gameData.bettingRound.actionOn.hash===myid) {
					yourturnAudio.play();
				}
			
				if(gameData.bettingRound.actionOn.hash!==myid) {
					if(gameData.bettingRound.lastBet==='check')
						checkAudio.play();
					if(gameData.bettingRound.lastBet==='call')
						callAudio.play();
					if(gameData.bettingRound.lastBet==='raise')
						raiseAudio.play();
				}




			//set action on color
			$.each(seats,function(index) {
				if(seats[index].hash===gameData.bettingRound.actionOn.hash)
					$('#player'+index).addClass('actionOn');
				else
					$('#player'+index).removeClass('actionOn');

			 })
			$('#player'+gameData.bettingRound.actionOn.seat).removeClass('empty');
			

			if(gameData.bettingRound.actionOn.hash===myid && gameData.bettingRound.round!=null) {
				//SHOW MY BAR
				$.each(gameData.bettingRound.nextActionsAvailable, function(index) {
					$('#actionBar').find('#'+gameData.bettingRound.nextActionsAvailable[index]).css('display','inline-block');
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
			var totalPot = Number(gameData.bettingRound.potsTotal)+Number(gameData.bettingRound.totalOnLine);
			$('#statusArea').html("Pot $"+totalPot);


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
				if(gameData.board[index]!=null)
					$('#board').append('<img id="theImg" src="img/cards/'+gameData.board[index]+'.svg" width="100%"/>');
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

	socket.on('clockCalled', function(publicData) {
		clockCalled();

	});

	socket.on('update', function(privateData) {
	//console.log("incoming update " + privateData);
		gameData = JSON.parse(privateData);
		seats = gameData.seats;
		console.log(gameData);
		updateGameData(gameData);

	});

	socket.on('logEvent', function(handlog) {
		$('#messages').prepend($('<li>').text(handlog));
		
	});

	socket.on('yourHash', function(myNewid) {
	myid=myNewid;
	console.log("MY ID:"+myid);
	});

});