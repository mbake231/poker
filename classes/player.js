var db = require ('../db.js');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/";
ObjectId = require('mongodb').ObjectID;


class player {
	constructor(_id,balance,status,sessionid,userid) {
		this.balance=parseInt(balance);
		this.status=status;
		this.card1=null;
		this.card2=null;
		this.moneyOnLine=parseInt(0);
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
				var dbo=null;
				if(process.env.NODE_ENV == 'production') {
					dbo = db.db('heroku_fbgvjbpl');
				}
				else {
					dbo = db.db('pokerDB');
				
				}
			 
			
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
				//console.log('RESULT'+result.name);
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
		this.balance+=parseInt(amt);
	}

	updateSessionId(newSessionid) {
	//	console.log(this.sessionid +" IS NOW "+newSessionid);
		this.sessionid=newSessionid;
	}

	sitBackDown() {
		this.status='playing';
	}

	setSeat(seat) {
		this.seat=seat;
	}

	addMoneyToLine(amt) {
		this.balance = parseInt(this.balance) - parseInt(amt);
		this.moneyOnLine = parseInt(this.moneyOnLine) + parseInt(amt);
	}

	clearMoneyOnLine(){
		this.moneyOnLine=0;
	}

	hasEnough(amt) {
		//console.log(Number(this.balance)+" vs " +Number(amt));
		if ( parseInt(this.balance)>=parseInt(amt) )
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
