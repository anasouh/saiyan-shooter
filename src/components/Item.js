import * as PIXI from 'pixi.js';
import Player, { LIFE } from './Player.js';
import { playSound } from '../utils.js';
import * as SFX from '../consts/sfx.js';

const ITEM_SPAWN_PROBABILITY = 0.1;
const ITEM_LIFETIME = 5 * 1000;

export default class Item extends PIXI.Sprite {
	#spawnTime;
	#blinkInterval;

	constructor() {
		super(PIXI.Texture.from('assets/images/senzu.png'));
		this.anchor.set(0.5);
		this.scale.set(0.05);
		this.#spawnTime = Date.now();
		setTimeout(() => this.#blink(), ITEM_LIFETIME * 0.7);
	}

	get isExpired() {
		return Date.now() - this.#spawnTime > ITEM_LIFETIME;
	}

	#blink() {
		this.#blinkInterval = setInterval(() => {
			this.visible = !this.visible;
			if (this.isExpired) {
				clearInterval(this.#blinkInterval);
			}
		}, 100);
	}

	/**
	 * Utilise l'objet.
	 * @param {Player} player
	 */
	use(player) {
		player.setLife(LIFE);
		playSound(SFX.SENZU_BEAN, 0.5);
	}
}

export { ITEM_SPAWN_PROBABILITY };
