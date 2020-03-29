//game.spec.js



const chai = require('chai');
const mocha = require('mocha');
var player = require('../classes/player.js').player;


const game = require('../classes/game').game;




describe('game1', function (){
	it('EVERYONE ALL IN AND GUY OVER BET MASSIVE',function (done){
		let game2 = new game();
		let mike = new player("mike",'cookie',290,'playing','sid');
		let kim = new player("kim",'cookie',400,'playing','sid');
		let shane = new player("shane",'cookie',10000,'playing','sid');
		let kev = new player("kev",'cookie',100,'playing','sid');
		let clint = new player("clint",'cookie',1000,'playing','sid');
		let bob = new player("bob",'cookie',200,'playing','sid');

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

		let mike = new player("mike",'cookie',290,'playing','sid');
		let kim = new player("kim",'cookie',400,'playing','sid');
		let shane = new player("shane",'cookie',1000,'playing','sid');
		let kev = new player("kev",'cookie',100,'playing','sid');
		let clint = new player("clint",'cookie',1000,'playing','sid');
		let bob = new player("bob",'cookie',200,'playing','sid');

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
		let mike = new player("mike",'cookie',1000,'playing','sid');
		let kim = new player("kim",'cookie',1000,'playing','sid');
		let shane = new player("shane",'cookie',1000,'playing','sid');
		let kev = new player("kev",'cookie',100,'playing','sid');
		let clint = new player("clint",'cookie',1000,'playing','sid');
		let bob = new player("bob",'cookie',1000,'playing','sid');

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
})

describe('game2', function (){
	it('fold out on blinds',function (done){
		let game4 = new game();
		let mike = new player("mike",'cookie',290,'playing','sid');
		let kev = new player("kev",'cookie',400,'playing','sid');


		game4.addPlayer(mike,0);
		game4.addPlayer(kev,1);


		game4.setDealer(mike);

			//game4.foldPlayer(bob);
			//game4.foldPlayer(clint);
			//game4.firstRound();

		game4.postBlinds();
		game4.dealHands();
		game4.printSeats();
		game4.getNextAction();
		game4.doAction(kev,'fold');
		game4.printSeats();
		chai.assert.equal(game4.isSettled(),true);
		done();
	})

	it('fold to an all in caller DOES IT END WITH MIKE CALLING THO?',function (done){
		let game4 = new game();
		let mike = new player("mike",'cookie',100,'playing','sid');
		let kev = new player("kev",'cookie',100,'playing','sid');
		let sam = new player("sam",'cookie',100,'playing','sid');


		game4.addPlayer(mike,0);
		game4.addPlayer(kev,1);
		game4.addPlayer(sam,2);


		game4.setDealer(mike);

			//game4.foldPlayer(bob);
			//game4.foldPlayer(clint);
			//game4.firstRound();

		game4.postBlinds();
		game4.dealHands();
		game4.printSeats();
		game4.getNextAction();

		game4.doAction(mike,'call');
		game4.getNextAction();

		game4.doAction(kev,'call');
		game4.getNextAction();

		game4.doAction(sam,'check');
		game4.getNextAction();

		game4.doAction(kev,'raise',98);
		game4.getNextAction();

		game4.doAction(sam,'fold');
		game4.getNextAction();

		chai.assert.notEqual(game4.doAction(mike,'call'),false);
		chai.assert.equal(game4.isSettled(),true);
		done();
	})
});