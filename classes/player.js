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
	constructor(userid,cookie,balance,status,sessionid) {
		this.userid=userid;
		this.cookie=cookie;
		this.balance=balance.toFixed(2);;
		this.status=status;
		this.card1=null;
		this.card2=null;
		this.moneyOnLine=0;
		this.nextPlayer=null;
		this.hash=this.makeid(16);
		this.sessionid=sessionid;
		this.sitoutnexthand=false;
		//return player;
	}

	toggleSitOut(){
		if(this.sitoutnexthand==false)
			this.sitoutnexthand=true;

		else if(this.sitoutnexthand==true)
			this.sitoutnexthand=false;
	}

	givePot(amt) {
		this.balance+=Number(amt);
	}

	updateSessionId(newSessionid) {
		console.log(this.sessionid +" IS NOW "+newSessionid);
		this.sessionid=newSessionid;
	}

	setSeat(seat) {
		this.seat=seat;
	}

	addMoneyToLine(amt) {
		this.balance-=amt;
		this.moneyOnLine+=amt;
	}

	clearMoneyOnLine(){
		this.moneyOnLine=0;
	}

	hasEnough(amt) {
		//console.log(Number(this.balance)+" vs " +Number(amt));
		if ( Number(this.balance)>=Number(amt) )
			return true;
		return false;
	}
	makeid(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
   		return result;
	}

}

exports.player = player;
