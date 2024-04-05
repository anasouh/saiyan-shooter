import fs from 'fs';
import sharp from 'sharp';

const spritesFolder = './client/public/assets/sprites';
const categories = ['enemy', 'items'];
export const spritesData = {};

// Fonction pour obtenir les dimensions d'une image
async function getImageDimensions(imagePath) {
	const { width, height } = await sharp(imagePath).metadata();
	return { width, height };
}

// Fonction pour charger les sprites et obtenir leurs dimensions
export async function loadSprites() {
	// Parcourir les sous-dossiers du dossier des sprites
	for (const category of categories) {
		const path = `${spritesFolder}/${category}`;
		const spriteFolders = fs
			.readdirSync(path, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);

		for (const spriteFolder of spriteFolders) {
			const spritePath = `${path}/${spriteFolder}`;

			// Récupérer la liste des fichiers dans le dossier du sprite
			const spriteFiles = fs.readdirSync(spritePath);

			const spriteInfo = {};

			// Parcourir les fichiers du sprite
			for (const file of spriteFiles) {
				// Ignorer les dossiers
				if (fs.statSync(`${spritePath}/${file}`).isDirectory()) {
					continue;
				}

				// Obtenir les dimensions de l'image
				const { width, height } = await getImageDimensions(
					`${spritePath}/${file}`
				);

				// Ajouter les dimensions au spriteInfo
				const fileName = file.split('.')[0];
				spriteInfo[fileName] = { width, height };
			}

			// Ajouter les données du sprite à spritesData
			spritesData[spriteFolder] = spriteInfo;
		}
	}

	return spritesData;
}
