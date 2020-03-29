




class deck {
		constructor () {
		//BUILD
		this.cards = new Array(52);
		this.ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K");
	    this.suits = new Array("c", "d", "h", "s");
	    var i, j;
	    for (i = 0; i < this.suits.length; i++) {
	        for (j = 0; j < this.ranks.length; j++) {
	            this.cards[i*this.ranks.length + j] = this.ranks[j] + this.suits[i];
	           // console.log(ranks[j] + suits[i]);
	     	   }
	    	}
	    	this.shuffleDeck();
	    	this.shuffleDeck();
		}

		shuffleDeck() {
			var j, x, i;
		    for (i = this.cards.length - 1; i > 0; i--) {
		        j = Math.floor(Math.random() * (i + 1));
		        x = this.cards[i];
		        this.cards[i] = this.cards[j];
		        this.cards[j] = x;
		    }
		}

		dealCard () {
			this.cardToDeal = this.cards[0];

			for (var i=0;i<this.cards.length-2;i++){
				this.cards[i] = this.cards[i+1]
			}
			return this.cardToDeal;
		}
}


exports.deck = deck;