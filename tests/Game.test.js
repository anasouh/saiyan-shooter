import assert from 'node:assert/strict';
import { describe, it, before } from 'node:test';
import ProjectileData from '../server/models/ProjectileData.js';
import EnnemyData from '../server/models/EnnemyData.js';
import PlayerData from '../server/models/PlayerData.js';
import Game from '../server/Game.js';
import { loadSprites } from '../server/sprites.js';
import { sleep } from './utils.js';

describe('Game', () => {
	before(async () => {
		await loadSprites();
	});

	it('should create a new game', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		assert(game);
		game.destroy();
	});

	it('should add a projectile', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const projectile = new ProjectileData({ characterId: 'goku' });
		game.addProjectile(projectile);
		assert.strictEqual(game.projectiles.length, 1);
		assert.strictEqual(game.projectiles[0], projectile);
		projectile.stop();
		game.destroy();
	});

	it('should remove a projectile', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const projectile = new ProjectileData({ characterId: 'goku' });
		game.addProjectile(projectile);
		game.removeProjectile(projectile);
		assert.strictEqual(game.projectiles.length, 0);
		projectile.stop();
		game.destroy();
	});

	it('should add an enemy', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const ennemy = new EnnemyData({ name: 'freezer' });
		game.addEnnemy(ennemy);
		assert.strictEqual(game.ennemies.length, 1);
		assert.strictEqual(game.ennemies[0], ennemy);
		game.destroy();
	});

	it('should remove an enemy', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const ennemy = new EnnemyData({ name: 'freezer' });
		game.addEnnemy(ennemy);
		game.removeEnnemy(ennemy);
		assert.strictEqual(game.ennemies.length, 0);
		game.destroy();
	});

	// it('should spawn an item', () => {
	// 	const game = new Game(1920, 1080);
	// 	const item = new Item();
	// 	game.spawnItem({ x: 10, y: 20 });
	// 	assert.strictEqual(game.items.length, 1);
	// 	assert.strictEqual(game.items[0].x, 10);
	// 	assert.strictEqual(game.items[0].y, 20);
	// });

	// it('should remove an item', () => {
	// 	const game = new Game(1920, 1080);
	// 	const item = new Item();
	// 	game.addItem(item);
	// 	game.removeItem(item);
	// 	assert.strictEqual(game.items.length, 0);
	// });

	it('should add a player', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const player = new PlayerData({});
		game.addPlayer(player);
		assert.strictEqual(game.players.length, 1);
		assert.strictEqual(game.players[0], player);
		game.destroy();
	});

	it('should remove a player', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const player = new PlayerData({});
		game.addPlayer(player);
		game.removePlayer(player);
		assert.strictEqual(game.players.length, 0);
		game.destroy();
	});

	it('should find a player by id', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const player1 = new PlayerData({ id: 1 });
		const player2 = new PlayerData({ id: 2 });
		game.addPlayer(player1);
		game.addPlayer(player2);
		const foundPlayer = game.findPlayerById(2);
		assert.strictEqual(foundPlayer, player2);
		game.destroy();
	});

	it('should clear the game except players', () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const projectile = new ProjectileData({ characterId: 'goku' });
		const enemy = new EnnemyData({ name: 'freezer' });
		// const item = new Item();
		const player = new PlayerData({});
		game.addProjectile(projectile);
		game.addEnnemy(enemy);
		// game.addItem(item);
		game.addPlayer(player);
		game.clear();
		assert.strictEqual(game.projectiles.length, 0);
		assert.strictEqual(game.ennemies.length, 0);
		assert.strictEqual(game.items.length, 0);
		assert.strictEqual(game.players.length, 1);
		projectile.stop();
		game.destroy();
	});

	it('should time the game', async () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		game.start();
		await sleep(1000);
		game.stop();
		assert(game.duration >= 1);
		game.destroy();
	});

	it('should hit the player on ennemy collision', async () => {
		const game = new Game(1920, 1080);
		game.enemiesMoving = false;
		const player = new PlayerData({ x: 400, y: 400, characterId: 'goku' });
		const ennemy = new EnnemyData({ x: 400, y: 400, name: 'freezer' });
		const life = player.life;
		game.addPlayer(player);
		game.addEnnemy(ennemy);
		game.start();
		await sleep(100);
		assert(player.life < life);
		game.stop();
		game.destroy();
	});

	it('should hit the ennemy on projectile collision', async () => {
		const game = new Game(1000, 1000);
		game.enemiesMoving = false;
		const player = new PlayerData({ x: 0, y: 0 });
		const ennemy = new EnnemyData({ x: 500, y: 500, name: 'freezer' });
		const projectile = new ProjectileData({
			x: 500,
			y: 500,
			radius: 10,
			from: player.id,
			characterId: 'goku',
		});
		const life = ennemy.life;
		game.addEnnemy(ennemy);
		game.addProjectile(projectile);
		game.start();
		await sleep(1000 / 60);
		assert(ennemy.life < life);
		projectile.stop();
		game.stop();
		game.destroy();
	});

	it('should move the player', async () => {
		const game = new Game(1000, 1000);
		game.enemiesMoving = false;
		const player = new PlayerData({ x: 0, y: 0 });
		game.addPlayer(player);
		player.moving.right = true;
		game.start();
		await sleep(1000 / 60);
		assert(player.x > 0);
		game.stop();
		game.destroy();
	});

	it('should move the ennemy', async () => {
		const game = new Game(1000, 1000);
		const player = new PlayerData({ x: 0, y: 0, goku: 'goku' });
		const ennemy = new EnnemyData({ x: 900, y: 500, name: 'freezer' });
		game.addPlayer(player);
		game.addEnnemy(ennemy);
		game.start();
		await sleep(1000 / 60);
		assert(ennemy.x !== 900 || ennemy.y !== 500);
		game.stop();
		game.destroy();
	});

	it('should move the projectile', async () => {
		const game = new Game(1000, 1000);
		game.enemiesMoving = false;
		const projectile = new ProjectileData({
			x: 100,
			y: 500,
			characterId: 'goku',
		});
		game.addProjectile(projectile);
		projectile.moving.right = true;
		game.start();
		await sleep(1000 / 60);
		assert(projectile.x > 100);
		projectile.stop();
		game.stop();
		game.destroy();
	});
});
