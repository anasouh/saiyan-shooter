import HomeView from './views/HomeView.js';
import Router from './Router.js';
import View from './views/View.js';
import GameView from './views/GameView.js';
import Player from './models/Player.js';
import { CONTROL_KEYS, PAUSE_KEYS, SHOOT_KEYS } from './settings/keys.js';
import GuideView from './views/GuideView.js';
import Game from './models/Game.js';
import { io } from 'socket.io-client';

const socket = io();

const game = new Game(window.screen.width, window.screen.height);
window.onresize = () =>
	(game.dimensions = {
		width: window.innerWidth,
		height: window.innerHeight,
	});

const homeView = new HomeView(document.querySelector('.home'));
const guideView = new GuideView(document.querySelector('.guide'));
const gameView = new GameView(game, document.querySelector('.game'));
const creditsView = new View(document.querySelector('.credits'));

const routes = [
	{ path: '/', view: homeView, title: 'Accueil' },
	{ path: '/guide', view: guideView, title: 'Guide' },
	{ path: '/game', view: gameView, title: 'Jeu' },
	{ path: '/credits', view: creditsView, title: 'Crédits' },
];

const player = new Player('goku');
gameView.currentPlayer = player;
gameView.onClick = event => {
	player.shoot();
};
gameView.onContextMenu = event => {
	event.preventDefault();
	player.ulti();
};

document.addEventListener('keydown', event => {
	const key = event.key.toUpperCase();
	if (CONTROL_KEYS.includes(key)) {
		player.press(key);
	} else if (PAUSE_KEYS.includes(key)) {
		gameView.togglePause();
	} else if (SHOOT_KEYS.includes(key)) {
		gameView.shootKeyDown();
	}
});

document.addEventListener('keyup', event => {
	const key = event.key.toUpperCase();
	if (CONTROL_KEYS.includes(key)) {
		player.release(key);
	} else if (SHOOT_KEYS.includes(key)) {
		player.shoot();
	}
});

Router.routes = routes;

Router.navigate(window.location.pathname, true);
window.onpopstate = () => Router.navigate(document.location.pathname, true);
