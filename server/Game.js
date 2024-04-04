import { areColliding, isLeftOfScreen, isOutOfScreen } from './utils.js';
import EnnemyData from './models/EnnemyData.js';
import ProjectileData from './models/ProjectileData.js';
import ItemData from './models/ItemData.js';
import PlayerData from './models/PlayerData.js';

const ENNEMY_SPAWN_PROBABILITY = 0.01;
const ITEM_SPAWN_PROBABILITY = 0.1;

export default class Game {
	width;
	height;
	duration;
	onAddChild = child => {};
	onRemoveChild = child => {};
	onEnd = () => {};
	ennemies = [];
	projectiles = [];
	items = [];
	players = [];
	paused = true;
	#startTime;
	#endTime;
	io;
	#tickInterval;
	onTick;

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.#tickInterval = setInterval(() => {
			this.#tickEvent();
		}, 1000 / 60);
	}

	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	get lost() {
		let result = true;
		this.players.forEach(player => {
			if (player.alive) {
				result = false;
				return;
			}
		});
		return result;
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
		if (Math.random() < ITEM_SPAWN_PROBABILITY) {
			setTimeout(() => {
				const item = ItemData.randomItem({ x, y });
				this.items.push(item);
				this.onAddChild(item);
			}, delay);
		}
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
		if (this.findPlayerById(player.id)) return;
		this.players.push(player);
		this.onAddChild(player);
	}

	removePlayer(player) {
		this.players = this.players.filter(p => p !== player);
		this.onRemoveChild(player);
	}

	/**
	 * Trouve un joueur par son identifiant.
	 * @param {number} id
	 * @returns {PlayerData}
	 */
	findPlayerById(id) {
		return this.players.find(p => p.id === id);
	}

	shoot(player) {
		if (player.alive) {
			const projectile = new ProjectileData({
				x: player.x + player.width - 10,
				y: player.y + player.height / 2,
				from: player.id,
				characterId: player.characterId,
				ulti: false,
			});
			projectile.moving.right = true;
			this.addProjectile(projectile);
		}
	}

	clear() {
		this.ennemies = [];
		this.projectiles = [];
		this.items = [];
	}

	generateEnnemy() {
		if (this.paused) return;
		const random = Math.random();
		if (random < ENNEMY_SPAWN_PROBABILITY) {
			const ennemy = new EnnemyData({
				x: this.width - 1,
				y: Math.random() * this.height,
				name: 'freezer',
			});
			ennemy.move('left');
			this.addEnnemy(ennemy);
		}
	}

	start() {
		this.#startTime = Date.now();
		this.#endTime = undefined;
		this.paused = false;
	}

	stop() {
		this.#endTime = Date.now();
		this.paused = true;
	}

	#updateDuration() {
		if (this.#startTime && !this.#endTime) {
			this.duration = ((Date.now() - this.#startTime) / 1000).toFixed();
		} else if (this.#startTime && this.#endTime) {
			this.duration = ((this.#endTime - this.#startTime) / 1000).toFixed();
		} else {
			this.duration = 0;
		}
	}

	/**
	 * Déplace le joueur dans la scène, en vérifiant que le joueur ne
	 * dépasse pas les bords de la scène.
	 * @param {Player} player
	 * @param {number} x
	 * @param {number} y
	 */
	movePlayer(player, x, y) {
		if (player.x + x < 0 || player.x + player.width + x > this.width) return;
		if (player.y + y < 0 || player.y + player.height + y > this.height) return;
		player.x += x;
		player.y += y;
	}

	#tickEvent() {
		if (this.paused) return;
		this.#updateDuration();
		if (this.players.length > 0 && this.lost) {
			this.stop();
			this.onEnd?.();
			return;
		}
		this.generateEnnemy();
		this.players.forEach(player => {
			if (player.moving.left) {
				this.movePlayer(player, -5, 0);
			}
			if (player.moving.right) {
				this.movePlayer(player, 5, 0);
			}
			if (player.moving.up) {
				this.movePlayer(player, 0, -5);
			}
			if (player.moving.down) {
				this.movePlayer(player, 0, 5);
			}
		});
		this.projectiles.forEach(projectile => {
			if (
				isOutOfScreen({ width: this.width, height: this.height }, projectile)
			) {
				this.removeProjectile(projectile);
				return;
			}
			if (projectile.moving.left) {
				projectile.x -= 5;
			}
			if (projectile.moving.right) {
				projectile.x += 5;
			}
			if (projectile.moving.up) {
				projectile.y -= 5;
			}
			if (projectile.moving.down) {
				projectile.y += 5;
			}
		});
		this.ennemies.forEach(ennemy => {
			this.players.forEach(player => {
				if (
					areColliding(ennemy, player) &&
					ennemy.isAlive &&
					player.alive &&
					!player.invicibility
				) {
					this.removeEnnemy(ennemy);
					player.decrementLife();
					//playSound(SFX.PUNCH_1);
				}
			});
			if (isLeftOfScreen(ennemy)) {
				this.removeEnnemy(ennemy);
			}
			if (ennemy.moving.left) {
				ennemy.x -= 5;
			}
			if (ennemy.moving.right) {
				ennemy.x += 5;
			}
			if (ennemy.moving.up) {
				ennemy.y -= 5;
			}
			if (ennemy.moving.down) {
				ennemy.y += 5;
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
					ennemy.isAlive = false;
					this.removeProjectile(projectile);
					/* A IMPLEMENTER */
					this.spawnItem(ennemy.position);
					// ennemy.explode();
					/* A REMPLACER */
					this.removeEnnemy(ennemy);
					const player = this.findPlayerById(projectile.from);
					if (player) {
						player.incrementScore(ennemy.value);
						player.incrementKills();
					}
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
		this.onTick?.();
	}

	/**
	 * Arrête complètement le jeu.
	 */
	destroy() {
		clearInterval(this.#tickInterval);
	}
}
