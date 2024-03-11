import Router from '../Router.js';
import View from './View.js';

export default class GuideView extends View {
	#backToHomeButton;

	constructor(element) {
		super(element);
		this.#backToHomeButton = element.querySelector('button#backToHome');
		this.#backToHomeButton.addEventListener('click', event =>
			Router.navigate('/')
		);
	}

	#handleStartGame(event) {
		event.preventDefault();
		Router.navigate('/game');
	}
}
