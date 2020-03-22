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
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null},
	{	userid:null,
		balance:0,
		status:"empty",
		card1:null,
		card2:null,
		sessionid:null,
		cookie:null,
		seat:null}
];



/*PLAYER
[NAME,BALANCE,STATUS,CARDS]
*/



function getPlayer(seat) {
	return PlayerArray[seat];

}



function addPlayer (seat,userid,balance,status,sessionid,cookie) {
	if(userid!=null && balance >=0 ) {
		if (PlayerArray[seat].status == "empty") {
			PlayerArray[seat].userid = userid;
			PlayerArray[seat].balance = balance;
			PlayerArray[seat].status = status;
			PlayerArray[seat].sessionid = sessionid;
			PlayerArray[seat].cookie = cookie;
			PlayerArray[seat].seat = seat;
			return true;
		}
		else 
			console.log("seat full");
	}
	 
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

function changeSessionID (seat, sessionid) {
	PlayerArray[seat].sessionid = sessionid;
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

function getPublicPlayerData () {
	var publicPlayerData = [];
	for (var i=0;i<9;i++)
		publicPlayerData.push(
			{userid:getPlayer(i).userid,
			balance:getPlayer(i).balance,
			status:getPlayer(i).status,
			seat:getPlayer(i).seat
		});
	return publicPlayerData;
}

function getPrivatePlayerData (player) {
	
	var privateData = {userid:player.userid,
			sessionid:player.sessionid,
			card1:player.card1,
			card2:player.card2
		};

	return privateData;
}

function findPlayerByCookie (cookieToFind) {



	for (var i=0; i<9;i++) {
		if(parseInt(getPlayer(i).cookie) == cookieToFind)
			return getPlayer(i);
	}
	console.log("no player found by cookie "+cookieToFind);
	return false;
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.changeStatus = changeStatus;
exports.changeBalance =changeBalance;
exports.getPlayerList = getPlayerList;
exports.getPlayer = getPlayer;
exports.setCardOne = setCardOne;
exports.setCardTwo = setCardTwo;
exports.findPlayerByCookie = findPlayerByCookie;

exports.changeSessionID = changeSessionID;
exports.getPublicPlayerData = getPublicPlayerData;
exports.getPrivatePlayerData = getPrivatePlayerData;

