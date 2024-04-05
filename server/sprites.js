import fs from 'fs';
import sharp from 'sharp';

const spritesFolder = './client/public/assets/sprites';
const categories = ['enemy', 'items'];
export const spritesData = {};

async function getImageDimensions(imagePath) {
	const { width, height } = await sharp(imagePath).metadata();
	return { width, height };
}

export async function loadSprites() {
	for (const category of categories) {
		const path = `${spritesFolder}/${category}`;
		const spriteFolders = fs
			.readdirSync(path, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);

		for (const spriteFolder of spriteFolders) {
			const spritePath = `${path}/${spriteFolder}`;

			const spriteFiles = fs.readdirSync(spritePath);

			const spriteInfo = {};

			for (const file of spriteFiles) {
				if (fs.statSync(`${spritePath}/${file}`).isDirectory()) {
					continue;
				}

				const { width, height } = await getImageDimensions(
					`${spritePath}/${file}`
				);

				const fileName = file.split('.')[0];
				spriteInfo[fileName] = { width, height };
			}

			spritesData[spriteFolder] = spriteInfo;
		}
	}

	return spritesData;
}
