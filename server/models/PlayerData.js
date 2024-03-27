export default class PlayerData {
	static DEFAULT_LIFE = 3;
	static DEFAULT_SCORE = 0;
	score = PlayerData.DEFAULT_SCORE;
	life = PlayerData.DEFAULT_LIFE;
	moving = { left: false, right: false, up: false, down: false };
	id;
	x;
	y;
	width = 246;
	height = 406;
	characterId;

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

	decrementLife() {
		this.life--;
	}

	incrementScore() {
		this.score++;
	}

	reset() {
		this.life = PlayerData.DEFAULT_LIFE;
		this.score = PlayerData.DEFAULT_SCORE;
	}
}