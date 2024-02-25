export default class Screen {
	canvas;
	context;
	elements;

	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.elements = [];
	}

	addElement(element) {
		this.elements.push(element);
	}

	removeElement(element) {
		this.elements = this.elements.filter(e => e !== element);
	}

	clean() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	clear() {
		this.elements = [];
	}

	render() {
		this.clean();
		this.elements.forEach(element => {
			this.context.fillStyle = element.color;
			this.context.strokeStyle = element.strokeStyle;
			this.context.lineWidth = element.lineWidth;
			this.context.fillStyle = element.fillStyle;
			this.context.beginPath();
			if (element.fillStyle) {
				this.context.fillRect(
					element.coordinates.x,
					element.coordinates.y,
					element.width,
					element.height
				);
			} else {
				this.context.strokeRect(
					element.coordinates.x,
					element.coordinates.y,
					element.width,
					element.height
				);
			}
			this.context.closePath();
		});
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}

	set width(width) {
		this.canvas.width = width;
	}

	set height(height) {
		this.canvas.height = height;
	}

	get center() {
		return {
			x: this.width / 2,
			y: this.height / 2,
		};
	}

	fillScreen() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
}
