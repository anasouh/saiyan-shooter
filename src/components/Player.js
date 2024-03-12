import * as PIXI from 'pixi.js';
import Projectile from './Projectile.js';
import Character, { ANIMATION_TIME } from './Character.js';
import * as SFX from '../consts/sfx.js';
import { playSound } from '../utils.js';
import { SPRITES_PATH } from '../consts/sprites.js';

export const LIFE = 3;
export const SCORE = 0;

const sprites = {
	goku: {
		sprite: PIXI.Texture.from(SPRITES_PATH + 'player/player.png'),
		shooting_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/player_shooting.png'),
		reloading_sprite:  PIXI.Texture.from(SPRITES_PATH + 'player/player_reloading.png'),
		falling_sprites: [
			PIXI.Texture.from(SPRITES_PATH + 'player/hit.png'),
			PIXI.Texture.from(SPRITES_PATH + 'player/ko.png'),
		],
		left_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/left.png'),
		right_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/right.png'),
		up_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/up.png'),
		down_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/down.png'),
		scale: 0.15

	},
	vegeta:{
		sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/player.png'),
		shooting_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/Vegeta_shooting.png'),
		reloading_sprite:  PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/vegeta_realoading.png'),
		falling_sprites: [
			PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/hit1.png'),
			PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/hit2.png'),
			PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/ko.png'),
		],
		left_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/player.png'),
		right_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/player.png'),
		up_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/player.png'),
		down_sprite: PIXI.Texture.from(SPRITES_PATH + 'player/vegeta/player.png'),
		scale: 1.5
	}

}

/**
 * Représente un joueur.
 */
export default class Player extends Character {
	#score = SCORE;
	#life = LIFE;
	#moving = { up: false, down: false, left: false, right: false };
	onShoot;
	onScoreChange = [];
	onLifeChange = [];
	#id;

	constructor(id) {
		super(sprites[id].sprite);
		this.anchor.set(0.5);
		this.scale.set(sprites[id].scale);
		this.#id = id;
	}

	/**
	 * Ajoute un écouteur d'évènement.
	 * @param {string} event L'évènement à écouter.
	 * @param {function} callback La fonction à appeler lors de l'évènement.
	 */
	addEventListener(event, callback) {
		switch (event) {
			case 'lifeChange':
				this.onLifeChange.push(callback);
				break;
			case 'scoreChange':
				this.onScoreChange.push(callback);
				break;
		}
	}

	/**
	 * Retourne si le joueur est en mouvement.
	 * @readonly
	 */
	get moving() {
		return this.#moving;
	}

	/**
	 * Retourne si le joueur est en vie.
	 * @returns {boolean} Vrai si le joueur est en vie, faux sinon.
	 * @readonly
	 */
	get alive() {
		return this.#life > 0;
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
	 * Modifie la vie du joueur.
	 * @param {number} value La nouvelle vie du joueur.
	 */
	setLife(value) {
		this.#life = value;
		this.onLifeChange.forEach(callback => callback(this.#life));
	}

	/**
	 * Incrémente le score du joueur.
	 */
	incrementScore() {
		this.#score++;
		this.onScoreChange.forEach(callback => callback(this.#score));
	}

	/**
	 * Décrémente la vie du joueur.
	 */
	decrementLife() {
		this.#life--;
		this.onLifeChange.forEach(callback => callback(this.#life));
		this.hitAnimation();
	}

	/**
	 * Réinitialise le score et la vie du joueur.
	 */
	reset() {
		this.texture = sprites[this.#id].sprite;
		this.#score = SCORE;
		this.#life = LIFE;
		this.onScoreChange.forEach(callback => callback(this.#score));
		this.onLifeChange.forEach(callback => callback(this.#life));
	}

	/**
	 * Appelée lorsqu'une touche est enfoncée.
	 * @param {string} key La touche enfoncée.
	 */
	press(key) {
		if (!this.alive) return;
		switch (key) {
			case 'ARROWUP':
			case 'Z':
				this.#moving.up = true;
				this.texture = sprites[this.#id].up_sprite;
				break;
			case 'ARROWDOWN':
			case 'S':
				this.#moving.down = true;
				this.texture = sprites[this.#id].down_sprite;
				break;
			case 'ARROWLEFT':
			case 'Q':
				this.#moving.left = true;
				this.texture = sprites[this.#id].left_sprite;
				break;
			case 'ARROWRIGHT':
			case 'D':
				this.#moving.right = true;
				this.texture = sprites[this.#id].right_sprite;
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
		if (!this.alive) return;
		this.texture = sprites[this.#id].sprite;
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
		if (!this.alive) return;
		const projectile = new Projectile();
		projectile.position = this.position;
		projectile.move('right');
		playSound(SFX.PROJECTILE);
		this.texture = sprites[this.#id].shooting_sprite;
		if (this.onShoot) {
			this.onShoot(projectile);
		}
		setTimeout(
			() => (this.texture = sprites[this.#id].sprite),
			ANIMATION_TIME
		);
	}

	reload() {
		this.texture = sprites[this.#id].reloading_sprite;
	}
	/**
	 * Fait tomber le joueur.
	 * @returns {Promise<void>} Une promesse qui se résout lorsque l'animation est terminée.
	 */
	fallAnimation() {
		this.textures = sprites[this.#id].falling_sprites;
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
