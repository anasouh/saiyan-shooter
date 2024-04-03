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
	#kills;
	#duration;
	#pauseMenu;
	#gameOverMenu;
	#currentPlayer;
	game;
	onReplayPressed = () => {};

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
		this.#kills = ath.querySelector('#killsVal');
		this.#duration = ath.querySelector('#durationVal');
		this.#pauseMenu = new Menu(element.querySelector('.menu#pause'));
		this.#pauseMenu.onResume(() => this.togglePause());
		this.#pauseMenu.onMainMenu(() => this.leave());
		this.#gameOverMenu = new Menu(element.querySelector('.menu#gameOver'));
		this.#app.ticker.start();
		this.#gameOverMenu.onMainMenu(() => this.leave());
		this.#gameOverMenu.onReplay(() => {
			this.#init();
			this.resume();
			this.onReplayPressed?.();
		});
		this.#gameOverMenu.onCredits(() => Router.navigate('/credits'));
		this.#gameOverMenu.onScores(() => Router.navigate('/scores'));
		this.element.appendChild(this.#app.view);
		// this.#app.view.onmousemove = event => this.#handleMouseMove(event);
		this.#init();
	}

	set children(children) {
		this.#app.stage.removeChildren();
		children.forEach(child => this.#app.stage.addChild(child));
	}

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		this.#currentPlayer = player;
		this.#lifeBar.player = player;
	}

	update() {
		if (this.#currentPlayer) {
			this.#score.innerText = this.#currentPlayer.score;
			this.#kills.innerText = this.#currentPlayer.kills;
		}
		this.#duration.innerText = this.game.duration;
		if (this.game.lost) {
			this.element.classList.add('gameOver');
			this.#gameOverMenu.content = `
				<p>Temps : ${this.game.duration}</p>
				<p>Kills : ${this.#currentPlayer.kills}</p>
				<p>Score : ${this.#currentPlayer.score}</p>
			`;
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
		} else {
			this.resume();
		}
	}

	leave() {
		this.#clear();
		this.pause();
		Router.navigate('/');
	}
}
