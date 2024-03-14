import Player, { LIFE } from '../models/Player.js';

export default class LifeBar {
	#player;
	bar;

	/**
	 * Crée une nouvelle barre de vie.
	 * @param {Player} player Le joueur associé à la barre de vie.
	 * @param {HTMLElement} element La balise HTML à associer à la barre de vie.
	 */
	constructor(element) {
		this.bar = element;
	}

	/**
	 * Définit le joueur associé à la barre de vie.
	 * @param {Player} value Le joueur associé à la barre de vie.
	 */
	set player(value) {
		this.#player = value;
		this.#player.addEventListener('lifeChange', () => this.update());
		this.update();
	}

	/**
	 * Met à jour la barre de vie.
	 */
	update() {
		const percent = (this.#player.getLife() / LIFE) * 100;
		this.bar.style.width = `${percent.toFixed()}%`;
	}
}
