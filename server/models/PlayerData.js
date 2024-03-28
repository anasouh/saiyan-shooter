const INVICIBILITY_TIME = 1000;

export default class PlayerData {
	static DEFAULT_LIFE = 3;
	static DEFAULT_SCORE = 0;
	score = PlayerData.DEFAULT_SCORE;
	life = PlayerData.DEFAULT_LIFE;
	ult = 0;
	moving = { left: false, right: false, up: false, down: false };
	id;
	x;
	y;
	width = 246;
	height = 406;
	characterId;
	id;
	invicibility = false;

	constructor({ x, y, characterId, id }) {
		this.x = x;
		this.y = y;
		this.characterId = characterId;
		this.id = id;
		this.scale = 0.35;
	}

	set scale(scale) {
		this.width *= scale;
		this.height *= scale;
	}

	set position({ x, y }) {
		this.x = x;
		this.y = y;
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

	incrementScore() {
		this.score++;
	}

	incrementUlt() {
		this.ult++;
	}

	resetUlt() {
		this.ult = 0;
	}

	reset() {
		this.life = PlayerData.DEFAULT_LIFE;
		this.score = PlayerData.DEFAULT_SCORE;
		this.ult = 0;
	}

	invicible() {
		this.invicibility = true;
		setTimeout(() => {
			this.invicibility = false;
		}, INVICIBILITY_TIME);
	}
}
