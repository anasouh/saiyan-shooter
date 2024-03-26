import View from './View.js';

export default class ScoreView extends View {
	constructor(element) {
		super(element);
	}

	#scores;

	tableScore = document.querySelector('.scores');

	renderScores(scores) {
		contenue = ``;
		scores.slice(0, 10).forEach(score => {
			pseudo = score.pseudo;
			sc = score.score;
			contenue += `<tr><td> ${pseudo}</td> <td> ${sc}</td> </tr>`;
		});

		this.tableScore.innerHTML(contenue);
	}
}
