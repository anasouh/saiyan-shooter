import Projectile from './Projectile.js';
import Ennemy from './Ennemy.js';
import Item, { ITEM_SPAWN_PROBABILITY } from './Item.js';
import Player from './Player.js';

export default class Game {
	width;
	height;
	#currentPlayer;
	#secondPlayer;
	onAddChild = child => {};
	onRemoveChild = child => {};
	ennemies = [];
	projectiles = [];
	items = [];

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.#currentPlayer = null;
		this.#secondPlayer = null;
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

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		if (this.#currentPlayer) this.onRemoveChild(this.#currentPlayer);
		this.#currentPlayer = player;
		// this.#lifeBar.player = player;
		// this.#ultBar.player = player;
		this.#currentPlayer.onShoot = projectile => {
			this.addProjectile(projectile);
		};
		this.onAddChild(this.#currentPlayer);
		// this.#currentPlayer.addEventListener('scoreChange', score => {
		// 	this.#score.innerText = score;
		// });
		// this.#app.view.onmousedown = () => this.#currentPlayer.reload();
	}

	/**
	 * Retourne le joueur principal.
	 * @return {Player}
	 */
	get currentPlayer() {
		return this.#currentPlayer;
	}

	/**
	 * Ajoute le second joueur à la scène.
	 * @param {Player} player
	 */
	get secondPlayer() {
		return this.#secondPlayer;
	}

	/**
	 * Ajoute le second joueur à la scène.
	 * @param {Player} player
	 */
	set secondPlayer(player) {
		if (this.#secondPlayer) this.onRemoveChild(this.#secondPlayer);
		this.#secondPlayer = player;
		this.onAddChild(this.#secondPlayer);
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
}
