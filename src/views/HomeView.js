import Router from '../Router.js';
import View from './View.js';

export default class HomeView extends View {
	#startGameButton;
	#guideButton;

	constructor(element) {
		super(element);
		this.#startGameButton = element.querySelector('button#startGame');
		this.#startGameButton.addEventListener('click', event =>
			this.#handleStartGame(event)
		);
		this.#guideButton = element.querySelector('button#guide');
		this.#guideButton.addEventListener('click', event =>
			Router.navigate('/guide')
		);
	}

	#handleStartGame(event) {
		event.preventDefault();
		Router.navigate('/game');
	}
}
