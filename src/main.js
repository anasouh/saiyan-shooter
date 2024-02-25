import HomeView from './HomeView.js';
import Router from './Router.js';
import View from './View.js';
import GameView from './GameView.js';
import Player from './Player.js';

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
	player.press(event.key);
});

document.addEventListener('keyup', event => {
	player.release(event.key);
});
