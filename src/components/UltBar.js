import Player, { KILL_FOR_ULTI, LIFE } from './Player.js';

/**
 * Retourne la valeur la plus petite.
 * @param {number} a
 * @param {number} b
 * @returns
 */
function min(a, b) {
	return a < b ? a : b;
}

export default class UltBar {
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
		this.#player.addEventListener('killsChange', kills => {
			console.log(kills);
			this.update();
		});
		this.update();
	}

	/**
	 * Met à jour la barre de vie.
	 */
	update() {
		const percent = (this.#player.kills / KILL_FOR_ULTI) * 100;
		this.bar.style.width = `${percent > 0 ? min(percent, 100) : 1}%`;
	}
}
