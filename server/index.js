import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';
import PlayerData from './models/PlayerData.js';

class Directions {
	static fromKey(key) {
		switch (key) {
			case 'ARROWUP':
			case 'Z':
				return 'up';
			case 'ARROWDOWN':
			case 'S':
				return 'down';
			case 'ARROWLEFT':
			case 'Q':
				return 'left';
			case 'ARROWRIGHT':
			case 'D':
				return 'right';
		}
	}
}

class History {
	#games;

	constructor() {
		this.#games = [];
	}

	/**
	 * Ajouter une partie à l'historique
	 * @param {Game} game
	 */
	add(game) {
		let score = 0;
		game.players.forEach(player => (score += player.score));
		this.#games.push({
			score,
			duration: game.duration,
			players: game.players.map(player => ({
				username: player.username,
				score: player.score,
			})),
		});
	}
}

const routesPaths = ['/guide', '/game', '/credits'];

const app = express();
addWebpackMiddleware(app);
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };
const port = process.env.PORT || 8000;

app.use(express.static('client/public'));

routesPaths.forEach(path => {
	app.get(path, (req, res) => {
		res.sendFile('client/public/index.html', fileOptions);
	});
});

httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

const io = new IOServer(httpServer);
const game = new Game(1920, 1080);
const history = new History();
game.onLost = () => {
	history.add(game);
};

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	const player = new PlayerData({
		x: 50,
		y: game.height / 2,
		characterId: 'goku',
		id: socket.id,
	});

	io.emit('game', game);
	game.onTick = () => {
		io.emit('game', game);
	};

	socket.on('start', () => {
		player.reset();
		player.position = { x: 50, y: game.height / 2 };
		if (game.paused) {
			game.start();
		}
		player.invicible();
		game.addPlayer(player);
	});

	socket.on('keydown', key => {
		const direction = Directions.fromKey(key);
		if (direction) player.moving[direction] = true;
	});

	socket.on('keyup', key => {
		const direction = Directions.fromKey(key);
		if (direction) player.moving[direction] = false;
	});

	socket.on('shoot', () => {
		game.shoot(player);
	});

	socket.on('character', characterId => {
		console.log(characterId);
		player.characterId = characterId;
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		game.removePlayer(player);
		if (game.players.length === 0) {
			game.stop();
		}
	});
});
