import HomeView from './HomeView.js';
import Router from './Router.js';
import View from './View.js';

const canvasList = document.querySelectorAll(
	'section.viewContainer > div canvas'
);

function resizeCanvas(canvas) {
	if (canvas.classList.contains('fullPage')) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
}

canvasList.forEach(canvas => resizeCanvas(canvas));
window.addEventListener('resize', resizeCanvas);

const homeView = new HomeView(document.querySelector('.home'));
const gameView = new View(document.querySelector('.game'));
const creditsView = new View(document.querySelector('.credits'));

const routes = [
	{ path: '/', view: homeView, title: 'Accueil' },
	{ path: '/game', view: gameView, title: 'Jeu' },
	{ path: '/credits', view: creditsView, title: 'Crédits' },
];
Router.routes = routes;

Router.navigate(window.location.pathname, true);
window.onpopstate = () => Router.navigate(document.location.pathname, true);
