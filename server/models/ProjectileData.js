import Entity from './Entity.js';

export default class ProjectileData extends Entity {
	from;
	characterId;
	ulti;

	constructor({ x, y, from, characterId, ulti }) {
		super({ x, y, width: 720, height: 445 });
		this.scale = 0.07;
		this.from = from;
		this.characterId = characterId;
		this.ulti = ulti;
	}
}
