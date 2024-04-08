import { spritesData } from '../sprites.js';
import Entity from './Entity.js';

export default class ProjectileData extends Entity {
	static ANIMATION_SPEED = 200;
	from;
	characterId;
	ulti;
	enemy;
	index = 1;
	#spriteTimeout;

	constructor({ x, y, from, characterId, ulti, enemy }) {
		const sprites = spritesData[characterId][ulti ? 'ult' : 'projectile'];
		const { width, height } = sprites['01'];
		super({ x, y, width, height });
		this.scale = 0.07;
		this.from = from;
		this.characterId = characterId;
		this.ulti = ulti;
		this.enemy = enemy;
		if (Object.keys(sprites).length > 1) {
			this.#spriteTimeout = setTimeout(() => {
				this.#nextSprite();
			}, ProjectileData.ANIMATION_SPEED);
		}
	}

	#nextSprite() {
		this.index++;
		const sprites =
			spritesData[this.characterId][this.ulti ? 'ult' : 'projectile'];
		const sprite = sprites[this.index.toString().padStart(2, '0')];
		if (sprite) {
			this.#transitionDimension({
				width: sprite.width * (0.07 * this.index),
				height: sprite.height * (0.07 * this.index),
			});
		} else {
			this.index--;
		}
		this.#spriteTimeout = setTimeout(() => {
			this.#nextSprite();
		}, ProjectileData.ANIMATION_SPEED);
	}

	/**
	 * Change progressivement la taille du projectile
	 * @param {Object} param0
	 * @param {number} param0.width
	 * @param {number} param0.height
	 */
	#transitionDimension({ width, height }) {
		const frames = ProjectileData.ANIMATION_SPEED / 10;
		const widthIncrement = (width - this.width) / frames;
		const heightIncrement = (height - this.height) / frames;
		const xIncrement = widthIncrement / 2;
		const yIncrement = heightIncrement / 2;
		let frameCount = 0;

		const interval = setInterval(() => {
			if (frameCount < frames) {
				this.width += widthIncrement;
				this.height += heightIncrement;
				this.x -= xIncrement;
				this.y -= yIncrement;
				frameCount++;
			} else {
				clearInterval(interval);
			}
		}, 10);
	}

	/**
	 * Arrête l'animation du projectile
	 */
	stop() {
		clearTimeout(this.#spriteTimeout);
	}
}
