export class Filter {
	color;
	enabled = true;

	constructor(color) {
		this.color = color;
	}
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
export default class Texture extends Image {
	static cache = {};

	static from(url) {
		if (!Texture.cache[url]) {
			const texture = new Texture();
			texture.src = url;
			Texture.cache[url] = texture;
		}

		return Texture.cache[url];
	}

	tintImage(color, opacity) {
		canvas.width = this.width;
		canvas.height = this.height;

		ctx.drawImage(this, 0, 0);

		ctx.globalCompositeOperation = 'source-atop';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalAlpha = opacity;

		ctx.globalCompositeOperation = 'destination-over';

		ctx.drawImage(this, 0, 0);

		const tintedImage = new Image();
		tintedImage.src = canvas.toDataURL();

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(this, 0, 0);

		ctx.globalCompositeOperation = 'multiply';
		ctx.drawImage(tintedImage, 0, 0);

		const finalImage = new Image();
		finalImage.src = canvas.toDataURL();

		this[color] = finalImage;
		return finalImage;
	}
}
