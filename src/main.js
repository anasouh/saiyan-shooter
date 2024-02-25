import HomeView from './views/HomeView.js';
import Router from './Router.js';
import View from './views/View.js';
import GameView from './views/GameView.js';
import Player from './components/Player.js';
import { CONTROL_KEYS, PAUSE_KEYS } from './settings/keys.js';

const homeView = new HomeView(document.querySelector('.home'));
const gameView = new GameView(document.querySelector('.game'));
const creditsView = new View(document.querySelector('.credits'));

const routes = [
	{ path: '/', view: homeView, title: 'Accueil' },
	{ path: '/game', view: gameView, title: 'Jeu' },
	{ path: '/credits', view: creditsView, title: 'Crédits' },
];
Router.routes = routes;

Router.navigate(window.location.pathname, true);
window.onpopstate = () => Router.navigate(document.location.pathname, true);

const player = new Player();
gameView.addPlayer(player);

document.addEventListener('keydown', event => {
	const key = event.key.toUpperCase();
	if (CONTROL_KEYS.includes(key)) {
		player.press(key);
	} else if (PAUSE_KEYS.includes(key)) {
		gameView.togglePause();
	}
});

document.addEventListener('keyup', event => {
	const key = event.key.toUpperCase();
	player.release(key);
});
