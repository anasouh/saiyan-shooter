import { areColliding, isOutOfScreen } from '../utils.js';
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

	findPlayerById(id) {
		return this.players.find(p => p.id === id);
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

		console.log(this.timeStart);
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

	#tickEvent() {
		if (this.paused) return;
		this.generateEnnemy();
		this.players.forEach(child => {
			if (child.moving.left) {
				this.movePlayer(child, -5, 0);
			}
			if (child.moving.right) {
				this.movePlayer(child, 5, 0);
			}
			if (child.moving.up) {
				this.movePlayer(child, 0, -5);
			}
			if (child.moving.down) {
				this.movePlayer(child, 0, 5);
			}
		});
		this.projectiles.forEach(child => {
			if (isOutOfScreen({ width: this.width, height: this.height }, child)) {
				this.removeProjectile(child);
				return;
			}
			if (child.isMoving.left) {
				child.x -= 5;
			}
			if (child.isMoving.right) {
				child.x += 5;
			}
			if (child.isMoving.up) {
				child.y -= 5;
			}
			if (child.isMoving.down) {
				child.y += 5;
			}
		});
		this.ennemies.forEach(child => {
			this.players.forEach(player => {
				if (areColliding(child, player) && child.isAlive) {
					this.removeEnnemy(child);
					player.decrementLife();
					//playSound(SFX.PUNCH_1);
				}
			});
			if (child.moving.left) {
				child.x -= 5;
			}
			if (child.moving.right) {
				child.x += 5;
			}
			if (child.moving.up) {
				child.y -= 5;
			}
			if (child.moving.down) {
				child.y += 5;
			}
		});
		this.items.forEach(child => {
			if (child.isExpired) {
				this.removeItem(child);
			}
		});

		this.projectiles.forEach(projectile => {
			this.ennemies.forEach(ennemy => {
				if (areColliding(projectile, ennemy) && ennemy.isAlive) {
					this.removeProjectile(projectile);
					this.spawnItem(ennemy.position);
					ennemy.explode();
					this.players.forEach(player => {
						player.incrementScore();
						player.incrementNbKill();
					});
				}
			});
		});

		this.items.forEach(item => {
			this.players.forEach(player => {
				if (areColliding(item, player)) {
					item.use(player);
					this.removeItem(item);
				}
			});
		});
	}
}
