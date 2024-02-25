import HomeView from './HomeView.js';
import Router from './Router.js';
import View from './View.js';
import Screen from './Screen.js';
import Element from './Element.js';

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

const canvasList = document.querySelectorAll(
	'section.viewContainer > div canvas'
);
const screens = Array.from(canvasList).map(canvas => new Screen(canvas));

window.addEventListener('resize', event => {
	screens.forEach(screen => {
		screen.fillScreen();
	});
});

screens.forEach(screen => screen.fillScreen());

screens.forEach((screen, index) => {
	const element = new Element({ x: 30, y: (index + 1) * 100 }, 50, 50);
	element.strokeStyle = 'blue';
	screen.addElement(element);
	element.moveTo(window.innerWidth - 80, (index + 1) * 100, (index + 1) * 1000);
});

function renderScreens() {
	screens.forEach(screen => screen.render());
	requestAnimationFrame(renderScreens);
}

requestAnimationFrame(renderScreens);
