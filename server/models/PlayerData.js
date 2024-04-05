import Entity from './Entity.js';

const INVICIBILITY_TIME = 1000;

export default class PlayerData extends Entity {
	static DEFAULT_LIFE = 3;
	static DEFAULT_SCORE = 0;
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

	decrementLife() {
		if (!this.invicibility) {
			this.life--;
			this.invicible();
		}
	}

	incrementScore(value) {
		this.score += value;
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
