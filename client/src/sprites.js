import { Assets } from 'pixi.js';

export const spritesData = {};

export async function loadSprites() {
	await fetch('/api/sprites')
		.then(response => response.json())
		.then(data => {
			Object.assign(spritesData, data);
		});
}
