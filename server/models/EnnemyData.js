import Entity from './Entity.js';

const ennemies = {
	freezer: {
		width: 246,
		height: 406,
		value: 10,
	},
};

export default class EnnemyData extends Entity {
	name;
	value;
	isAlive = true;

	constructor({ x, y, name = 'freezer' }) {
		super({ x, y, width: ennemies[name].width, height: ennemies[name].height });
		this.moving = { left: true, right: false, up: false, down: false };
		this.scale = 0.25;
		this.name = name;
		this.value = ennemies[name].value;
	}
}
