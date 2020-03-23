


var cards = new Array(52);

class deck {
		constructor () {
		//BUILD
		var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K");
	    var suits = new Array("c", "d", "h", "s");
	    var i, j;
	    for (i = 0; i < suits.length; i++) {
	        for (j = 0; j < ranks.length; j++) {
	            cards[i*ranks.length + j] = ranks[j] + suits[i];
	           // console.log(ranks[j] + suits[i]);
	     	   }
	    	}
	    	this.shuffleDeck();
	    	this.shuffleDeck();
		}

		shuffleDeck() {
			var j, x, i;
		    for (i = cards.length - 1; i > 0; i--) {
		        j = Math.floor(Math.random() * (i + 1));
		        x = cards[i];
		        cards[i] = cards[j];
		        cards[j] = x;
		    }
		}

		dealCard () {
			var cardToDeal = cards[0];

			for (var i=0;i<cards.length-2;i++){
				cards[i] = cards[i+1]
			}
			return cardToDeal;
		}
}


exports.deck = deck;