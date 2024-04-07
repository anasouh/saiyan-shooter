import { spritesData } from '../sprites.js';
import Entity from './Entity.js';

const INVICIBILITY_TIME = 1000;

export default class PlayerData extends Entity {
	static DEFAULT_LIFE = 3;
	static DEFAULT_SCORE = 0;
	static DECELERATION_X = 0.9;
	static DECELERATION_Y = 0.9;
	static ACCELERATION = 0.5;
	static MAX_SPEED = 5;
	score = PlayerData.DEFAULT_SCORE;
	life = PlayerData.DEFAULT_LIFE;
	ult = 0;
	kills = 0;
	id;
	characterId;
	id;
	invicibility = false;
	tripleShoot = false;
	username;

	constructor({ x, y, characterId, id }) {
		super({ x, y, width: 246, height: 406 });
		this.characterId = characterId;
		this.id = id;
		this.scale = 0.35;
	}

	get alive() {
		return this.life > 0;
	}

	decrementLife(value = 1) {
		if (!this.invicibility) {
			this.life -= value;
			this.invicible();
		}
	}

	incrementScore(value) {
		const oldScore = this.score;
		this.score += value;
		if (this.characterId === 'goku' && oldScore < 200 && this.score >= 200) {
			this.characterId = 'kaioken';
			const { width, height } = spritesData.kaioken.player;
			this.width = width;
			this.height = height;
			this.scale = 0.18;
		}
	}

	incrementKills() {
		this.kills++;
		this.ult++;
	}

	resetUlt() {
		this.ult = 0;
	}

	reset() {
		this.resetLife();
		this.score = PlayerData.DEFAULT_SCORE;
		this.ult = 0;
	}

	resetLife() {
		this.life = PlayerData.DEFAULT_LIFE;
	}

	invicible(duration = INVICIBILITY_TIME) {
		this.invicibility = true;
		setTimeout(() => {
			this.invicibility = false;
		}, duration);
	}
}
