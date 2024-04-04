import Entity from './Entity.js';

const ennemies = {
	freezer: {
		width: 668,
		height: 720,
		value: 10,
	},

	freezer_final: {
		width: 246,
		height: 406,
		value: 20,
	},
};

export default class EnnemyData extends Entity {
	name;
	value;
	status = 'idle';
	isAlive = true;

	constructor({ x, y, name = 'freezer' }) {
		super({ x, y, width: ennemies[name].width, height: ennemies[name].height });
		this.moving = { left: false, right: false, up: false, down: false };
		this.scale = 0.25;
		this.name = name;
		this.value = ennemies[name].value;
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.moving.up = true;
				this.status = 'up';
				break;
			case 'down':
				this.moving.down = true;
				this.status = 'down';
				break;
			case 'left':
				this.moving.left = true;
				this.status = 'left';
				break;
			case 'right':
				this.moving.right = true;
				this.status = 'right';
				break;
		}
	}

	release(direction) {
		switch (direction) {
			case 'up':
				this.moving.up = false;
				break;
			case 'down':
				this.moving.down = false;
				break;
			case 'left':
				this.moving.left = false;
				break;
			case 'right':
				this.moving.right = false;
				break;
		}
		if (this.status === direction) {
			this.status = 'idle';
		}
	}
}
