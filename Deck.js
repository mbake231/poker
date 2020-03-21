

function makeDeck() {
	var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K");
    var suits = new Array("c", "d", "h", "s");
    var deck = new Array(52);
    var i, j;
    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < ranks.length; j++) {
            deck[i*ranks.length + j] = ranks[j] + suits[i];
           // console.log(ranks[j] + suits[i]);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
	var j, x, i;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }
    //console.log(deck);
    return deck;
}

function getDeck() {
    var deck = makeDeck();
    var shuffledDeck = shuffleDeck(deck);
    var twiceShuffledDeck = shuffleDeck(shuffledDeck);
    return twiceShuffledDeck;
}

exports.getDeck = getDeck;