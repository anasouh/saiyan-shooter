import * as PIXI from 'pixi.js';

/**
 * Représente un joueur.
 */
export default class Player extends PIXI.Sprite {
	#keyPressed = {};

	constructor() {
		super(PIXI.Texture.from('/images/player.png'));
	}

	/**
	 * Retourne les touches actuellement enfoncées.
	 */
	get keyPressed() {
		return this.#keyPressed;
	}

	/**
	 * Appelée lorsqu'une touche est enfoncée.
	 * @param {string} key La touche enfoncée.
	 */
	press(key) {
		this.#keyPressed[key] = true;
	}

	/**
	 * Appelée lorsqu'une touche est relâchée.
	 * @param {string} key La touche relâchée.
	 */
	release(key) {
		this.#keyPressed[key] = false;
	}

	/**
	 * Déplace le joueur.
	 * @param {number} x Le déplacement horizontal.
	 * @param {number} y Le déplacement vertical.
	 */
	move(x, y) {
		this.x += x;
		this.y += y;
	}
}
