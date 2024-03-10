import * as PIXI from 'pixi.js';

const ITEM_SPAWN_PROBABILITY = 0.1;

export default class Item extends PIXI.Sprite {
	constructor() {
		super(PIXI.Texture.from('assets/images/senzu.png'));
		this.anchor.set(0.5);
		this.scale.set(0.05);
	}
}

export { ITEM_SPAWN_PROBABILITY };
