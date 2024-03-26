import Ennemy from './Ennemy.js';
import Item, { ITEM_SPAWN_PROBABILITY } from './Item.js';

export default class Game {
	width;
	height;
	onAddChild = child => {};
	onRemoveChild = child => {};
	ennemies = [];
	projectiles = [];
	items = [];
	players = [];
	timeStart;
	time;

	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	/* Child management */

	/**
	 * Ajoute un projectile.
	 * @param {Projectile} projectile
	 */
	addProjectile(projectile) {
		this.projectiles.push(projectile);
		this.onAddChild(projectile);
	}

	/**
	 * Retire un projectile.
	 * @param {Projectile} projectile
	 */
	removeProjectile(projectile) {
		this.projectiles = this.projectiles.filter(p => p !== projectile);
		this.onRemoveChild(projectile);
	}

	/**
	 * Ajoute un ennemi.
	 * @param {Ennemy} ennemy
	 */
	addEnnemy(ennemy) {
		this.ennemies.push(ennemy);
		this.onAddChild(ennemy);
	}

	/**
	 * Ajoute un ennemi.
	 * @param {Ennemy} ennemy
	 */
	removeEnnemy(ennemy) {
		this.ennemies = this.ennemies.filter(e => e !== ennemy);
		this.onRemoveChild(ennemy);
	}

	/**
	 * Fait apparaître ou non un item à la position donnée.
	 * @param {Object} param0
	 * @param {number} delay
	 */
	spawnItem({ x, y }, delay = 450) {
		setTimeout(() => {
			if (Math.random() < ITEM_SPAWN_PROBABILITY) {
				const item = new Item();
				item.position.set(x, y);
				this.items.push(item);
				this.onAddChild(item);
			}
		}, delay);
	}

	/**
	 * Ajoute un enfant à la scène.
	 * @param {Item} item
	 */
	removeItem(item) {
		this.items = this.items.filter(i => i !== item);
		this.onRemoveChild(item);
	}

	/* Players management */

	addPlayer(player) {
		this.players.push(player);
		this.onAddChild(player);
	}

	removePlayer(player) {
		this.players = this.players.filter(p => p !== player);
		this.onRemoveChild(player);
	}

	clear() {
		this.ennemies = [];
		this.projectiles = [];
		this.items = [];
	}

	generateEnnemy() {
		if (this.paused) return;
		const random = Math.random();
		if (random < 0.01) {
			const ennemy = new Ennemy();
			ennemy.position.set(this.width, Math.random() * this.height);
			ennemy.onComplete = () => this.removeEnnemy(ennemy);
			this.addEnnemy(ennemy);
			ennemy.move('left');
		}
	}

	start() {
		this.timeStart = Date.now();
	}

	timeEnd() {
		this.time = ((Date.now() - this.timeStart) / 1000).toFixed();

		console.log(this.timeStart);
	}
}
