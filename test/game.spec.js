//game.spec.js
const chai = require('chai');
const mocha = require('mocha');
var player = require('../classes/player.js').player;
var game = require('../classes/game.js').game;

describe('game1', function (){

this.timeout(7000);
	it('EVERYONE ALL IN AND GUY OVER BET MASSIVE',function (done){


		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",29000,'playing','sid',"mike");
		let kim = new player("5e83aa2c8391902cc37073b9",40000,'playing','sid',"kim");
		let shane = new player("5e83aa9a64ca552d1437f9f3",1000000,'playing','sid',"shane");
		let kev = new player("5e83ab2844d4db2d4038c095",10000,'playing','sid',"kev");
		let clint = new player("5e83ad4c4e56222def2e3148",100000,'playing','sid',"clint");
		let bob = new player("5e83ad6a0a60bc2e134b1baf",20000,'playing','sid',"bob");
		
		game1.addPlayer(mike,0);
		game1.addPlayer(kim,1);
		game1.addPlayer(shane,2);
		game1.addPlayer(kev,3);
		game1.addPlayer(clint,4);
		game1.addPlayer(bob,8);

		//game1.setDealer(mike);

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

		game1.startGame();
		//game1.printSeats();
		//////game1.getNextAction();
		game1.doAction(kev,'raise',9800);
		game1.printSeats();
		////game1.getNextAction();
		game1.doAction(clint,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(bob,'raise',10000);
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'raise',10000);
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(shane,'raise',500000);
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(clint,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		game1.printSeats();
		game1.printGamePots();
	//	////game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'call');
		//7290
		//game1.printGamePots();
			

		
				chai.assert.equal(game1.isSettled(),true);

				

				chai.assert.equal(
				mike.balance+
				kim.balance+
				shane.balance+
				kev.balance+
				clint.balance+
				bob.balance,
				29000+40000+1000000+10000+100000+20000
				);





				done();
		
	
     		 
   		
	})

	it('this game should settle with allins and an ending fold',function (done){
		let game1 = new game('test');

		let mike = new player("5e83a80f4aeeda2c0a258d4f",29000,'playing','sid');
		let kim = new player("5e83aa2c8391902cc37073b9",40000,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",100000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",10000,'playing','sid');
		let clint = new player("5e83ad4c4e56222def2e3148",100000,'playing','sid');
		let bob = new player("5e83ad6a0a60bc2e134b1baf",20000,'playing','sid');

		game1.addPlayer(mike,0);
		game1.addPlayer(kim,1);
		game1.addPlayer(shane,2);
		game1.addPlayer(kev,3);
		game1.addPlayer(clint,4);
		game1.addPlayer(bob,8);
		game1.startGame();
		//game1.setDealer(mike);

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

		//game1.postBlinds();
		//game1.dealHands();
		game1.printSeats();
		//////game1.getNextAction();
		game1.doAction(kev,'raise',9800);
		game1.printSeats();
		//////game1.getNextAction();
		game1.doAction(clint,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(bob,'raise',10000);
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'raise',10000);
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(shane,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(clint,'call');
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		game1.printSeats();
		game1.printGamePots();
		//////game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'raise',1000);
		//////game1.getNextAction();

		game1.doAction(shane,'call');
		//////game1.getNextAction();

		game1.doAction(clint,'call');
		//////game1.getNextAction();
		game1.doAction(kim,'raise',1000);
		//////game1.getNextAction();
		game1.doAction(shane,'fold');
		//////game1.getNextAction();
		game1.doAction(clint,'fold');
		game1.printSeats();
		//////game1.getNextAction();


		chai.assert.equal(game1.isSettled(),true);
		chai.assert.equal(
			mike.balance+
			kim.balance+
			shane.balance+
			kev.balance+
			clint.balance+
			bob.balance,
			29000+40000+100000+10000+100000+20000
			);


		done();

	})



	it('all in that gets fold on',function (done){
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",100000,'playing','sid');
		let kim = new player("5e83aa2c8391902cc37073b9",100000,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",100000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",10000,'playing','sid');
		let clint = new player("5e83ad4c4e56222def2e3148",100000,'playing','sid');
		let bob = new player("5e83ad6a0a60bc2e134b1baf",100000,'playing','sid');
		
		game1.addPlayer(mike,0);
		game1.addPlayer(kim,1);
		game1.addPlayer(shane,2);
		game1.addPlayer(kev,3);
		game1.addPlayer(clint,4);
		game1.addPlayer(bob,8);

		game1.startGame();

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

		
		game1.printSeats();
		//game1.getNextAction();
		game1.doAction(kev,'raise',9800);
		game1.printSeats();
		//game1.getNextAction();
		game1.doAction(clint,'call');
		//game1.getNextAction();
		game1.printSeats();
		game1.doAction(bob,'call');
		//game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		//game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'call');
		//game1.getNextAction();
		game1.printSeats();
		game1.doAction(shane,'call');
		//game1.getNextAction();

		game1.printSeats();
		game1.doAction(kim,'raise',1000);
		//game1.getNextAction();

		game1.doAction(shane,'fold');
		//game1.getNextAction();

		game1.doAction(clint,'fold');
		//game1.getNextAction();
		game1.doAction(bob,'fold');
		//game1.getNextAction();
		game1.doAction(mike,'fold');
		//game1.getNextAction();
		game1.printSeats();

		chai.assert.equal(game1.isSettled(),true);
		chai.assert.equal(
			mike.balance+
			kim.balance+
			shane.balance+
			kev.balance+
			clint.balance+
			bob.balance,
			(100000*5)+10000
			);

		
		done();
	})




	it('fold out on blinds',function (done){
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",29000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",40000,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);


		game1.startGame();

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

	
		game1.printSeats();
		//////game1.getNextAction();
		game1.doAction(kev,'fold');
		game1.printSeats();
		chai.assert.equal(game1.isSettled(),true);
		chai.assert.equal(
			mike.balance+
			kev.balance,
			29000+40000
			);
		done();
	})

	it('fold to an all in caller DOES IT END WITH MIKE CALLING THO?',function (done){
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",10000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",10000,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",10000,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);
		game1.addPlayer(shane,2);


		game1.startGame();

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

	
		game1.printSeats();
		//////game1.getNextAction();

		game1.doAction(mike,'call');
		//////game1.getNextAction();

		game1.doAction(kev,'call');
		//////game1.getNextAction();

		game1.doAction(shane,'check');
		//////game1.getNextAction();

		game1.doAction(kev,'raise',9800);
		//////game1.getNextAction();

		game1.doAction(shane,'fold');
		//////game1.getNextAction();
		game1.doAction(mike,'call');

		//chai.assert.notEqual(game1.doAction(mike,'call'),false);
		//chai.assert.equal(game1.getLastBet(),'call');
		chai.assert.equal(game1.isSettled(),true);

		chai.assert.equal(
			mike.balance+
			kev.balance+
			shane.balance,
			10000*3
			);

		done();
	})
	it('short stack allin is shoved on top of by a big stack all-iner',function (done){

	let game1 = new game('test');
	let mike = new player("5e83a80f4aeeda2c0a258d4f",10500,'playing','sid');
	let kev = new player("5e83ab2844d4db2d4038c095",9200,'playing','sid');


	game1.addPlayer(mike,0);
	game1.addPlayer(kev,1);



	game1.startGame();

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();


	game1.printSeats();
	//////game1.getNextAction();

	game1.doAction(kev,'call');
	//////game1.getNextAction();

	game1.doAction(mike,'check');
	//////game1.getNextAction();
	game1.printSeats();

	game1.doAction(kev,'raise',9000);
	//////game1.getNextAction();
	game1.printSeats();

	game1.doAction(mike,'call',1300);
	//////game1.getNextAction();
	game1.printSeats();


		chai.assert.equal(mike.moneyOnLine,0);
		chai.assert.equal(
			mike.balance+
			kev.balance,
			10500+9200
			);
		chai.assert.equal(game1.isSettled(),true);
		done();
	})

	it('boring check game',function (done){
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",10000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",10000,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",10000,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);
		game1.addPlayer(shane,2);


		game1.startGame();

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

	
		game1.printSeats();
		//////game1.getNextAction();

		game1.doAction(mike,'call');
		//////game1.getNextAction();

		game1.doAction(kev,'call');
		//////game1.getNextAction();

		game1.doAction(shane,'check');
		//////game1.getNextAction();

		game1.doAction(kev,'check',9800);
		//////game1.getNextAction();

		game1.doAction(shane,'check');
		//////game1.getNextAction();

		game1.doAction(mike,'check');
		//////game1.getNextAction();

		game1.doAction(kev,'check',9800);
		//////game1.getNextAction();

		game1.doAction(shane,'check');
		//////game1.getNextAction();

		game1.doAction(mike,'check');
		//////game1.getNextAction();

		game1.doAction(kev,'check',9800);
		//////game1.getNextAction();

		game1.doAction(shane,'check');
		//////game1.getNextAction();

		game1.doAction(mike,'check');
		//////game1.getNextAction();

		chai.assert.equal(game1.isSettled(),true);
		chai.assert.equal(
			mike.balance+
			kev.balance+
			shane.balance,
			10000*3
			);
		done();
	})

	it('ensure all-in caller can only call or fold', function (done) {
		
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",10000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",5000,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);



		game1.startGame();

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

	
		game1.printSeats();
		//////game1.getNextAction();

		game1.doAction(kev,'call');
		//////game1.getNextAction();

		game1.doAction(mike,'check');
		//////game1.getNextAction();


		game1.doAction(kev,'raise',4800);
		
		//////game1.getNextAction();
		
		var call = game1.getNextActionsAvailable()[0];
		var fold = game1.getNextActionsAvailable()[1];

		chai.assert.equal(call,'call');
		chai.assert.equal(fold,'fold');
		done();
	})
	it('call clock', function (done) {
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",10000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",5000,'playing','sid');

		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);

		game1.startGame();

		game1.printSeats();

		game1.doAction(kev,'call');

		game1.doAction(mike,'check');

		game1.callClock();

		setTimeout(function(){
			chai.assert.equal(game1.isSettled(),true);

			chai.assert.equal(
				mike.balance+
				kev.balance,
				10000+5000
				);

			done();
		}, 6000)
		
	
	})
	it('ensureing fold  on irver works due to a bug', function (done) {
		let game1 = new game('test');
		let mike = new player("5e83a80f4aeeda2c0a258d4f",4200,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",5000,'playing','sid');

		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);

		game1.startGame();

		game1.printSeats();

		game1.doAction(kev,'call');

		game1.doAction(mike,'check');

		game1.doAction(kev,'raise', 10);

		game1.doAction(mike,'call');

		game1.doAction(kev,'check');

		game1.doAction(mike,'check');

		game1.doAction(kev,'raise',100);


		game1.doAction(mike,'fold');
		chai.assert.equal(game1.isSettled(),true);

		chai.assert.equal(
			mike.balance+
			kev.balance,
			4200+5000
			);

			done();
		
	
	})
});