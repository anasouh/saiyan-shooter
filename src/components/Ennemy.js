import * as PIXI from 'pixi.js';
import Character from './Character.js';
import * as SFX from '../consts/sfx.js';
import { playSound } from '../utils.js';

export default class Ennemy extends Character {
	#moving = { up: false, down: false, left: false, right: false };
	isAlive = true;

	/**
	 * Crée un nouvel ennemi.
	 */
	constructor() {
		super(PIXI.Texture.from('/assets/images/ennemy.png'));
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

	explode() {
		this.isAlive = false;
		this.#moving = { up: false, down: false, left: false, right: false };
		this.scale.set(0.75);
		this.explodeAnimation();
		playSound(SFX.ENNEMY_DISINTEGRATION);
	}
}
