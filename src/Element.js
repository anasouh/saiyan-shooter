export default class Element {
	#coordinates;
	#height;
	#width;
	#interval;
	strokeStyle = 'black';
	fillStyle;
	lineWidth = 1;

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

	moveTo(x, y, duration = 1000) {
		const startX = this.#coordinates.x;
		const startY = this.#coordinates.y;
		const deltaX = x - startX;
		const deltaY = y - startY;
		const startTime = performance.now();

		this.#interval = setInterval(() => {
			const elapsedTime = performance.now() - startTime;
			if (elapsedTime >= duration) {
				clearInterval(this.#interval);
				this.#coordinates.x = x;
				this.#coordinates.y = y;
			} else {
				const progress = elapsedTime / duration;
				this.#coordinates.x = startX + deltaX * progress;
				this.#coordinates.y = startY + deltaY * progress;
			}
		}, 1000 / 60);
	}
}
