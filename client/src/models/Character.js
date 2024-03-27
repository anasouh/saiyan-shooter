import * as PIXI from 'pixi.js';
import { ColorOverlayFilter } from 'pixi-filters';

const explosionTextures = [];
PIXI.Assets.load('https://pixijs.com/assets/spritesheet/mc.json').then(() => {
	for (let i = 0; i < 26; i++) {
		const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
		explosionTextures.push(texture);
	}
});

export const ANIMATION_TIME = 200;

export default class Character extends PIXI.AnimatedSprite {
	#redFilter;

	constructor(texture) {
		if (texture instanceof Array) {
			super(texture);
		} else {
			super([texture]);
		}
		this.#redFilter = new ColorOverlayFilter(0xff0000, 0.5);
		this.#redFilter.enabled = false;
		this.filters = [this.#redFilter];
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
	hitAnimation() {
		this.#redFilter.enabled = true;
		setTimeout(() => (this.#redFilter.enabled = false), ANIMATION_TIME);
	}

	explodeAnimation() {
		const initialTexture = this.texture;
		this.textures = explosionTextures;
		this.animationSpeed = 0.5;
		this.loop = false;
		this.play();
	}
}
