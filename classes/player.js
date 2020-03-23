/*var player =
{
	userid:null,
	sessionid:null,
	cookie:null,
	balance:0,
	moneyOnLine:0,
	status:"empty",
	card1:null,
	card2:null,
	seat:null,
	nextPlayer:null,
	previousPlayer:null
};

function player(userid,cookie,balance,status) {
	this.userid=userid;
	this.cookie=cookie;
	this.balance=balance;
	this.status=status;
	return player;
}

exports.player = player;

*/
class player {
	constructor(userid,cookie,balance,status) {
		this.userid=userid;
		this.cookie=cookie;
		this.balance=balance.toFixed(2);;
		this.status=status;
		this.card1=null;
		this.card2=null;
		this.moneyOnLine=0;
		//return player;
	}

	setSeat(seat) {
		this.seat=seat;
	}

	addMoneyToLine(amt) {
		this.balance-=amt;
		this.moneyOnLine+=amt;
	}

	hasEnough(amt) {
		if (this.balance>=amt)
			return true;
		return false;
	}
}

exports.player = player;
