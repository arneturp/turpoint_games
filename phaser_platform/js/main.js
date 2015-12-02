(function() {
	var mainState = {
		preload: function() {
			game.load.image('background', 'assets/bg_orange.png');
			game.load.image('player', 'assets/player.png');
			game.load.image('ground', 'assets/ground.png');
			game.load.image('tileset', 'assets/tileset.png');
			game.load.image('spikes', 'assets/spikes.png');
			game.load.tilemap('map', 'assets/map5.json', null, Phaser.Tilemap.TILED_JSON);
		},
		create: function() {
			// Start the physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			// Add background
			this.background = game.add.sprite(0, 0, 'background');
			this.background.fixedToCamera = true;

			this.map = game.add.tilemap('map');
		    // Add the tileset to the map
			this.map.addTilesetImage('tileset');
			// Create the layer, by specifying the name of the Tiled layer
			this.blockLayer = this.map.createLayer('blockLayer');
			this.backgroundLayer = this.map.createLayer('backgroundLayer');
			this.spikeLayer = this.map.createLayer('spikeLayer');
			
			// Set the world size to match the size of the layer
			this.blockLayer.resizeWorld();

			this.map.setCollision([1,2,3,4,5], true, this.blockLayer);
			this.map.setCollision([1,2,3,4], true, this.spikeLayer);


			// Add player
			this.player = game.add.sprite(170, game.world.height - 380, 'player');
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

			if (this.cursors.up.isDown && this.player.body.onFloor()) {
				this.player.body.velocity.y = -450;
			}
		},

		playerDie: function() {
			this.player.x = 170;
			this.player.y = game.world.height - 380;
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
		}
	};

	var game = new Phaser.Game(720, 480, Phaser.AUTO, 'gameDiv');
	game.state.add('main', mainState);
	game.state.start('main');
})();