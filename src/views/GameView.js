import Menu from '../components/Menu.js';
import Player from '../components/Player.js';
import Router from '../Router.js';
import View from './View.js';
import * as PIXI from 'pixi.js';

export default class GameView extends View {
	#app;
	#currentPlayer;
	#secondPlayer;
	#pauseButton;
	#pauseMenu;
	#gameOverMenu;

	/**
	 * Crée une nouvelle vue de jeu.
	 * @param {HTMLElement} element La balise HTML à associer à la vue.
	 */
	constructor(element) {
		super(element);
		this.#app = new PIXI.Application({
			background: '#1099bb',
			resizeTo: window,
		});
		this.#app.stage.interactive = true;
		window.addEventListener('resize', () => this.#resize());
		this.#pauseButton = element.querySelector('button#pauseGame');
		this.#pauseButton.addEventListener('click', () => this.togglePause());
		this.#pauseMenu = new Menu(element.querySelector('.menu#pause'));
		this.#pauseMenu.onResume(() => this.togglePause());
		this.#pauseMenu.onMainMenu(() => Router.navigate('/'));
		this.#gameOverMenu = new Menu(element.querySelector('.menu#gameOver'));
		this.#gameOverMenu.onMainMenu(() => Router.navigate('/'));
		this.element.appendChild(this.#app.view);
		this.#app.view.onclick = () => console.log('click');
		this.#app.view.onmousemove = event => this.#handleMouseMove(event);
		this.#init();
	}

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		if (this.#currentPlayer) this.#app.stage.removeChild(this.#currentPlayer);
		this.#currentPlayer = player;
		this.#app.stage.addChild(this.#currentPlayer);
	}

	/**
	 * Ajoute le joueur secondaire à la scène.
	 * @param {Player} player
	 */
	set secondPlayer(player) {
		if (this.#secondPlayer) this.#app.stage.removeChild(this.#secondPlayer);
		this.#secondPlayer = player;
		this.#app.stage.addChild(this.#secondPlayer);
	}

	show() {
		super.show();
		if (this.paused) this.resume();
	}

	hide() {
		super.hide();
		this.pause();
	}

	#resize() {
		this.#app.renderer.resize(window.innerWidth, window.innerHeight);
	}

	#tickEvent() {
		if (this.#currentPlayer.moving.left) {
			this.movePlayer(this.#currentPlayer, -5, 0);
		}
		if (this.#currentPlayer.moving.right) {
			this.movePlayer(this.#currentPlayer, 5, 0);
		}
		if (this.#currentPlayer.moving.up) {
			this.movePlayer(this.#currentPlayer, 0, -5);
		}
		if (this.#currentPlayer.moving.down) {
			this.movePlayer(this.#currentPlayer, 0, 5);
		}
	}

	/**
	 * Initialise le jeu.
	 */
	#init() {
		this.#app.stage.removeChildren();

		this.#app.ticker.add(() => this.#tickEvent());
	}

	/**
	 * Retourne vrai si le jeu est en pause, faux sinon.
	 * @returns {boolean}
	 * @readonly
	 */
	get paused() {
		return !this.#app.ticker.started;
	}

	/**
	 * Met en pause le jeu.
	 */
	pause() {
		this.element.classList.add('paused');
		this.#pauseMenu.show();
		this.#app.ticker.stop();
		this.#app.stage.interactive = false;
	}

	/**
	 * Reprend le jeu.
	 */
	resume() {
		this.element.classList.remove('paused');
		this.#pauseMenu.hide();
		this.#app.ticker.start();
		this.#app.stage.interactive = true;
	}

	/**
	 * Met en pause ou reprend le jeu, selon l'état actuel du jeu.
	 */
	togglePause() {
		if (this.#app.ticker.started) {
			this.pause();
			this.#pauseButton.innerText = 'Reprendre';
		} else {
			this.resume();
			this.#pauseButton.innerText = 'Pause';
		}
	}

	/**
	 * Déplace le joueur dans la scène, en vérifiant que le joueur ne
	 * dépasse pas les bords de la scène.
	 * @param {Player} player
	 * @param {number} x
	 * @param {number} y
	 */
	movePlayer(player, x, y) {
		const playerHalfWidth = player.width / 2;
		const playerHalfHeight = player.height / 2;

		let newX = player.position.x + x;
		let newY = player.position.y + y;

		if (
			newX - playerHalfWidth > 0 &&
			newX + playerHalfWidth < this.#app.screen.width
		) {
			player.position.x = newX;
		} else {
			if (newX - playerHalfWidth <= 0) {
				player.position.x = playerHalfWidth;
			} else {
				player.position.x = this.#app.screen.width - playerHalfWidth;
			}
		}

		if (
			newY - playerHalfHeight > 0 &&
			newY + playerHalfHeight < this.#app.screen.height
		) {
			player.position.y = newY;
		} else {
			if (newY - playerHalfHeight <= 0) {
				player.position.y = playerHalfHeight;
			} else {
				player.position.y = this.#app.screen.height - playerHalfHeight;
			}
		}
	}

	#handleMouseMove(event) {
		const { clientX, clientY } = event;
		this.#currentPlayer.x = clientX;
		this.#currentPlayer.y = clientY;
	}
}
