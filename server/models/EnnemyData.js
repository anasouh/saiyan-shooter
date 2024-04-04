import { spritesData } from '../sprites.js';
import Entity from './Entity.js';

const ennemies = {
	freezer: {
		width: 668,
		height: 720,
		scale: 0.15,
		value: 10,
	},

	freezer_final: {
		width: 246,
		height: 406,
		scale: 0.125,
		value: 20,
	},
};

export default class EnnemyData extends Entity {
	name;
	value;
	status = 'idle';
	isAlive = true;

	constructor({ x, y, name }) {
		super({
			x,
			y,
			width: spritesData[name].idle.width,
			height: spritesData[name].idle.height,
		});
		this.moving = { left: false, right: false, up: false, down: false };
		this.scale = ennemies[name].scale;
		this.name = name;
		this.value = ennemies[name].value;
	}

	setStatus(status) {
		this.status = status;
		this.width = spritesData[this.name][status].width;
		this.height = spritesData[this.name][status].height;
		this.scale = ennemies[this.name].scale;
	}

	move(direction) {
		switch (direction) {
			case 'up':
				this.moving.up = true;
				this.setStatus('up');
				break;
			case 'down':
				this.moving.down = true;
				this.setStatus('down');
				break;
			case 'left':
				this.moving.left = true;
				this.setStatus('left');
				break;
			case 'right':
				this.moving.right = true;
				this.setStatus('right');
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
			this.setStatus('idle');
		}
	}
}
