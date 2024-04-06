import * as PIXI from 'pixi.js';
import Character from './Character.js';
import * as SFX from '../consts/sfx.js';
import { playSound } from '../utils.js';

export default class Ennemy extends Character {
	id;
	name;
	life;
	#status = 'idle';
	#moving = { up: false, down: false, left: false, right: false };
	isAlive = true;

	/**
	 * Crée un nouvel ennemi.
	 */
	constructor(name) {
		super(PIXI.Texture.from(`/assets/sprites/enemy/${name}/idle.png`));
		this.name = name;
	}

	get moving() {
		return this.#moving;
	}

	/**
	 * Définit le statut de l'ennemi.
	 * @param {string} value Le statut de l'ennemi.
	 */
	set status(value) {
		this.#status = value;
		this.updateSprite();
	}

	setSprites(name) {
		this.texture = PIXI.Texture.from(
			`/assets/sprites/enemy/${name}/${this.#status}.png`
		);
	}

	updateSprite() {
		this.setSprites(this.name);
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.#moving.up = true;
				this.status = 'up';
				break;
			case 'down':
				this.#moving.down = true;
				this.status = 'down';
				break;
			case 'left':
				this.#moving.left = true;
				this.status = 'left';
				break;
			case 'right':
				this.#moving.right = true;
				this.status = 'right';
				break;
		}
	}

	release(direction) {
		switch (direction) {
			case 'up':
				this.#moving.up = false;
				break;
			case 'down':
				this.#moving.down = false;
				break;
			case 'left':
				this.#moving.left = false;
				break;
			case 'right':
				this.#moving.right = false;
				break;
		}
		if (this.status === direction) {
			this.status = 'idle';
		}
	}

	explode() {
		this.isAlive = false;
		this.#moving = { up: false, down: false, left: false, right: false };
		this.scale.set(0.75);
		this.explodeAnimation();
		playSound(SFX.ENNEMY_DISINTEGRATION);
	}
}
