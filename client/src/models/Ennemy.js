import * as PIXI from 'pixi.js';
import Character from './Character.js';
import * as SFX from '../consts/sfx.js';
import { playSound } from '../utils.js';
import { FREEZER, FREEZER_LEFT } from '../consts/sprites.js';

export default class Ennemy extends Character {
	#moving = { up: false, down: false, left: false, right: false };
	isAlive = true;

	/**
	 * Crée un nouvel ennemi.
	 */
	constructor() {
		super(FREEZER);
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
				this.texture = FREEZER_LEFT;
				break;
			case 'right':
				this.#moving.right = true;
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
	}

	explode() {
		this.isAlive = false;
		this.#moving = { up: false, down: false, left: false, right: false };
		this.scale.set(0.75);
		this.explodeAnimation();
		playSound(SFX.ENNEMY_DISINTEGRATION);
	}
}
