import { areColliding, formatDuration, isOutOfScreen } from '../utils.js';
import Ennemy from './Ennemy.js';
import Item, { ITEM_SPAWN_PROBABILITY } from './Item.js';
import Player from './Player.js';

export default class Game {
	width;
	height;
	id;
	#duration;
	onAddChild = child => {};
	onRemoveChild = child => {};
	ennemies = [];
	projectiles = [];
	items = [];
	players = [];
	timeStart;
	time;
	maxEnemies;
	paused = true;
	// #tickInterval;

	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	get children() {
		return [
			...this.ennemies,
			...this.projectiles,
			...this.items,
			...this.players,
		];
	}

	get lost() {
		if (this.players.length === 0) return false;
		let result = true;
		this.players.forEach(player => {
			if (player.alive) {
				result = false;
				return;
			}
		});
		return result;
	}

	get duration() {
		return formatDuration(this.#duration);
	}

	set duration(value) {
		this.#duration = value;
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
	 * Retire un ennemi.
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
		if (this.players.length === 0) {
			this.start();
		}
		this.players.push(player);
		this.onAddChild(player);
	}

	removePlayer(player) {
		this.players = this.players.filter(p => p !== player);
		this.onRemoveChild(player);
		if (this.players.length === 0) {
			this.stop();
		}
	}

	/**
	 * Trouve un joueur par son identifiant.
	 * @param {number} id
	 * @returns {Player}
	 */
	findPlayerById(id) {
		return this.players.find(p => p.id === id);
	}

	/**
	 * Trouve un ennemi par son identifiant.
	 * @param {number} id
	 * @returns {Ennemy}
	 */
	findEnnemyById(id) {
		return this.ennemies.find(e => e.id === id);
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
		// if (this.#tickInterval) clearInterval(this.#tickInterval);
		// this.#tickInterval = setInterval(() => this.#tickEvent(), 1000 / 60);
		this.paused = false;
	}

	stop() {
		// clearInterval(this.#tickInterval);
		this.timeEnd();
		this.paused = true;
	}

	timeEnd() {
		this.time = ((Date.now() - this.timeStart) / 1000).toFixed();
	}

	/**
	 * Déplace le joueur dans la scène, en vérifiant que le joueur ne
	 * dépasse pas les bords de la scène.
	 * @param {Player} player
	 * @param {number} x
	 * @param {number} y
	 */
	movePlayer(player, x, y) {
		const playerHalfWidth = player.width / 2;
		const playerHalfHeight = player.height / 2;

		let newX = player.position.x + x;
		let newY = player.position.y + y;

		if (newX - playerHalfWidth > 0 && newX + playerHalfWidth < this.width) {
			player.position.x = newX;
		} else {
			if (newX - playerHalfWidth <= 0) {
				player.position.x = playerHalfWidth;
			} else {
				player.position.x = this.width - playerHalfWidth;
			}
		}

		if (newY - playerHalfHeight > 0 && newY + playerHalfHeight < this.height) {
			player.position.y = newY;
		} else {
			if (newY - playerHalfHeight <= 0) {
				player.position.y = playerHalfHeight;
			} else {
				player.position.y = this.height - playerHalfHeight;
			}
		}
	}
}
