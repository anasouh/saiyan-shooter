import Router from '../Router.js';
import { formatDuration } from '../utils.js';
import View from './View.js';

export default class ScoreView extends View {
	#tbody;
	#backToHomeButton;

	constructor(element) {
		super(element);
		this.#tbody = element.querySelector('tbody');
		this.#backToHomeButton = element.querySelector('button#backToHome');
		this.#backToHomeButton.addEventListener('click', () =>
			Router.navigate('/')
		);
	}

	show() {
		this.renderScores();
		super.show();
	}

	renderScores() {
		fetch('/api/scores')
			.then(response => response.json())
			.then(scores => {
				let html = '';
				scores.slice(0, 10).forEach(({ username, score, waves, duration }) => {
					html += `<tr><td> ${username}</td> <td>${waves}</td> <td>${formatDuration(duration)}</td> <td>${score}</td> </tr>`;
				});

				this.#tbody.innerHTML = html;
			});
	}
}
