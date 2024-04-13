import Player, { LIFE } from './Player.js';
import { playSound } from '../utils.js';
import * as SFX from '../consts/sfx.js';
import { SPRITES_PATH } from '../consts/sprites.js';
import Texture from '../Texture.js';
import Sprite from './Sprite.js';

const ITEM_SPAWN_PROBABILITY = 0.1;

export default class Item extends Sprite {
	name;
	lifetime;
	#spawnTime;
	#blinkInterval;

	constructor(name, lifetime) {
		super(Texture.from(`${SPRITES_PATH}items/${name}/item.png`));
		this.name = name;
		this.lifetime = lifetime;
		this.anchor.set(0.5);
		this.#spawnTime = Date.now();
		setTimeout(() => this.#blink(), this.lifetime * 0.7);
	}

	/**
	 * Set the item's dimensions.
	 * @param {Object} dimensions
	 * @param {number} dimensions.width
	 * @param {number} dimensions.height
	 */
	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	get isExpired() {
		return Date.now() - this.#spawnTime > this.lifetime;
	}

	#blink() {
		this.#blinkInterval = setInterval(() => {
			this.visible = !this.visible;
			if (this.isExpired) {
				clearInterval(this.#blinkInterval);
			}
		}, 100);
	}
}

export { ITEM_SPAWN_PROBABILITY };
