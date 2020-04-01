//game.spec.js
const chai = require('chai');
const mocha = require('mocha');
var player = require('../classes/player.js').player;
const game = require('../classes/game.js').game;

describe('game1', function (){
	it('EVERYONE ALL IN AND GUY OVER BET MASSIVE',function (done){
		let game2 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",290,'playing','sid');
		let kim = new player("5e83aa2c8391902cc37073b9",400,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",10000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",100,'playing','sid');
		let clint = new player("5e83ad4c4e56222def2e3148",1000,'playing','sid');
		let bob = new player("5e83ad6a0a60bc2e134b1baf",200,'playing','sid');

		game2.addPlayer(mike,0);
		game2.addPlayer(kim,1);
		game2.addPlayer(shane,2);
		game2.addPlayer(kev,3);
		game2.addPlayer(clint,4);
		game2.addPlayer(bob,8);

		game2.setDealer(mike);

		//game2.foldPlayer(bob);
		//game2.foldPlayer(clint);
		//game2.firstRound();

		game2.postBlinds();
		game2.dealHands();
		game2.printSeats();
		game2.getNextAction();
		game2.doAction(kev,'raise',98);
		game2.printSeats();
		game2.getNextAction();
		game2.doAction(clint,'call');
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(bob,'raise',100);
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(mike,'call');
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(kim,'raise',100);
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(shane,'raise',5000);
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(clint,'call');
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(mike,'call');
		game2.printSeats();
		game2.printGamePots();
		game2.getNextAction();
		game2.printSeats();
		game2.doAction(kim,'call');
		//7290
		//game2.printGamePots();
		game2.printSeats();

		chai.assert.equal(game2.isSettled(),true);
		done();
	})

	it('this game should settle with allins and an ending fold',function (done){
		let game1 = new game();

		let mike = new player("5e83a80f4aeeda2c0a258d4f",290,'playing','sid');
		let kim = new player("5e83aa2c8391902cc37073b9",400,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",1000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",100,'playing','sid');
		let clint = new player("5e83ad4c4e56222def2e3148",1000,'playing','sid');
		let bob = new player("5e83ad6a0a60bc2e134b1baf",200,'playing','sid');

		game1.addPlayer(mike,0);
		game1.addPlayer(kim,1);
		game1.addPlayer(shane,2);
		game1.addPlayer(kev,3);
		game1.addPlayer(clint,4);
		game1.addPlayer(bob,8);

		game1.setDealer(mike);

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

		game1.postBlinds();
		game1.dealHands();
		game1.printSeats();
		game1.getNextAction();
		game1.doAction(kev,'raise',98);
		game1.printSeats();
		game1.getNextAction();
		game1.doAction(clint,'call');
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(bob,'raise',100);
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'raise',100);
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(shane,'call');
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(clint,'call');
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(mike,'call');
		game1.printSeats();
		game1.printGamePots();
		game1.getNextAction();
		game1.printSeats();
		game1.doAction(kim,'raise',10);
		game1.getNextAction();

		game1.doAction(shane,'call');
		game1.getNextAction();

		game1.doAction(clint,'call');
		game1.getNextAction();
		game1.doAction(kim,'raise',10);
		game1.getNextAction();
		game1.doAction(shane,'fold');
		game1.getNextAction();
		game1.doAction(clint,'fold');
		game1.printSeats();
		game1.getNextAction();

		chai.assert.equal(game1.isSettled(),true);
		done();
	})



	it('all in that gets fold on',function (done){
		let game3 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",1000,'playing','sid');
		let kim = new player("5e83aa2c8391902cc37073b9",1000,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",1000,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",100,'playing','sid');
		let clint = new player("5e83ad4c4e56222def2e3148",1000,'playing','sid');
		let bob = new player("5e83ad6a0a60bc2e134b1baf",1000,'playing','sid');

		game3.addPlayer(mike,0);
		game3.addPlayer(kim,1);
		game3.addPlayer(shane,2);
		game3.addPlayer(kev,3);
		game3.addPlayer(clint,4);
		game3.addPlayer(bob,8);

		game3.setDealer(mike);

		//game3.foldPlayer(bob);
		//game3.foldPlayer(clint);
		//game3.firstRound();

		game3.postBlinds();
		game3.dealHands();
		game3.printSeats();
		game3.getNextAction();
		game3.doAction(kev,'raise',98);
		game3.printSeats();
		game3.getNextAction();
		game3.doAction(clint,'call');
		game3.getNextAction();
		game3.printSeats();
		game3.doAction(bob,'call');
		game3.getNextAction();
		game3.printSeats();
		game3.doAction(mike,'call');
		game3.getNextAction();
		game3.printSeats();
		game3.doAction(kim,'call');
		game3.getNextAction();
		game3.printSeats();
		game3.doAction(shane,'call');
		game3.getNextAction();

		game3.printSeats();
		game3.doAction(kim,'raise',10);
		game3.getNextAction();

		game3.doAction(shane,'fold');
		game3.getNextAction();

		game3.doAction(clint,'fold');
		game3.getNextAction();
		game3.doAction(bob,'fold');
		game3.getNextAction();
		game3.doAction(mike,'fold');
		game3.getNextAction();
		game3.printSeats();

		chai.assert.equal(game3.isSettled(),true);
		done();
	})
/*
	it('title',function (done){

		chai.assert.equal(game1.isSettled(),true);
		done();
	})
*/



	it('fold out on blinds',function (done){
		let game1 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",290,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",400,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);


		game1.setDealer(mike);

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

		game1.postBlinds();
		game1.dealHands();
		game1.printSeats();
		game1.getNextAction();
		game1.doAction(kev,'fold');
		game1.printSeats();
		chai.assert.equal(game1.isSettled(),true);
		done();
	})

	it('fold to an all in caller DOES IT END WITH MIKE CALLING THO?',function (done){
		let game1 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",100,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",100,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",100,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);
		game1.addPlayer(shane,2);


		game1.setDealer(mike);

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

		game1.postBlinds();
		game1.dealHands();
		game1.printSeats();
		game1.getNextAction();

		game1.doAction(mike,'call');
		game1.getNextAction();

		game1.doAction(kev,'call');
		game1.getNextAction();

		game1.doAction(shane,'check');
		game1.getNextAction();

		game1.doAction(kev,'raise',98);
		game1.getNextAction();

		game1.doAction(shane,'fold');
		game1.getNextAction();

		chai.assert.notEqual(game1.doAction(mike,'call'),false);
		chai.assert.equal(game1.isSettled(),true);
		done();
	})
	it('short stack allin is shoved on top of by a big stack all-iner',function (done){

	let game1 = new game();
	let mike = new player("5e83a80f4aeeda2c0a258d4f",105,'playing','sid');
	let kev = new player("5e83ab2844d4db2d4038c095",92,'playing','sid');


	game1.addPlayer(mike,0);
	game1.addPlayer(kev,1);



	game1.setDealer(mike);

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

	game1.postBlinds();
	game1.dealHands();
	game1.printSeats();
	game1.getNextAction();

	game1.doAction(kev,'call');
	game1.getNextAction();

	game1.doAction(mike,'check');
	game1.getNextAction();
	game1.printSeats();

	game1.doAction(kev,'raise',90);
	game1.getNextAction();
	game1.printSeats();

	game1.doAction(mike,'call',13);
	game1.getNextAction();
	game1.printSeats();
		chai.assert.equal(mike.moneyOnLine,0);
		chai.assert.equal(game1.isSettled(),true);
		done();
	})

	it('boring check game',function (done){
		let game1 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",100,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",100,'playing','sid');
		let shane = new player("5e83aa9a64ca552d1437f9f3",100,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);
		game1.addPlayer(shane,2);


		game1.setDealer(mike);

			//game1.foldPlayer(bob);
			//game1.foldPlayer(clint);
			//game1.firstRound();

		game1.postBlinds();
		game1.dealHands();
		game1.printSeats();
		game1.getNextAction();

		game1.doAction(mike,'call');
		game1.getNextAction();

		game1.doAction(kev,'call');
		game1.getNextAction();

		game1.doAction(shane,'check');
		game1.getNextAction();

		game1.doAction(kev,'check',98);
		game1.getNextAction();

		game1.doAction(shane,'check');
		game1.getNextAction();

		game1.doAction(mike,'check');
		game1.getNextAction();

		game1.doAction(kev,'check',98);
		game1.getNextAction();

		game1.doAction(shane,'check');
		game1.getNextAction();

		game1.doAction(mike,'check');
		game1.getNextAction();

		game1.doAction(kev,'check',98);
		game1.getNextAction();

		game1.doAction(shane,'check');
		game1.getNextAction();

		game1.doAction(mike,'check');
		game1.getNextAction();

		chai.assert.equal(game1.isSettled(),true);
		done();
	})

	it('ensure all-in caller can only call or fold', function (done) {
		
		let game1 = new game();
		let mike = new player("5e83a80f4aeeda2c0a258d4f",100,'playing','sid');
		let kev = new player("5e83ab2844d4db2d4038c095",50,'playing','sid');


		game1.addPlayer(mike,0);
		game1.addPlayer(kev,1);



		game1.setDealer(mike);

		//game1.foldPlayer(bob);
		//game1.foldPlayer(clint);
		//game1.firstRound();

		game1.postBlinds();
		game1.dealHands();
		game1.printSeats();
		game1.getNextAction();

		game1.doAction(kev,'call');
		game1.getNextAction();

		game1.doAction(mike,'check');
		game1.getNextAction();


		game1.doAction(kev,'raise',48);
		
		game1.getNextAction();
		
		var call = game1.getNextActionsAvailable()[0];
		var fold = game1.getNextActionsAvailable()[1];

		chai.assert.equal(call,'call');
		chai.assert.equal(fold,'fold');
		done();
	})
	
});