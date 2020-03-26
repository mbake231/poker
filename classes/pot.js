/*

when people go all in, we take the smallest raise and make that the amt needed to buy into that pot

we make a new pot and fill that the same way

pot = {amt: num
		members:[]
		}
end of hand

p1 - 10

p2 - 30

p3 - 40

p4 - 30


p1 = smallestNumber (10)
	-if player.onLine)>10 
		--10
		joinpot		

p1 - 0

p2 - 20

p3 - 30

p4 - 20

p2 = smallestNumber (20)
	-if player.onLine)>=20 
		--20
		joinpot	


*/

var numMembers=0;

class pot {
	constructor (total) {
		this.total=Number(total);
		this.members=[];
		this.winners=[];
		this.numMembers=0;

	}

	addMember(player) {
		this.members.push(player);
		numMembers++;
	}

	removeMember(player) {
		var indexToRemove=999;
		for(var i=0;i<this.members.length;i++) {
			if(this.members[i].hash===player.hash)
				indexToRemove=i;
		}
		if(indexToRemove!=999) {
			this.members.splice(indexToRemove,1);
			console.log("REMOVED "+player.userid);
		}
	}

	getMemberByHash(hash){
		for(var i=0;i<this.members.length;i++)
			if(this.members[i].hash===hash)
				return this.members[i];
		return false;
	}

	isMemberByHash(hash){
		for(var i=0;i<this.members.length;i++)
			if(this.members[i].hash===hash)
				return true;
		return false;
	}

	printPot() {
		console.log("Total = $"+this.total);
		for(var i=0;i<this.members.length;i++){
			console.log("MEMBER "+i+"IS SEAT"+this.members[i].seat);
		}
		for(var i=0;i<this.winners.length;i++){
			console.log("WINNER "+i+"IS SEAT"+this.winners[i].winner.seat);
		}

	}
}
exports.pot = pot;
