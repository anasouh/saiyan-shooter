import * as PIXI from 'pixi.js';
import Projectile from './Projectile.js';

/**
 * Représente un joueur.
 */
export default class Player extends PIXI.Sprite {
	#score = 0;
	#life = 3;
	#moving = { up: false, down: false, left: false, right: false };
	onShoot;
	onScoreChange;
	onLifeChange;

	constructor() {
		super(PIXI.Texture.from('/images/player.png'));
		this.anchor.set(0.5);
	}

	get moving() {
		return this.#moving;
	}

	getScore() {
		return this.#score;
	}

	getLife() {
		return this.#life;
	}

	setLife(value) {
		this.#life = value;
		if (this.onLifeChange) {
			this.onLifeChange(this.#life);
		}
	}

	incrementScore() {
		this.#score++;
		if (this.onScoreChange) {
			this.onScoreChange(this.#score);
		}
	}

	decrementLife() {
		this.#life--;
		if (this.onLifeChange) {
			this.onLifeChange(this.#life);
		}
	}

	/**
	 * Appelée lorsqu'une touche est enfoncée.
	 * @param {string} key La touche enfoncée.
	 */
	press(key) {
		switch (key) {
			case 'ARROWUP':
			case 'Z':
				this.#moving.up = true;
				break;
			case 'ARROWDOWN':
			case 'S':
				this.#moving.down = true;
				break;
			case 'ARROWLEFT':
			case 'Q':
				this.#moving.left = true;
				break;
			case 'ARROWRIGHT':
			case 'D':
				this.#moving.right = true;
				break;
		}
	}

	/**
	 * Appelée lorsqu'une touche est relâchée.
	 * @param {string} key La touche relâchée.
	 */
	release(key) {
		switch (key) {
			case 'ARROWUP':
			case 'Z':
				this.#moving.up = false;
				break;
			case 'ARROWDOWN':
			case 'S':
				this.#moving.down = false;
				break;
			case 'ARROWLEFT':
			case 'Q':
				this.#moving.left = false;
				break;
			case 'ARROWRIGHT':
			case 'D':
				this.#moving.right = false;
				break;
		}
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

	/**
	 * Fait tirer le joueur.
	 */
	shoot() {
		const projectile = new Projectile();
		projectile.position = this.position;
		projectile.move('right');
		if (this.onShoot) {
			this.onShoot(projectile);
		}
	}
}
