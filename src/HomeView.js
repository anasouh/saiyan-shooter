import Router from './Router.js';
import View from './View.js';

export default class HomeView extends View {
	#startGameButton;

	constructor(element) {
		super(element);
		this.#startGameButton = element.querySelector('button#startGame');
		this.#startGameButton.addEventListener('click', event =>
			this.#handleStartGame(event)
		);
	}

	#handleStartGame(event) {
		event.preventDefault();
		Router.navigate('/game');
	}
}
