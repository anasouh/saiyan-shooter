import { Filter } from '../Texture.js';
import AnimatedSprite from './AnimatedSprite.js';

export const ANIMATION_TIME = 1000;

export default class Character extends AnimatedSprite {
	redFilter;
	greenFilter;

	constructor(texture) {
		if (texture instanceof Array) {
			super(texture);
		} else {
			super([texture]);
		}
		// Use css filter to change the color of the sprite
		this.redFilter = new Filter('rgba(255, 0, 0, 0.5)');
		this.redFilter.enabled = false;
		this.greenFilter = new Filter('rgba(0, 255, 0, 0.5)');
		this.greenFilter.enabled = false;
		this.filters = [this.redFilter, this.greenFilter];
	}

	/**
	 * Définit les dimensions du personnage.
	 * @param {{ width: number, height: number }} Les dimensions du personnage.
	 */
	set dimensions({ width, height }) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Rend le personnage rouge pendant un court instant.
	 */
	hitAnimation(time = ANIMATION_TIME) {
		this.redFilter.enabled = true;
		setTimeout(() => (this.redFilter.enabled = false), time);
	}

	explodeAnimation() {
		const initialTexture = this.texture;
		this.textures = explosionTextures;
		this.animationSpeed = 0.5;
		this.loop = false;
		this.play();
	}
}
