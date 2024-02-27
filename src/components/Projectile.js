import * as PIXI from 'pixi.js';

export default class Projectile extends PIXI.Sprite {
	#moving = { up: false, down: false, left: false, right: false };

	/**
	 * Crée un nouveau projectile.
	 */
	constructor() {
		super(PIXI.Texture.from('/assets/images/projectile.png'));
		this.anchor.set(0.5);
	}

	get moving() {
		return this.#moving;
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.#moving.up = true;
				this.rotation = -90;
				break;
			case 'down':
				this.#moving.down = true;
				this.rotation = 90;
				break;
			case 'left':
				this.#moving.left = true;
				this.rotation = 180;
				break;
			case 'right':
				this.#moving.right = true;
				this.rotation = 0;
				break;
		}
	}

	stop() {
		this.#moving.up = false;
		this.#moving.down = false;
		this.#moving.left = false;
		this.#moving.right = false;
		this.rotation = 0;
	}
}
