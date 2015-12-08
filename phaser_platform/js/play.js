	var playState = {
		create: function() {
			self = this;
			// Game constants
			this.VERTICALPLATFORMSPEED = 140;
			this.HORIZONTALPLATFORMSPEED = 220;
			this.PLAYERACCELERATION = 800;
			this.PLAYERDRAG = 800;
			this.PLAYERGRAVITY = 700;
			this.PLAYERMAXVELOCITYX = 380;
			this.PLAYERMAXVELOCITYY = 500;
			this.MAXLEVELS = game.global.maxLevels;

			// Add background
			this.setBackground();
			this.background.fixedToCamera = true;

			// Get the current level

			this.currentLevel = this.getCurrentLevel();
			this.getLevelMap(this.currentLevel);

			

		    // Add the tileset to the map
			this.map.addTilesetImage('tileset');
			// Create the layer, by specifying the name of the Tiled layer
			this.blockLayer = this.map.createLayer('blockLayer');
			this.backgroundLayer = this.map.createLayer('backgroundLayer');
			this.spikeLayer = this.map.createLayer('spikeLayer');
			this.ladderLayer = this.map.createLayer('ladderLayer');
			this.doorLayer = this.map.createLayer('doorLayer');
			this.invisibleBlockLayer = this.map.createLayer('invisibleBlockLayer');
			this.invisibleBlockLayer.alpha = 0;
				
			if (this.ladderLayer != null) {
				this.map.setTileIndexCallback(19, this.climbLadder, null, 'ladderLayer');
			}
			

			// Set the world size to match the size of the layer
			this.blockLayer.resizeWorld();

			

			// Set collisions
			this.map.setCollision([1,2,3,4,5,6,7,8,9,10], true, this.blockLayer);
			this.map.setCollision([6,7, 8, 9], true, this.spikeLayer);
			this.map.setCollision([6,7,8, 9, 10, 11, 16, 17], true, this.invisibleBlockLayer);
			this.map.setCollision([18], true, this.doorLayer);
			this.map.setCollision([19], true, this.ladderLayer);

			// Add platforms (horizontal)
			this.platforms = game.add.group();
			this.platforms.enableBody = true;
			this.map.createFromObjects('objectLayer', 1, 'platform', 0, true, false, this.platforms);
			this.platforms.enableBody = true;
			this.platforms.setAll('body.immovable', true);
			this.platforms.setAll('body.bounce.x', 1);
			this.platforms.setAll('body.velocity.x', this.VERTICALPLATFORMSPEED);

			this.vPlatforms = game.add.group();
			this.vPlatforms.enableBody = true;
			this.map.createFromObjects('objectLayer', 2, 'platform', 0, true, false, this.vPlatforms);
			this.vPlatforms.setAll('body.immovable', true);
			this.vPlatforms.setAll('body.bounce.y', 1);
			this.vPlatforms.setAll('body.velocity.y', this.HORIZONTALPLATFORMSPEED);

			

			// Add player
			this.player = game.add.sprite(300, game.world.height - 400, 'player');
			this.player.anchor.setTo(0.5, 0.5);

			game.physics.arcade.enable(this.player);

			this.player.enableBody = true;
			this.player.body.drag.setTo(this.PLAYERDRAG, 0);
			this.player.body.gravity.y = this.PLAYERGRAVITY;
			this.player.body.maxVelocity.setTo(this.PLAYERMAXVELOCITYX, this.PLAYERMAXVELOCITYY);
			this.player.dead = false;
			game.camera.follow(this.player);

			// Add levelLabel
			this.lblLevel = game.add.text((720/2), 100, 'LEVEL '+this.getCurrentLevel(), { font: '25px Pier Sans', fill: '#1a1a1a' });
			this.lblLevel.anchor.setTo(.5, .5);
			this.lblLevel.fixedToCamera = true;
			this.lblLevelTweenFade = game.add.tween(this.lblLevel);
			this.lblLevelTweenFade.to({
				font: 2,
				alpha: 0,
			}, 500);
			this.lblLevelTweenFade.start();
			this.lblLevelTweenScale = game.add.tween(this.lblLevel.scale);
			this.lblLevelTweenScale.to({
				y: 1.5,
				x: 1.5,
			}, 500);
			this.lblLevelTweenScale.start();
			this.cursors = game.input.keyboard.createCursorKeys();


		},

		update: function() {
			

			game.physics.arcade.collide(this.player, this.blockLayer);
			game.physics.arcade.collide(this.player, this.ladderLayer);
			game.physics.arcade.collide(this.player, this.platforms);
			game.physics.arcade.collide(this.player, this.vPlatforms);
			game.physics.arcade.collide(this.blockLayer, this.platforms);
			game.physics.arcade.collide(this.blockLayer, this.vPlatforms);
			game.physics.arcade.collide(this.vPlatforms, this.invisibleBlockLayer);
			game.physics.arcade.collide(this.player, this.spikeLayer, this.playerDie, null, this);
			game.physics.arcade.collide(this.player, this.doorLayer, this.nextLevel, null, this);

			this.movePlayer();

			// If the player is not in the world anymore
			if (this.player.y > 200 + game.world.height) {
				this.playerDie();
			}
		},

		createWorld: function() {
			

		},

		movePlayer: function() {
			if (this.cursors.left.isDown && this.player.dead != true) {
				this.player.body.acceleration.x = -800;
			} else if (this.cursors.right.isDown && this.player.dead != true) {
				this.player.body.acceleration.x = 800;
			} else {
				this.player.body.acceleration.x = 0;
			}

			if ( (this.cursors.up.isDown && this.player.body.onFloor()) || (this.cursors.up.isDown && this.player.body.touching.down)) {
			 	this.player.body.velocity.y = -450;
			}
		},

		climbLadder: function(obj1, obj2) {
			
			if (self.cursors.up.isDown) {
			 	self.player.body.velocity.y = -180;
			}
			
		},

		playerDie: function() {
			this.player.dead = true;
			this.player.body.velocity.y = 0;
			this.player.body.velocity.x = 0;
			this.player.body.gravity.y = 0;
			this.playerDieTween = this.game.add.tween(this.player.scale);
			this.playerDieTween.to({
				y: 0,
				x: 0
			}, 200);
			this.playerDieTween.start();
			this.playerDieTween.onComplete.add(function(){
				game.state.start('playState', true, false);
			});
		},

		nextLevel: function() {
			if (this.getCurrentLevel() != this.MAXLEVELS) {
				this.currentLevel++;
				localStorage.setItem('currentLevel', this.currentLevel);
			}
			game.state.start('playState', true, false);
			
		},

		getCurrentLevel: function() {
			currentLevel = localStorage.getItem('currentLevel');
			
			if (currentLevel == null) {
				currentLevel = 1;
			}

			return currentLevel;
		},

		getLevelMap: function(levelNumber) {
			levelNumber = levelNumber.toString();
			if (levelNumber.length == 1) {
				this.map = game.add.tilemap('level0' + levelNumber);	
			} else {
				this.map = game.add.tilemap('level' + levelNumber);	
			}
			
		},

		setBackground: function() {
			currentLevel = localStorage.getItem('currentLevel');
			if (currentLevel < 6) {
				this.background = game.add.sprite(0, 0, 'backgroundOrange');
			} else if (currentLevel < 11) {
				this.background = game.add.sprite(0, 0, 'backgroundBlue');
			} else if (currentLevel < 16) {
				this.background = game.add.sprite(0, 0, 'backgroundGreen');
			} else if (currentLevel < 21) {
				this.background = game.add.sprite(0, 0, 'backgroundPurple');
			} else if (currentLevel < 26) {
				this.background = game.add.sprite(0, 0, 'backgroundRed');
			}
		}
	};

