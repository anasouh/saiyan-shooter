import Entity from './Entity.js';

const items = [
	{
		name: 'senzu',
		probability: 0.1,
		lifetime: 5 * 1000,
		scale: 0.05,
		use: player => player.resetLife(),
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

export default class ItemData extends Entity {
	name;
	lifetime;
	#spawnTime;
	#blinkInterval;
	visible;

	constructor({ x, y, name, lifetime }) {
		super({ x, y, width: 30, height: 30 });
		this.name = name;
		this.lifetime = lifetime;
		this.visible = true;
		this.#spawnTime = Date.now();
		setTimeout(() => this.#blink(), this.properties.lifetime * 0.7);
	}

	get properties() {
		return items.find(item => item.name === this.name);
	}

	get isExpired() {
		return Date.now() - this.#spawnTime > this.properties.lifetime;
	}

	static randomItem({ x, y }) {
		return new ItemData({ ...randomItem(), x, y });
	}

	#blink() {
		this.#blinkInterval = setInterval(() => {
			this.visible = !this.visible;
			if (this.isExpired) {
				clearInterval(this.#blinkInterval);
			}
		}, 100);
	}

	use(player) {
		this.properties.use(player);
	}
}
