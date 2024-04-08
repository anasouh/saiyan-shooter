import assert from 'node:assert/strict';
import { describe, it, before } from 'node:test';
import PlayerData from '../server/models/PlayerData.js';
import { loadSprites } from '../server/sprites.js';

describe('PlayerData', () => {
	before(async () => {
		await loadSprites();
	});

	it('should initialize player data with default values', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		assert.strictEqual(player.score, PlayerData.DEFAULT_SCORE);
		assert.strictEqual(player.life, PlayerData.DEFAULT_LIFE);
		assert.strictEqual(player.ult, 0);
		assert.deepStrictEqual(player.moving, {
			left: false,
			right: false,
			up: false,
			down: false,
		});
		assert.strictEqual(player.x, 0);
		assert.strictEqual(player.y, 0);
		assert.strictEqual(player.characterId, 'goku');
		assert.strictEqual(player.invicibility, false);
		assert.strictEqual(player.username, undefined);
	});

	it('should decrement player life by 1', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.decrementLife();
		assert.strictEqual(player.life, PlayerData.DEFAULT_LIFE - 1);
	});

	it('should increment player score by 1', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.incrementScore(1);
		assert.strictEqual(player.score, PlayerData.DEFAULT_SCORE + 1);
	});

	it('should increment player ult by 1', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.incrementKills();
		assert.strictEqual(player.ult, 1);
	});

	it('should reset player ult to 0', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.incrementKills();
		player.resetUlt();
		assert.strictEqual(player.ult, 0);
	});

	it('should reset player data to default values', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.incrementScore();
		player.decrementLife();
		player.incrementKills();
		player.reset();
		assert.strictEqual(player.score, PlayerData.DEFAULT_SCORE);
		assert.strictEqual(player.life, PlayerData.DEFAULT_LIFE);
		assert.strictEqual(player.ult, 0);
	});

	it('should set player invicibility to true', () => {
		const player = new PlayerData({ x: 0, y: 0, characterId: 'goku', id: 1 });
		player.invicible();
		assert.strictEqual(player.invicibility, true);
	});
});
