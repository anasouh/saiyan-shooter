import * as PIXI from 'pixi.js';

export default class Ennemy extends PIXI.Sprite {
	#moving = { up: false, down: false, left: false, right: false };

	/**
	 * Crée un nouvel ennemi.
	 */
	constructor() {
		super(PIXI.Texture.from('/images/ennemy.png'));
		this.anchor.set(0.5);
	}

	get moving() {
		return this.#moving;
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.#moving.up = true;
				break;
			case 'down':
				this.#moving.down = true;
				break;
			case 'left':
				this.#moving.left = true;
				break;
			case 'right':
				this.#moving.right = true;
				break;
		}
	}

	stop() {
		this.#moving.up = false;
		this.#moving.down = false;
		this.#moving.left = false;
		this.#moving.right = false;
	}
}
