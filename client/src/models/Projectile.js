import * as PIXI from 'pixi.js';

export default class Projectile extends PIXI.AnimatedSprite {
	#isMoving = { up: false, down: false, left: false, right: false };

	/**
	 * Crée un nouveau projectile.
	 * @param {Array<PIXI.Texture>} textures
	 */
	constructor(textures) {
		super(textures);
		this.anchor.set(0.5);
		this.scale.set(0.07);
		this.animationSpeed = 0.3;
		if (this.textures.length) this.play();
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
