import Router from '../Router.js';
import View from './View.js';

export default class HomeView extends View {
	#startGameButton;
	#guideButton;
	#usernameField;
	username;

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
		this.#usernameField = element.querySelector('input[name="username"]');
		this.#usernameField.value = localStorage.getItem('username') || '';
		this.#usernameField.addEventListener('change', event => {
			this.username = event.currentTarget.value;
			localStorage.setItem('username', this.username);
		});
	}

	#handleStartGame(event) {
		event.preventDefault();
		Router.navigate('/game');
	}
}
