var menuState = {

	create: function() {
		var title = game.add.sprite(game.world.centerX, game.world.centerY - 140, 'title');
		var title_logo = game.add.sprite(game.world.width, game.world.height, 'title_logo');
		title.anchor.setTo(.5, .5);
		title_logo.anchor.setTo(1, 1);

		var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		enterKey.onDown.addOnce(this.start, this);
		var resetKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
		resetKey.onDown.addOnce(this.resetJourney, this);
	},

	start: function() {
		// Start level 1
		game.state.start('playState');
	},

	resetJourney: function() {
		localStorage.setItem('currentLevel', 1);
		console.log('Journey restarted');
	}

};