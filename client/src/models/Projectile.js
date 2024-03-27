import * as PIXI from 'pixi.js';
import { sprites } from './Player.js';

export default class Projectile extends PIXI.AnimatedSprite {
	#isMoving = { up: false, down: false, left: false, right: false };

	/**
	 * Crée un nouveau projectile.
	 * @param {string} charcterId - L'identifiant du personnage.
	 * @param {boolean} ultime - Si le projectile est un ultime.
	 */
	constructor(charcterId, ultime = false) {
		if (ultime) {
			super(sprites[charcterId].ult_projectile);
		} else {
			super(sprites[charcterId].projectile);
		}
		this.animationSpeed = 0.3;
		if (this.textures.length) this.play();
	}

	/**
	 * Définit les dimensions du projectile.
	 * @param {{ width: number, height: number }} Les dimensions du projectile.
	 */
	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	get isMoving() {
		return this.#isMoving;
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.#isMoving.up = true;
				this.rotation = -90;
				break;
			case 'down':
				this.#isMoving.down = true;
				this.rotation = 90;
				break;
			case 'left':
				this.#isMoving.left = true;
				this.rotation = 180;
				break;
			case 'right':
				this.#isMoving.right = true;
				this.rotation = 0;
				break;
		}
	}
}
