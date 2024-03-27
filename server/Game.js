import { areColliding, isLeftOfScreen, isOutOfScreen } from './utils.js';
import EnnemyData from './models/EnnemyData.js';

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
	io;
	paused = true;
	#tickInterval;
	onTick;

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
				const item = { x, y, width: 246, height: 406 };
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

	getPlayerById(id) {
		return this.players.find(p => p.id === id);
	}

	shoot(player) {
		const projectile = {
			x: player.x + player.width - 10,
			y: player.y + player.height / 2,
			width: 720 * 0.07,
			height: 445 * 0.07,
			moving: { left: false, right: true, up: false, down: false },
			from: player.id,
			characterId: player.characterId,
			ulti: false,
		};
		this.addProjectile(projectile);
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
			const ennemy = new EnnemyData({
				x: this.width - 1,
				y: Math.random() * this.height,
				moving: { left: true, right: false, up: false, down: false },
			});
			this.addEnnemy(ennemy);
		}
	}

	start() {
		this.timeStart = Date.now();
		if (this.#tickInterval) clearInterval(this.#tickInterval);
		this.#tickInterval = setInterval(() => this.#tickEvent(), 1000 / 60);
		this.paused = false;
	}

	stop() {
		clearInterval(this.#tickInterval);
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
		if (player.x + x < 0 || player.x + player.width + x > this.width) return;
		if (player.y + y < 0 || player.y + player.height + y > this.height) return;
		player.x += x;
		player.y += y;
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
		this.ennemies.forEach(child => {
			this.players.forEach(player => {
				if (areColliding(child, player) && child.isAlive) {
					this.removeEnnemy(child);
					player.decrementLife();
					//playSound(SFX.PUNCH_1);
				}
			});
			if (isLeftOfScreen(child)) {
				this.removeEnnemy(child);
			}
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
					/* A IMPLEMENTER */
					// this.spawnItem(ennemy.position);
					// ennemy.explode();
					/* A REMPLACER */
					this.removeEnnemy(ennemy);
					const player = this.getPlayerById(projectile.from);
					if (player) {
						player.incrementScore();
						player.incrementUlt();
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
}
