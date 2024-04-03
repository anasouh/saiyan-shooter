import View from '../views/View.js';

export default class Menu extends View {
	#resumeButton;
	#mainMenuButton;
	#creditsButton;
	#replayButton;
	#scoresButton;
	#content;

	constructor(element) {
		super(element);
		this.#resumeButton = element.querySelector('button#resumeGame');
		this.#mainMenuButton = element.querySelector('button#mainMenu');
		this.#creditsButton = element.querySelector('button#credits');
		this.#replayButton = element.querySelector('button#replay');
		this.#scoresButton = element.querySelector('button#scores');
		this.#content = element.querySelector('.content');
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

	onReplay(callback) {
		if (!this.#replayButton) return;
		this.#replayButton.addEventListener('click', callback);
	}

	onScores(callback) {
		if (!this.#scoresButton) return;
		this.#scoresButton.addEventListener('click', callback);
	}

	/**
	 * Change le contenu du menu.
	 * @param {string} html
	 */
	set content(html) {
		this.#content.innerHTML = html;
	}

	get content() {
		return this.#content.innerHTML;
	}
}
