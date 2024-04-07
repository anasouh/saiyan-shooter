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
	onScoreChange = (player, score) => {};
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
	difficulty = 'hard';
	currentWave = 0;
	enemiesPerWave = {
		easy: 5,
		normal: 10,
		hard: 15,
	};
	maxEnemies;
	nbKillsInWave = 0;
	spawnDelay = 2000;
	waveDelay = 5000;
	#spawnTimeout;

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
	 * @param {EnnemyData} ennemy
	 */
	addEnnemy(ennemy) {
		this.ennemies.push(ennemy);
		this.onAddChild(ennemy);
	}

	/**
	 * Ajoute un ennemi.
	 * @param {EnnemyData} ennemy
	 */
	removeEnnemy(ennemy) {
		this.ennemies = this.ennemies.filter(e => e !== ennemy);
		this.nbKillsInWave++;
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

	/**
	 * Ajoute un joueur au jeu.
	 * @param {PlayerData} player
	 * @returns
	 */
	addPlayer(player) {
		if (this.findPlayerById(player.id)) return;
		this.players.push(player);
		player.onScoreChange = score => {
			this.onScoreChange?.(player, score);
		};
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

	/**
	 * Fait tirer un joueur.
	 * @param {PlayerData} player
	 */
	shoot(player) {
		if (player.alive) {
			const data = {
				x: player.x + player.width - 10,
				y: player.y + player.height / 2,
				from: player.id,
				characterId: player.characterId,
				ulti: false,
				enemy: false,
			};
			const projectile = new ProjectileData(data);
			projectile.moving.right = true;
			this.addProjectile(projectile);
			if (player.tripleShoot) {
				const projectile_up = new ProjectileData(data);
				projectile_up.moving.up = true;
				projectile_up.moving.right = true;
				projectile_up.angle = -Math.PI / 4;
				this.addProjectile(projectile_up);
				const projectile_down = new ProjectileData(data);
				projectile_down.moving.down = true;
				projectile_down.moving.right = true;
				projectile_down.angle = Math.PI / 4;
				this.addProjectile(projectile_down);
			}
		}
	}

	clear() {
		clearTimeout(this.#spawnTimeout);
		this.currentWave = 0;
		this.nbKillsInWave = 0;
		this.ennemies = [];
		this.projectiles = [];
		this.items = [];
	}

	generateEnnemy() {
		if (this.paused || this.ennemies.length > 0) return;

		this.maxEnemies =
			this.enemiesPerWave[this.difficulty] *
			((this.currentWave + 1) / 2).toFixed();
		this.nbKillsInWave = 0;
		let spawnIndex = 0;

		const spawnNextEnemy = () => {
			if (spawnIndex < this.maxEnemies) {
				const enemy = new EnnemyData({
					x: this.width - 1,
					y: Math.random() * this.height,
					name: 'freezer' + (Math.random() <= 0.3 ? '_final' : ''),
				});
				enemy.onDeath = () => {
					this.removeEnnemy(enemy);
					if (this.ennemies.length === 0) {
						this.#spawnTimeout = setTimeout(() => {
							this.currentWave++;
							this.generateEnnemy();
						}, this.waveDelay);
					}
				};
				this.addEnnemy(enemy);
				spawnIndex++;
				const nextSpawnDelay = Math.random() * this.spawnDelay;
				this.#spawnTimeout = setTimeout(spawnNextEnemy, nextSpawnDelay);
			}
		};

		spawnNextEnemy();
	}

	start() {
		this.#startTime = Date.now();
		this.#endTime = undefined;
		this.paused = false;
		this.generateEnnemy();
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

	#updateEnemyMovementAndAttack() {
		this.ennemies.forEach(ennemy => {
			const closestPlayer = this.findClosestPlayer(ennemy);
			if (closestPlayer) {
				const dx = closestPlayer.x - ennemy.x;
				const dy = closestPlayer.y - ennemy.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const speed = ennemy.kamikaze ? 8 : 5;
				const vx = (dx / distance) * speed;
				const vy = (dy / distance) * speed;
				const direction =
					Math.abs(dx) > Math.abs(dy)
						? dx > 0
							? 'right'
							: 'left'
						: dy > 0
							? 'down'
							: 'up';
				ennemy.move(direction);
				ennemy.x += vx;
				ennemy.y += vy;
			}

			if (ennemy.canShoot && this.duration % 3 === 0) {
				this.enemyShoot(ennemy);
			}
		});
	}

	findClosestPlayer(ennemy) {
		let closestPlayer = null;
		let closestDistance = Infinity;
		this.players.forEach(player => {
			if (player.alive) {
				const distance = Math.sqrt(
					(ennemy.x - player.x) ** 2 + (ennemy.y - player.y) ** 2
				);
				if (distance < closestDistance) {
					closestPlayer = player;
					closestDistance = distance;
				}
			}
		});
		return closestPlayer;
	}

	enemyShoot(enemy) {
		if (enemy.cooldown) return;
		const closestPlayer = this.findClosestPlayer(enemy);
		if (closestPlayer) {
			const dx = closestPlayer.x - enemy.x;
			const dy = closestPlayer.y - enemy.y;
			const angle = Math.atan2(dy, dx);
			const projectile = new ProjectileData({
				characterId: enemy.name,
				x: enemy.x,
				y: enemy.y,
				enemy: true,
				ulti: EnnemyData.ULTIMATE_PROBA >= Math.random(),
			});
			projectile.moving.left = true;
			this.projectiles.push(projectile);
			enemy.cooldown = true;
			setTimeout(() => {
				enemy.cooldown = false;
			}, EnnemyData.COOLDOWN);
		}
	}

	#tickEvent() {
		if (this.paused) return;
		this.#updateDuration();
		if (this.players.length > 0 && this.lost) {
			this.stop();
			this.onEnd?.();
			return;
		}
		this.#updateEnemyMovementAndAttack();
		this.players.forEach(player => {
			if (player.moving.left) {
				player.vx -= PlayerData.ACCELERATION;
			}
			if (player.moving.right) {
				player.vx += PlayerData.ACCELERATION;
			}
			if (player.moving.up) {
				player.vy -= PlayerData.ACCELERATION;
			}
			if (player.moving.down) {
				player.vy += PlayerData.ACCELERATION;
			}

			player.vx = Math.min(
				Math.max(player.vx, -PlayerData.MAX_SPEED),
				PlayerData.MAX_SPEED
			);
			player.vy = Math.min(
				Math.max(player.vy, -PlayerData.MAX_SPEED),
				PlayerData.MAX_SPEED
			);

			if (!player.moving.left && !player.moving.right) {
				player.vx *= PlayerData.DECELERATION_X; // Facteur de décélération arbitraire
			}
			if (!player.moving.up && !player.moving.down) {
				player.vy *= PlayerData.DECELERATION_Y; // Facteur de décélération arbitraire
			}

			player.x += player.vx;
			player.y += player.vy;
		});
		this.projectiles.forEach(projectile => {
			if (
				isOutOfScreen({ width: this.width, height: this.height }, projectile)
			) {
				this.removeProjectile(projectile);
				return;
			}
			if (projectile.moving.left) {
				projectile.x -= 10;
			}
			if (projectile.moving.right) {
				projectile.x += 10;
			}
			if (projectile.moving.up) {
				projectile.y -= 2;
			}
			if (projectile.moving.down) {
				projectile.y += 2;
			}
		});
		this.ennemies.forEach(ennemy => {
			this.players.forEach(player => {
				if (areColliding(ennemy, player) && ennemy.isAlive && player.alive) {
					this.removeEnnemy(ennemy);
					if (!player.invicibility) {
						player.decrementLife(2);
					}
					//playSound(SFX.PUNCH_1);
				}
			});
			if (isLeftOfScreen(ennemy)) {
				this.removeEnnemy(ennemy);
			}
		});
		this.items.forEach(child => {
			if (child.isExpired) {
				this.removeItem(child);
			}
		});

		this.projectiles.forEach(projectile => {
			this.ennemies.forEach(ennemy => {
				if (projectile.enemy) {
					this.players.forEach(player => {
						if (
							areColliding(projectile, player) &&
							player.alive &&
							!player.invicibility
						) {
							this.removeProjectile(projectile);
							player.decrementLife();
							//playSound(SFX.PUNCH_1);
						}
					});
				} else {
					if (areColliding(projectile, ennemy) && ennemy.isAlive) {
						this.removeProjectile(projectile);
						/* A IMPLEMENTER */
						this.spawnItem(ennemy.position);
						// ennemy.explode();
						/* A REMPLACER */
						ennemy.decrementLife();
						const player = this.findPlayerById(projectile.from);
						if (player) {
							player.incrementScore(ennemy.value);
							player.incrementKills();
						}
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
