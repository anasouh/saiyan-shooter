import { spritesData } from '../sprites.js';
import Entity from './Entity.js';

export default class ProjectileData extends Entity {
	static ANIMATION_SPEED = 200;
	from;
	characterId;
	ulti;
	enemy;
	index = 1;

	constructor({ x, y, from, characterId, ulti, enemy }) {
		const sprites = spritesData[characterId][ulti ? 'ult' : 'projectile'];
		const { width, height } = sprites['01'];
		super({ x, y, width, height });
		this.scale = 0.07;
		this.from = from;
		this.characterId = characterId;
		this.ulti = ulti;
		this.enemy = enemy;
		setTimeout(() => {
			this.#nextSprite();
		}, ProjectileData.ANIMATION_SPEED);
	}

	#nextSprite() {
		this.index++;
		const sprites =
			spritesData[this.characterId][this.ulti ? 'ult' : 'projectile'];
		const sprite = sprites[this.index.toString().padStart(2, '0')];
		if (sprite) {
			this.width = sprite.width;
			this.height = sprite.height;
			this.scale = 0.07 * this.index;
		} else {
			this.index--;
		}
		setTimeout(() => {
			this.#nextSprite();
		}, ProjectileData.ANIMATION_SPEED);
	}
}
