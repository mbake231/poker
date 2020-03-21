var PlayerArray = [
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""],
	[null,0,"empty","",""]
];


/*PLAYER
[NAME,BALANCE,STATUS,CARDS]
*/

function PlayerList () {

}

function getData(a,b) {
	return PlayerArray[a][b];

}

function setData(a,b,data) {
	PlayerArray[a][b] = data;

}

function addPlayer (seat,name,balance,status) {
	if(name!=null || balance <=0 ) {
		if (PlayerArray[seat][2]=="empty") {
			PlayerArray[seat][0] = name;
			PlayerArray[seat][1] = balance;
			PlayerArray[seat][2] = status;
			return PlayerArray;
		}
	}
	else 
		return false; 
}

function removePlayer (seat) {
	PlayerArray[seat][0] = null;
	PlayerArray[seat][1] = 0;
	PlayerArray[seat][2] = "empty";
}

function changeStatus (seat, status) {
	PlayerArray[seat][2] = status;
	return PlayerArray;

}

function changeBalance (seat, delta) {
	PlayerArray[seat][1] += delta;
	return PlayerArray;

}

function getPlayerList (){
	return PlayerArray;
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.changeStatus = changeStatus;
exports.changeBalance =changeBalance;
exports.getPlayerList = getPlayerList;
exports.getData = getData;
exports.setData = setData;


