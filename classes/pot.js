var numMembers=0;

class pot {
	constructor (total) {
		this.total=parseInt(total);
		this.members=[];
		this.winners=[];
		this.numMembers=0;

	}

	addMember(player) {
		this.members.push(player);
		numMembers++;
		//console.log("ADDED "+player.userid);
	}

	removeMember(player) {
		var indexToRemove=999;
		for(var i=0;i<this.members.length;i++) {
			if(this.members[i].hash===player.hash)
				indexToRemove=i;
		}
		if(indexToRemove!=999) {
			this.members.splice(indexToRemove,1);
			//console.log("REMOVED "+player.userid);
		}
		numMembers--;
		return indexToRemove;
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
			console.log("MEMBER "+i+" IS SEAT "+this.members[i].seat);
		}
		for(var i=0;i<this.winners.length;i++){
			console.log("WINNER "+i+" IS SEAT "+this.winners[i].winner.seat);
		}

	}
}
exports.pot = pot;
