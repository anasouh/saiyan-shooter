import Entity from './Entity.js';

export default class EnnemyData extends Entity {
	isAlive = true;

	constructor({ x, y }) {
		super({ x, y, width: 246, height: 406 });
		this.moving = { left: true, right: false, up: false, down: false };
		this.scale = 0.25;
	}
}
