import View from './View.js';

export default class Menu extends View {
	#resumeButton;
	#mainMenuButton;
	#creditsButton;

	constructor(element) {
		super(element);
		this.#resumeButton = element.querySelector('button#resumeGame');
		this.#mainMenuButton = element.querySelector('button#mainMenu');
		this.#creditsButton = element.querySelector('button#credits');
	}

	onMainMenu(callback) {
		if (!this.#mainMenuButton) return;
		this.#mainMenuButton.addEventListener('click', callback);
	}

	onCredits(callback) {
		if (!this.#creditsButton) return;
		this.#creditsButton.addEventListener('click', callback);
	}

	onResume(callback) {
		if (!this.#resumeButton) return;
		this.#resumeButton.addEventListener('click', callback);
	}
}
