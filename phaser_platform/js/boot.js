var bootState = {

	preload: function() {
		game.load.image('loadLogo', 'assets/load_logo.png');
		game.load.image('progressBar', 'assets/load_bar.png');
	},

	create: function() {
		// Set the background color
		game.stage.backgroundColor = "#1a1a1a";

		// Start the physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Start the load state
		game.state.start('loadState');
	}
};