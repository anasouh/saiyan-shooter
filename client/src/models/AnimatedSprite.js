import Sprite from './Sprite.js';

export default class AnimatedSprite extends Sprite {
	#textures;
	#currentFrame;
	#frameDuration;
	loop = false;
	playing = false; // Ajout d'une propriété pour suivre l'état de lecture

	constructor(textures) {
		super(textures[0]);
		this.#textures = textures;
		this.#currentFrame = 0;
		this.#frameDuration = 1000;
	}

	set texture(texture) {
		this.playing = false;
		this.#textures = [texture];
	}

	get texture() {
		return this.#textures[this.#currentFrame] || this.#textures[0];
	}

	get textures() {
		return this.#textures;
	}

	set textures(textures) {
		this.#textures = textures;
	}

	get currentFrame() {
		return this.#currentFrame;
	}

	set currentFrame(frame) {
		this.#currentFrame = frame;
		this.texture = this.#textures[frame];
	}

	get frameDuration() {
		return this.#frameDuration;
	}

	set frameDuration(duration) {
		this.#frameDuration = duration;
	}

	#nextFrame() {
		let continuePlaying = true;
		if (this.#currentFrame === this.#textures.length - 1) {
			if (this.loop) {
				this.#currentFrame = 0;
			} else {
				continuePlaying = false;
				this.stop();
			}
		} else {
			this.#currentFrame++;
		}
		if (continuePlaying) {
			setTimeout(this.#nextFrame.bind(this), this.#frameDuration);
		}
	}

	play() {
		this.playing = true;
		if (this.#textures.length > 1) {
			setTimeout(this.#nextFrame.bind(this), this.#frameDuration);
		}
	}

	stop() {
		this.playing = false;
	}
}
