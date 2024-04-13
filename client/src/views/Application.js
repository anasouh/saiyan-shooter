import Sprite from '../models/Sprite.js';

class Ticker {
	#listeners = [];
	started = false;

	constructor() {
		this.#tick();
	}

	addListener(listener) {
		this.#listeners.push(listener);
	}

	start() {
		this.started = true;
	}

	stop() {
		this.started = false;
	}

	#tick() {
		if (this.started) {
			this.#listeners.forEach(listener => listener());
		}
		requestAnimationFrame(() => {
			this.#tick();
		});
	}
}

class Stage {
	/**
	 * @type {Sprite[]}
	 */
	children = [];
	interactive = true;

	constructor() {}

	addChild(child) {
		this.children.push(child);
	}

	removeChildren() {
		this.children = [];
	}

	removeChild(child) {
		this.children = this.children.filter(c => c !== child);
	}
}

export default class Application {
	view;
	ticker;
	stage;

	constructor(options) {
		this.view = document.createElement('canvas');
		this.view.width = 1000;
		this.view.height = 1000;
		this.ticker = new Ticker();
		this.stage = new Stage();
		this.ticker.addListener(() => {
			this.draw();
		});
	}

	resize(width, height) {
		this.view.width = width;
		this.view.height = height;
	}

	draw() {
		const context = this.view.getContext('2d');
		context.clearRect(0, 0, this.view.width, this.view.height);
		this.stage.children.forEach(child => {
			if (child instanceof Sprite) {
				context.globalAlpha = child.alpha;
				const draw = texture => {
					context.drawImage(
						texture,
						child.position.x,
						child.position.y,
						child.width,
						child.height
					);
				};
				const enabledFilters = child.filters.filter(filter => filter.enabled);
				let texture = child.texture;
				if (enabledFilters.length > 0) {
					texture = child.texture.tintImage(enabledFilters[0].color);
				}
				draw(texture);
			} else {
				context.strokeStyle = child.stroke;
				context.lineWidth = child.strokeThickness;
				context.strokeText(child.text, child.x, child.y);
				context.fillStyle = child.fill;
				context.font = `${child.fontSize}px '${child.fontFamily}'`;
				context.fillText(child.text, child.x, child.y);
			}
		});
	}
}
