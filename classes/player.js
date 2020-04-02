var db = require ('../db.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
ObjectId = require('mongodb').ObjectID;


class player {
	constructor(_id,balance,status,sessionid,userid) {
		this.balance=Number(balance).toFixed(2);;
		this.status=status;
		this.card1=null;
		this.card2=null;
		this.moneyOnLine=0;
		this.nextPlayer=null;
		this.hash=String(_id);
		this.sessionid=sessionid;
		this.sitoutnexthand=false;
		this.leavenexthand=false;	
		this.userid=userid;	 
	}

	async setUserName (_id) {
		const scope=this;
		try {
			MongoClient.connect(url, function(err, db) {
			 const dbo = db.db('pokerDB');
			
			 //Step 1: declare promise
			
			 var myPromise = () => {
			   return new Promise((resolve, reject) => {
			  
				dbo.collection("Users").findOne({"_id":ObjectId(_id)}, function(err, res) {
					   err 
						  ? reject(err) 
						  : resolve(res);
					 });
			   });
			 };
	  
			 //Step 2: async promise handler
			 var callMyPromise = async () => {
				
				var result = await (myPromise());
				//anything here is executed after result is resolved
				console.log('RESULT'+result.name);
				return result.name;
			 };
	   
			 //Step 3: make the call
			 callMyPromise().then(function(result) {
				scope.userid=result;
				
			 });
		  }); //end mongo client
		  return 'done';
		 } catch (e) {
		   next(e)
		 }
		 
	  };
		
	

	


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
