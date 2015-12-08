var loadState = {

	preload: function() {
		var progressBar = game.add.sprite(0, game.world.height - 15, 'progressBar');
		game.load.setPreloadSprite(progressBar);

		var loadLogo = game.add.sprite(game.world.centerX, game.world.centerY, 'loadLogo');
		loadLogo.anchor.setTo(.5, .5);

		// Load the assets for the game
		game.load.image('backgroundBlue', 'assets/bg_blue.png');
		game.load.image('backgroundOrange', 'assets/bg_orange.png');
		game.load.image('backgroundPurple', 'assets/bg_purple.png');
		game.load.image('backgroundGreen', 'assets/bg_green.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('title_logo', 'assets/background_logo.png');
		game.load.image('player', 'assets/player.png');
		game.load.image('tileset', 'assets/tileset.png');
		game.load.image('platform', 'assets/platform.png');

		for (var i = 0; i < game.global.maxLevels; i++) {
			if ((i+1).toString().length > 1) {
				game.load.tilemap('level' + (i+1), 'assets/maps/level_' + (i+1) + '.json', null, Phaser.Tilemap.TILED_JSON);
			} else {
				game.load.tilemap('level0' + (i+1), 'assets/maps/level_0' + (i+1) + '.json', null, Phaser.Tilemap.TILED_JSON);	
			}
			
		}
	},

	create: function() {
		game.state.start('menuState');
	}
};