import * as PIXI from 'pixi.js';
import Projectile from './Projectile.js';

const LIFE = 3;
const SCORE = 0;
const SPRITE = '/images/player.png';
export const SHOOTING_SPRITE = '/images/player_shooting.png';
export const RELOADING_SPRITE = '/images/player_reloading.png';
export const ANIMATION_TIME = 200;

/**
 * Représente un joueur.
 */
export default class Player extends PIXI.Sprite {
	#score = SCORE;
	#life = LIFE;
	#moving = { up: false, down: false, left: false, right: false };
	onShoot;
	onScoreChange;
	onLifeChange;

	constructor() {
		super(PIXI.Texture.from(SPRITE));
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

	reset() {
		this.#score = SCORE;
		this.#life = LIFE;
		if (this.onScoreChange) this.onScoreChange(this.#score);
		if (this.onLifeChange) this.onLifeChange(this.#life);
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
		this.texture = PIXI.Texture.from(SHOOTING_SPRITE);
		if (this.onShoot) {
			this.onShoot(projectile);
		}
		setTimeout(
			() => (this.texture = PIXI.Texture.from(SPRITE)),
			ANIMATION_TIME
		);
	}

	changeTexture(texture = SPRITE) {
		this.texture = PIXI.Texture.from(texture);
	}
}
