import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Entity from '../server/models/Entity.js';

describe('Entity', () => {
	it('should change the width and height when the scale is set', () => {
		const entity = new Entity({ x: 0, y: 0 });
		const width = entity.width;
		const height = entity.height;
		entity.scale = 2;
		assert.strictEqual(entity.width, width * 2);
		assert.strictEqual(entity.height, height * 2);
	});

	it('should change the x and y when the position is set', () => {
		const entity = new Entity({ x: 0, y: 0 });
		entity.position = { x: 10, y: 20 };
		assert.strictEqual(entity.x, 10);
		assert.strictEqual(entity.y, 20);
	});

	it('should return the position', () => {
		const entity = new Entity({ x: 10, y: 20 });
		assert.deepStrictEqual(entity.position, { x: 10, y: 20 });
	});

	it('should return the dimensions', () => {
		const entity = new Entity({ x: 0, y: 0, width: 10, height: 20 });
		assert.deepStrictEqual(entity.dimensions, { width: 10, height: 20 });
	});
});
