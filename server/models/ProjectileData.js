import { spritesData } from '../sprites.js';
import Entity from './Entity.js';

export default class ProjectileData extends Entity {
	static ANIMATION_SPEED = 200;
	static LIFETIME = 3000;
	from;
	characterId;
	ulti;
	enemy;
	isStatic = false;
	index = 1;
	hits = 0;
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
		if (this.isSpecial) {
			this.isStatic = true;
			this.scale = 15;
		}
	}

	/**
	 * Dégâts infligés par le projectile
	 * @returns {number}
	 */
	get damage() {
		if (this.enemy) {
			return this.ulti ? 3 : 1;
		} else {
			return this.ulti ? 5 : 1;
		}
	}

	/**
	 * Nombre de fois que le projectile peut toucher
	 * @returns {number}
	 */
	get maxHits() {
		if (!this.enemy && this.ulti) {
			return 3;
		}
		return 1;
	}

	/**
	 * Indique si le projectile est mort
	 * @returns {boolean}
	 */
	get isDead() {
		return this.hits >= this.maxHits;
	}

	/**
	 * Indique si le projectile est un projectile spécial (kamehameha)
	 * @returns {boolean}
	 */
	get isSpecial() {
		return this.characterId.endsWith('ssj') && this.ulti;
	}

	/**
	 * Appelle la fonction callback après la durée de vie du projectile
	 * (uniquement pour les projectiles spéciaux)
	 * @param {function} callback
	 */
	set onExpire(callback) {
		if (this.isSpecial)
			setTimeout(() => {
				callback();
			}, ProjectileData.LIFETIME);
	}

	/**
	 * Incrémente le nombre de fois que le projectile a touché
	 * @returns {void}
	 */
	incrementHits() {
		this.hits++;
	}

	#nextSprite() {
		this.index++;
		const sprites =
			spritesData[this.characterId][this.ulti ? 'ult' : 'projectile'];
		const sprite = sprites[this.index.toString().padStart(2, '0')];
		if (sprite) {
			if (!this.isSpecial)
				this.#transitionDimension({
					width: sprite.width * (0.07 * this.index),
					height: sprite.height * (0.07 * this.index),
				});
		} else {
			if (this.enemy) this.index--;
			else this.index = 1;
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
