export default class History {
	games;

	constructor() {
		this.games = [];
	}

	/**
	 * Ajouter une partie à l'historique
	 * @param {Game} game
	 */
	add(game) {
		let score = 0;
		game.players.forEach(player => (score += player.score));
		this.games.push({
			score,
			duration: game.duration,
			currentWave: game.currentWave,
			date: new Date().toLocaleDateString('fr'),
			players: game.players.map(player => ({
				username: player.username,
				score: player.score,
			})),
		});
	}

	/**
	 * Retourne les scores individuels des joueurs triés par score décroissant
	 * @returns {Array<{username: string, score: number}>}
	 */
	getScores() {
		const scores = [];
		this.games.map(game =>
			game.players.map(player =>
				scores.push({
					...player,
					waves: game.currentWave,
					duration: game.duration,
					date: game.date,
				})
			)
		);
		return scores.sort((a, b) => b.score - a.score);
	}
}
