var game = {
	players:players[],
	deck:null,
	hand:null,
	numPlayers:0
};

var gamesize = 9;

function game (players,deck,hand) {
	this.players:players;
	this.deck=deck;
	this.hand=hand;
}


function addPlayer(player,seat) {
	if(this.players[seat]==null){
		this.players[seat] = player;
		this.numberPlayers++;
	}
	
	if(this.numPlayers!=1) {
		setNextPlayer(this.players[seat]);

		//find person before them and set it to the new guy
		for(var i=seat;i>=0;i--)
		{
			if(player[i]!=null)
				player[i].nextPlayer=player.
		}
	}
}

function getNextPlayer(player) {
	for (var i=player.seat+1;i<game_size;i++){
		if(players[i]!=null) {
			return players[i];
		}
	}
	for (var i=0;i<player.seat;i++){
		if(players[i]!=null) {
			return players[i];
		}
	}
}

function setNextPlayer (player)
{
	player.nextPlayer = getNextPlayer(player);
}

function printPlayers () {
	for(var i=0;i<game_size;i++) {
		console.log(players[i]);
	}
}