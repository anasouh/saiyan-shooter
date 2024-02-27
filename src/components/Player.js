import * as PIXI from 'pixi.js';
import Projectile from './Projectile.js';
import Character, { ANIMATION_TIME } from './Character.js';
import * as SFX from '../consts/sfx.js';
import { playSound } from '../utils.js';
import { PLAYER_FALLING } from '../consts/sprites.js';

const LIFE = 3;
const SCORE = 0;
const SPRITE = '/assets/images/player.png';
export const SHOOTING_SPRITE = '/assets/images/player_shooting.png';
export const RELOADING_SPRITE = '/assets/images/player_reloading.png';

/**
 * Représente un joueur.
 */
export default class Player extends Character {
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

	/**
	 * Retourne si le joueur est en mouvement.
	 */
	get moving() {
		return this.#moving;
	}

	/**
	 * Retourne le score du joueur.
	 * @returns {number} Le score du joueur.
	 */
	getScore() {
		return this.#score;
	}

	/**
	 * Retourne la vie du joueur.
	 * @returns {number} La vie du joueur.
	 */
	getLife() {
		return this.#life;
	}

	/**
	 * Modifie le score du joueur.
	 * @param {number} value La nouvelle valeur du score.
	 */
	setLife(value) {
		this.#life = value;
		if (this.onLifeChange) {
			this.onLifeChange(this.#life);
		}
	}

	/**
	 * Incrémente le score du joueur.
	 */
	incrementScore() {
		this.#score++;
		if (this.onScoreChange) {
			this.onScoreChange(this.#score);
		}
	}

	/**
	 * Décrémente la vie du joueur.
	 */
	decrementLife() {
		this.#life--;
		if (this.onLifeChange) {
			this.onLifeChange(this.#life);
		}
		this.hitAnimation();
	}

	/**
	 * Réinitialise le score et la vie du joueur.
	 */
	reset() {
		this.texture = PIXI.Texture.from(SPRITE);
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
		playSound(SFX.PROJECTILE);
		this.texture = PIXI.Texture.from(SHOOTING_SPRITE);
		if (this.onShoot) {
			this.onShoot(projectile);
		}
		setTimeout(
			() => (this.texture = PIXI.Texture.from(SPRITE)),
			ANIMATION_TIME
		);
	}

	/**
	 * Change la texture du joueur.
	 * @param {string} texture La nouvelle texture.
	 */
	changeTexture(texture = SPRITE) {
		this.texture = PIXI.Texture.from(texture);
	}

	/**
	 * Fait tomber le joueur.
	 * @returns {Promise<void>} Une promesse qui se résout lorsque l'animation est terminée.
	 */
	fallAnimation() {
		this.textures = PLAYER_FALLING;
		this.loop = false;
		this.animationSpeed = 0.5;
		this.play();
		const initialOnComplete = this.onComplete;
		return new Promise(
			resolve =>
				(this.onComplete = () => {
					resolve();
					this.onComplete = initialOnComplete;
				})
		);
	}
}
