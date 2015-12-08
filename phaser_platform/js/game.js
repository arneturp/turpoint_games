var game = new Phaser.Game(720, 480, Phaser.AUTO, 'gameDiv');

game.global = {
	'maxLevels': 11,
	'deaths': 0,
};

game.state.add('bootState', bootState);
game.state.add('loadState', loadState);
game.state.add('menuState', menuState);
game.state.add('playState', playState);



game.state.start('bootState');
