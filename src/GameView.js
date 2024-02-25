import Element from './Element.js';
import Screen from './Screen.js';
import View from './View.js';

export default class GameView extends View {
	#screens;

	constructor(element) {
		super(element);
		const canvasList = this.element.querySelectorAll('canvas');
		this.#screens = Array.from(canvasList).map(canvas => new Screen(canvas));
		window.onresize = event => {
			this.#screens.forEach(screen => {
				screen.fillScreen();
			});
		};
		this.#screens.forEach(screen => screen.fillScreen());
	}

	show() {
		super.show();
		this.initScreens();
	}

	initScreens() {
		this.#screens.forEach((screen, index) => {
			screen.clear();
			const element = new Element({ x: 30, y: (index + 1) * 100 }, 50, 50); // éléments de démo
			element.strokeStyle = 'blue'; // éléments de démo
			screen.addElement(element); // éléments de démo
			element.moveTo(
				// éléments de démo
				window.innerWidth - 80, // éléments de démo
				(index + 1) * 100, // éléments de démo
				(index + 1) * 1000 // éléments de démo
			); // éléments de démo
		});
		requestAnimationFrame(() => this.renderScreens());
	}

	renderScreens() {
		this.#screens.forEach(screen => screen.render());
		requestAnimationFrame(() => this.renderScreens());
	}
}
