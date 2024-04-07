import fs from 'fs';
import sharp from 'sharp';

const spritesFolder = './client/public/assets/sprites';
const categories = ['enemy', 'items', 'player'];
export const spritesData = {};

async function getImageDimensions(imagePath) {
	const { width, height } = await sharp(imagePath).metadata();
	return { width, height };
}

/**
 * Structure du dossier projectiles:
 * - projectiles
 *  - characterId
 *   - 01.png
 *   - ...
 *   - ult
 *    - 01.png
 *    - ...
 *
 * Structure de spritesData:
 * {
 * 	characterId: {
 *    ...,
 * 	  projectile: {
 * 	  	'01': { width, height },
 * 		...
 * 	  },
 * 	  ult: {
 * 	  	'01': { width, height },
 * 		...
 * 	  }
 * }
 */

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

			const projectilePath = `${spritesFolder}/projectiles/${spriteFolder}`;
			if (fs.existsSync(projectilePath)) {
				const projectileFiles = fs.readdirSync(projectilePath);
				const ultFiles = fs.readdirSync(`${projectilePath}/ult`);
				const projectilesInfo = {};
				const ultInfo = {};

				for (const file of projectileFiles) {
					if (
						fs
							.statSync(`${spritesFolder}/projectiles/${spriteFolder}/${file}`)
							.isDirectory()
					) {
						continue;
					}

					const { width, height } = await getImageDimensions(
						`${spritesFolder}/projectiles/${spriteFolder}/${file}`
					);

					const fileName = file.split('.')[0];
					projectilesInfo[fileName] = { width, height };
				}

				for (const file of ultFiles) {
					if (
						fs
							.statSync(
								`${spritesFolder}/projectiles/${spriteFolder}/ult/${file}`
							)
							.isDirectory()
					) {
						continue;
					}

					const { width, height } = await getImageDimensions(
						`${spritesFolder}/projectiles/${spriteFolder}/ult/${file}`
					);

					const fileName = file.split('.')[0];
					ultInfo[fileName] = { width, height };
				}

				spriteInfo.ult = ultInfo;
				spriteInfo.projectile = projectilesInfo;
			}
			spritesData[spriteFolder] = spriteInfo;
		}
	}

	return spritesData;
}
