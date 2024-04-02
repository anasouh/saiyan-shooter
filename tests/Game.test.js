import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ProjectileData from '../server/models/ProjectileData.js';
import EnnemyData from '../server/models/EnnemyData.js';
import PlayerData from '../server/models/PlayerData.js';
import Game from '../server/Game.js';

describe('Game', () => {
	it('should create a new game', () => {
		const game = new Game();
		assert(game);
		game.destroy();
	});

	it('should add a projectile', () => {
		const game = new Game();
		const projectile = new ProjectileData({});
		game.addProjectile(projectile);
		assert.strictEqual(game.projectiles.length, 1);
		assert.strictEqual(game.projectiles[0], projectile);
		game.destroy();
	});

	it('should remove a projectile', () => {
		const game = new Game();
		const projectile = new ProjectileData({});
		game.addProjectile(projectile);
		game.removeProjectile(projectile);
		assert.strictEqual(game.projectiles.length, 0);
		game.destroy();
	});

	it('should add an enemy', () => {
		const game = new Game();
		const ennemy = new EnnemyData({});
		game.addEnnemy(ennemy);
		assert.strictEqual(game.ennemies.length, 1);
		assert.strictEqual(game.ennemies[0], ennemy);
		game.destroy();
	});

	it('should remove an enemy', () => {
		const game = new Game();
		const ennemy = new EnnemyData({});
		game.addEnnemy(ennemy);
		game.removeEnnemy(ennemy);
		assert.strictEqual(game.ennemies.length, 0);
		game.destroy();
	});

	// it('should spawn an item', () => {
	// 	const game = new Game();
	// 	const item = new Item();
	// 	game.spawnItem({ x: 10, y: 20 });
	// 	assert.strictEqual(game.items.length, 1);
	// 	assert.strictEqual(game.items[0].x, 10);
	// 	assert.strictEqual(game.items[0].y, 20);
	// });

	// it('should remove an item', () => {
	// 	const game = new Game();
	// 	const item = new Item();
	// 	game.addItem(item);
	// 	game.removeItem(item);
	// 	assert.strictEqual(game.items.length, 0);
	// });

	it('should add a player', () => {
		const game = new Game();
		const player = new PlayerData({});
		game.addPlayer(player);
		assert.strictEqual(game.players.length, 1);
		assert.strictEqual(game.players[0], player);
		game.destroy();
	});

	it('should remove a player', () => {
		const game = new Game();
		const player = new PlayerData({});
		game.addPlayer(player);
		game.removePlayer(player);
		assert.strictEqual(game.players.length, 0);
		game.destroy();
	});

	it('should find a player by id', () => {
		const game = new Game();
		const player1 = new PlayerData({ id: 1 });
		const player2 = new PlayerData({ id: 2 });
		game.addPlayer(player1);
		game.addPlayer(player2);
		const foundPlayer = game.findPlayerById(2);
		assert.strictEqual(foundPlayer, player2);
		game.destroy();
	});

	it('should clear the game except players', () => {
		const game = new Game();
		const projectile = new ProjectileData({});
		const enemy = new EnnemyData({});
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
		game.destroy();
	});

	it('should time the game', () => {
		const game = new Game();
		game.start();
		const timestamp = Date.now();
		while (Date.now() - timestamp < 1000) {}
		game.stop();
		assert(game.duration === 1);
		game.destroy();
	});

	it('should hit the player on ennemy collision', async () => {
		const game = new Game();
		const player = new PlayerData({ x: 0, y: 0 });
		const ennemy = new EnnemyData({ x: 0, y: 0 });
		const life = player.life;
		game.addPlayer(player);
		game.addEnnemy(ennemy);
		game.start();
		await new Promise(resolve => setTimeout(resolve, 100));
		assert(player.life < life);
		game.stop();
		game.destroy();
	});

	it('should hit the ennemy on projectile collision', async () => {
		const game = new Game(1000, 1000);
		const player = new PlayerData({ x: 0, y: 0 });
		const ennemy = new EnnemyData({ x: 500, y: 500 });
		const projectile = new ProjectileData({
			x: 500,
			y: 500,
			radius: 10,
			from: player.id,
		});
		game.addEnnemy(ennemy);
		game.addProjectile(projectile);
		game.start();
		await new Promise(resolve => setTimeout(resolve, 1000));
		assert(ennemy.isAlive === false);
		game.stop();
		game.destroy();
	});
});
