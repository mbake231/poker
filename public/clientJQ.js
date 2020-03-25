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


function register () {
		var register = {
			gameHash: 'train',
			userid: $('#userid').val(),
			balance: $('#balance').val(),
			status: 'playing',
			seat: $('#seat').val()
		}
		$('#overlay').css('display','none');

		socket.emit('register', register);

		

	}
	function nextHand() {
		socket.emit('nextHand', gameid);
	}

	function startGame() {
		socket.emit('startGame', gameid);
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

	


	function updateGameData(gameData){
		//store MY data
		$.each(seats,function(index) {
			if(seats[index].hash === myid){
				mySeatData = seats[index];
				console.log("MY SEAT "+mySeatData.seat);
			}
		})
		$.each(seats, function(index) {
			if (seats[index]!='empty') {
				$.each(seats[index], function (k,v) {
					$('#player'+index).removeClass('actionOn');
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

			$('#board').html("");
			$.each(gameData.board, function(index) {
				$('#board').append('<img id="theImg" src="img/cards/'+gameData.board[index]+'.svg" width="40%"/>');
		});
			//add pot
			$('#statusArea').html("Pot $"+gameData.currentPot+"<br>Line $"+gameData.bettingRound.totalOnLine);


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
		if(gameData.winner.hand==null) {
				$('.winner').css('visibility','hidden');
		}
		if(gameData.winner.hand!=null) {
			$('.winner').css('visibility','visible');
			$.each(gameData.winner.players, function (index) {
				$('#winner').html(gameData.winner.players[index].userid+" won $"+gameData.winner.winningPot+"with a "+gameData.winner.hand+"!");
				
			})
			
		}

	}

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