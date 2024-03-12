import * as PIXI from 'pixi.js';
import Player, { LIFE } from './Player.js';
import { playSound } from '../utils.js';
import * as SFX from '../consts/sfx.js';
import { SENZU_BEAN } from '../consts/sprites.js';

const ITEM_SPAWN_PROBABILITY = 0.1;

const items = [
	{
		name: 'senzu',
		probability: 0.1,
		lifetime: 5 * 1000,
		sprite: SENZU_BEAN,
		scale: 0.05,
	},
];

function randomItem() {
	const rand = Math.random();
	let acc = 0;
	for (const item of items) {
		acc += item.probability;
		if (rand < acc) {
			return item;
		}
	}
	return items[0];
}

export default class Item extends PIXI.Sprite {
	#itemProperties;
	#spawnTime;
	#blinkInterval;

	constructor() {
		const itemProperties = randomItem();
		super(itemProperties.sprite);
		this.#itemProperties = itemProperties;
		this.anchor.set(0.5);
		this.scale.set(this.#itemProperties.scale || 1);
		this.#spawnTime = Date.now();
		setTimeout(() => this.#blink(), this.#itemProperties.lifetime * 0.7);
	}

	get isExpired() {
		return Date.now() - this.#spawnTime > this.#itemProperties.lifetime;
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
