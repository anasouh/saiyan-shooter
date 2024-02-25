export default class Element {
	#coordinates;
	#height;
	#width;

	constructor(coordinates, height, width) {
		this.#coordinates = coordinates;
		this.#height = height;
		this.#width = width;
	}

	get coordinates() {
		return this.#coordinates;
	}

	get height() {
		return this.#height;
	}

	get width() {
		return this.#width;
	}

	set coordinates(coordinates) {
		this.#coordinates = coordinates;
	}

	set height(height) {
		this.#height = height;
	}

	set width(width) {
		this.#width = width;
	}
}
