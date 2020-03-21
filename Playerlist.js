/*var PlayerArray = [
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""]
];*/

var PlayerArray = [
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null}
];



/*PLAYER
[NAME,BALANCE,STATUS,CARDS]
*/



function getPlayer(seat) {
	return PlayerArray[seat];

}



function addPlayer (seat,userid,balance,status,sessionid,cookie) {
	if(userid!=null && balance >=0 ) {
		if (PlayerArray[seat].status=="empty") {
			PlayerArray[seat].userid = userid;
			PlayerArray[seat].balance = balance;
			PlayerArray[seat].status = status;
			PlayerArray[seat].sessionid = sessionid;
			PlayerArray[seat].cookie = cookie;
			//return PlayerArray;
		}
	}
	else 
		return false; 
}


function removePlayer (seat) {
	PlayerArray[seat].userid = null;
	PlayerArray[seat].balance = null;
	PlayerArray[seat].status = "empty";
}

function changeStatus (seat, newstatus) {
	PlayerArray[seat].status = newstatus;
	//return PlayerArray;

}

function changeBalance (seat, delta) {
	PlayerArray[seat].balance += delta;
	//return PlayerArray;

}

function setCardOne (seat, card) {
	console.log(card);
	PlayerArray[seat].card1 = card;
	//return PlayerArray;

}

function setCardTwo (seat, card) {
	PlayerArray[seat].card2 = card;
	//return PlayerArray;

}

function getPlayerList (){
	return PlayerArray;
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.changeStatus = changeStatus;
exports.changeBalance =changeBalance;
exports.getPlayerList = getPlayerList;
exports.getPlayer = getPlayer;
exports.setCardOne = setCardOne;
exports.setCardTwo = setCardTwo;

