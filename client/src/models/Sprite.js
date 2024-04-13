import Texture, { Filter } from '../Texture.js';

class Position {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Value {
	value;
	onChange;

	constructor(value) {
		this.value = value;
	}

	set(value) {
		this.value = value;
		this.onChange?.(value);
	}
}

export default class Sprite {
	width;
	height;
	position;
	#texture;
	scale;
	anchor;
	alpha = 1;
	/**
	 * @type {Filter[]}
	 */
	filters = [];

	constructor(texture) {
		this.#texture = texture;
		this.width = texture.width;
		this.height = texture.height;
		this.position = new Position(0, 0);
		this.scale = new Value(1);
		this.scale.onChange = value => {
			this.width = this.#texture.width * value;
			this.height = this.#texture.height * value;
		};
		this.anchor = new Value(0);
		this.anchor.onChange = value => {
			this.position.x = value * this.width;
			this.position.y = value * this.height;
		};
	}

	/**
	 * @param {Texture} texture
	 */
	set texture(texture) {
		this.#texture = texture;
	}

	get texture() {
		return this.#texture;
	}

	set scale(value) {
		this.scale = value;
	}

	get scale() {
		return this.scale;
	}
}
