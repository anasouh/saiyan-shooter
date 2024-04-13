export default class Text {
	static cache = {};
	text;
	x;
	y;
	fill = 'white';
	stroke = 'black';
	strokeThickness = 4;
	fontFamily = 'Press Start 2P';
	fontSize = 15;

	constructor(text, x, y) {
		this.text = text;
		this.x = x;
		this.y = y;
	}

	get width() {
		return this.text.length * this.fontSize;
	}
}
