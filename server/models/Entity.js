export default class Entity {
	x;
	y;
	vx;
	vy;
	width;
	height;
	_scale;
	moving = { left: false, right: false, up: false, down: false };
	angle = 0;

	constructor({ x, y, width, height }) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.width = width;
		this.height = height;
	}

	/**
	 * Set the scale of the entity
	 * @param {number} scale
	 */
	set scale(scale) {
		this.width *= scale;
		this.height *= scale;
		this._scale = scale;
	}

	/**
	 * Set the position of the entity
	 * @param {number} x
	 * @param {number} y
	 */
	set position({ x, y }) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Get the position of the entity
	 * @returns {{ x: number, y: number }}
	 */
	get position() {
		return { x: this.x, y: this.y };
	}

	/**
	 * Get the dimensions of the entity
	 * @returns {{ width: number, height: number }}
	 */
	get dimensions() {
		return { width: this.width, height: this.height };
	}
}
