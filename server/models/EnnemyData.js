export default class EnnemyData {
	width = 246;
	height = 406;
	x;
	y;
	moving;
	isAlive = true;

	constructor({ x, y }) {
		this.x = x;
		this.y = y;
		this.moving = { left: true, right: false, up: false, down: false };
		this.scale = 0.25;
	}

	set scale(scale) {
		this.width *= scale;
		this.height *= scale;
	}
}
