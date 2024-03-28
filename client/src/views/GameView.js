import Ennemy from '../models/Ennemy.js';
import Menu from '../components/Menu.js';
import Player, { LIFE } from '../models/Player.js';
import Projectile from '../models/Projectile.js';
import Router from '../Router.js';
import { areColliding, isOutOfScreen, playSound } from '../utils.js';
import View from './View.js';
import * as PIXI from 'pixi.js';
import * as SFX from '../consts/sfx.js';
import LifeBar from '../components/LifeBar.js';
import Item from '../models/Item.js';
import UltBar from '../components/UltBar.js';
import Game from '../models/Game.js';

export default class GameView extends View {
	#app;
	#pauseButton;
	#lifeBar;
	#ultBar;
	#score;
	#pauseMenu;
	#gameOverMenu;
	#currentPlayer;
	game;

	/**
	 * Crée une nouvelle vue de jeu.
	 * @param {Game} game Le modèle de jeu à associer à la vue.
	 * @param {HTMLElement} element La balise HTML à associer à la vue.
	 */
	constructor(game, element) {
		super(element);
		this.game = game;
		this.#app = new PIXI.Application({
			backgroundAlpha: 0,
			resizeTo: window,
		});
		this.game.onAddChild = child => this.#app.stage.addChild(child);
		this.game.onRemoveChild = child => this.#app.stage.removeChild(child);
		this.#app.stage.eventMode = 'auto';
		const ath = element.querySelector('.ath');
		this.#pauseButton = ath.querySelector('button#pauseGame');
		this.#pauseButton.addEventListener('click', () => this.togglePause());
		this.#lifeBar = new LifeBar(ath.querySelector('.bar#life'));
		this.#ultBar = new UltBar(ath.querySelector('.bar#ult'));
		this.#score = ath.querySelector('#scoreVal');
		this.#pauseMenu = new Menu(element.querySelector('.menu#pause'));
		this.#pauseMenu.onResume(() => this.togglePause());
		this.#pauseMenu.onMainMenu(() => this.leave());
		this.#gameOverMenu = new Menu(element.querySelector('.menu#gameOver'));
		this.#app.ticker.start();
		this.#gameOverMenu.onMainMenu(() => this.leave());
		this.#gameOverMenu.onReplay(() => {
			this.#init();
			this.resume();
		});
		this.element.appendChild(this.#app.view);
		// this.#app.view.onmousemove = event => this.#handleMouseMove(event);
		this.#init();
	}

	set children(children) {
		this.#app.stage.removeChildren();
		children.forEach(child => this.#app.stage.addChild(child));
	}

	#onLifeChange(life) {
		if (life <= 0) {
			this.#currentPlayer.fallAnimation().then(() => {
				this.#app.ticker.stop();
			});
			this.element.classList.add('gameOver');
			this.game.timeEnd();
			this.element.querySelector('.menu#gameOver p').innerHTML =
				'temps : ' +
				this.game.time +
				's' +
				'<br>' +
				'kills : ' +
				this.#currentPlayer.kills +
				'<br>' +
				'score : ' +
				this.#currentPlayer.getScore();
		}
	}

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		this.#currentPlayer = player;
		// this.game.addPlayer(player);
		this.#lifeBar.player = player;
		// this.#ultBar.player = player;
		// player.onShoot = projectile => {
		// 	this.game.addProjectile(projectile);
		// };
		// player.addEventListener('lifeChange', life => this.#onLifeChange(life));
		// player.addEventListener('scoreChange', score => {
		// 	this.#score.innerText = score;
		// });
		// this.#app.view.onmousedown = () => player.reload();
	}

	update() {
		this.#score.innerText = this.#currentPlayer.score;
		if (this.game.lost) {
			this.element.classList.add('gameOver');
			this.#app.ticker.stop();
		}
	}

	/**
	 * Définit la fonction à appeler lorsqu'un clic est effectué sur la scène.
	 * @param {function} callback
	 */
	set onClick(callback) {
		this.#app.view.onclick = callback;
	}

	/**
	 * Définit la fonction à appeler lorsqu'un clic droit est effectué sur la scène.
	 * @param {function} callback
	 */
	set onContextMenu(callback) {
		this.#app.view.oncontextmenu = callback;
	}

	show() {
		super.show();
		if (this.paused) this.resume();
		this.#init();
		this.game.start();
		this.resume();
	}

	hide() {
		super.hide();
		this.pause();
		this.game.stop();
	}

	#resize() {
		this.#app.renderer.resize(window.innerWidth, window.innerHeight);
	}

	#clear() {
		this.#app.stage.removeChildren();
		this.game.clear();
	}

	/**
	 * Initialise le jeu.
	 */
	#init() {
		this.element.classList.remove('gameOver');
		this.#clear();
		if (this.#currentPlayer) {
			this.#app.stage.addChild(this.#currentPlayer);
			this.#currentPlayer.reset();
		}
		if (this.game.secondPlayer)
			this.#app.stage.addChild(this.game.secondPlayer);
	}

	/**
	 * Retourne vrai si le jeu est en pause, faux sinon.
	 * @returns {boolean}
	 * @readonly
	 */
	get paused() {
		return !this.#app.ticker.started;
	}

	shootKeyDown() {
		this.#currentPlayer.reload();
	}

	/**
	 * Met en pause le jeu.
	 */
	pause() {
		this.element.classList.add('paused');
		this.#app.ticker.stop();
		this.game.stop();
		this.#app.stage.interactive = false;
	}

	/**
	 * Reprend le jeu.
	 */
	resume() {
		this.element.classList.remove('paused');
		this.#app.ticker.start();
		this.game.start();
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

	// #handleMouseMove(event) {
	// 	const { clientX, clientY } = event;
	// 	this.#currentPlayer.x = clientX;
	// 	this.#currentPlayer.y = clientY;
	// }

	leave() {
		this.#clear();
		this.pause();
		Router.navigate('/');
	}
}
