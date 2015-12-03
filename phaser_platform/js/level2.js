(function() {
	var mainState = {
		preload: function() {
			game.load.image('backgroundBlue', 'assets/bg_blue.png');
			game.load.image('backgroundOrange', 'assets/bg_orange.png');
			game.load.image('backgroundPurple', 'assets/bg_purple.png');
			game.load.image('backgroundGreen', 'assets/bg_green.png');
			game.load.image('player', 'assets/player.png');
			game.load.image('ground', 'assets/ground.png');
			game.load.image('tileset', 'assets/tileset.png');
			game.load.image('spikes', 'assets/spikes.png');
			game.load.image('platform', 'assets/platform.png');
			game.load.tilemap('map', 'assets/level3.json', null, Phaser.Tilemap.TILED_JSON);
		},
		create: function() {
			// Start the physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			switch (Math.floor( Math.random() * 4)) {
				case 0:
					this.background = game.add.sprite(0, 0, 'backgroundBlue');
					break;
				case 1:
					this.background = game.add.sprite(0, 0, 'backgroundOrange');
					break;
				case 2:
					this.background = game.add.sprite(0, 0, 'backgroundPurple');
					break;
				case 3:
					this.background = game.add.sprite(0, 0, 'backgroundGreen');
					break;
			}
			
			// Add background
			
			this.background.fixedToCamera = true;

			this.map = game.add.tilemap('map');
		    // Add the tileset to the map
			this.map.addTilesetImage('tileset');
			// Create the layer, by specifying the name of the Tiled layer
			this.blockLayer = this.map.createLayer('blockLayer');
			this.backgroundLayer = this.map.createLayer('backgroundLayer');
			this.spikeLayer = this.map.createLayer('spikesLayer');
			this.invisibleBlockLayer = this.map.createLayer('invisibleBlockLayer');
			this.invisibleBlockLayer.alpha = 0;
			
			// Set the world size to match the size of the layer
			this.blockLayer.resizeWorld();

			// Set collisions
			this.map.setCollision([1,2,3,4,5,6,7,8,9,10], true, this.blockLayer);
			this.map.setCollision([6,7], true, this.spikeLayer);
			this.map.setCollision([6,7,8, 9, 10, 11, 16, 17], true, this.invisibleBlockLayer);

			// Add platforms (horizontal)
			this.platforms = game.add.group();
			this.platforms.enableBody = true;
			this.map.createFromObjects('objectLayer', 1, 'platform', 0, true, false, this.platforms);
			this.platforms.enableBody = true;
			this.platforms.setAll('body.immovable', true);
			this.platforms.setAll('body.bounce.x', 1);
			this.platforms.setAll('body.velocity.x', -120);

			this.vPlatforms = game.add.group();
			this.vPlatforms.enableBody = true;
			this.map.createFromObjects('objectLayer', 2, 'platform', 0, true, false, this.vPlatforms);
			this.vPlatforms.setAll('body.immovable', true);
			this.vPlatforms.setAll('body.bounce.y', 1);
			this.vPlatforms.setAll('body.velocity.y', 120);


			// Add player
			this.player = game.add.sprite(300, game.world.height - 400, 'player');
			this.player.anchor.setTo(.5, .5);

			game.physics.arcade.enable(this.player);

			this.player.enableBody = true;
			this.player.body.drag.setTo(800, 0);
			this.player.body.gravity.y = 700;
			this.player.body.maxVelocity.setTo(380, 500);

			game.camera.follow(this.player);

			this.cursors = game.input.keyboard.createCursorKeys();



		},

		update: function() {
			game.physics.arcade.collide(this.player, this.blockLayer);
			game.physics.arcade.collide(this.player, this.platforms);
			game.physics.arcade.collide(this.player, this.vPlatforms);
			game.physics.arcade.collide(this.blockLayer, this.platforms);
			game.physics.arcade.collide(this.blockLayer, this.vPlatforms);
			game.physics.arcade.collide(this.vPlatforms, this.invisibleBlockLayer);
			game.physics.arcade.collide(this.player, this.spikeLayer, this.playerDie, null, this);

			this.movePlayer();

			// If the player is not in the world anymore
			if (this.player.y > 200 + game.world.height) {
				this.playerDie();
			}
		},

		createWorld: function() {
			

		},

		movePlayer: function() {
			if (this.cursors.left.isDown) {
				this.player.body.acceleration.x = -800;
			} else if (this.cursors.right.isDown) {
				this.player.body.acceleration.x = 800;
			} else {
				this.player.body.acceleration.x = 0;
			}

			if ( (this.cursors.up.isDown && this.player.body.onFloor()) || (this.cursors.up.isDown && this.player.body.touching.down)) {
				this.player.body.velocity.y = -450;
			}
		},

		playerDie: function() {
			this.player.x = 300;
			this.player.y = game.world.height - 400;
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
		}
	};

	var game = new Phaser.Game(720, 480, Phaser.AUTO, 'gameDiv');
	game.state.add('main', mainState);
	game.state.start('main');
})();