import * as PIXI from 'pixi.js';

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
}

export { ITEM_SPAWN_PROBABILITY };
