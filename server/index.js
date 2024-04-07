import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';
import PlayerData from './models/PlayerData.js';
import Directions from './Directions.js';
import History from './History.js';
import { loadSprites, spritesData } from './sprites.js';

const history = new History();

const routesPaths = ['/guide', '/credits', '/scores'];
const redirectPaths = ['/game'];

await loadSprites();

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

redirectPaths.forEach(path => {
	app.get(path, (req, res) => {
		res.redirect('/');
	});
});

httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

app.get('/api/scores', (req, res) => {
	res.json(history.getScores());
});

app.get('/api/sprites', (req, res) => {
	res.json(spritesData);
});

const io = new IOServer(httpServer);
const game = new Game(1920, 1080);
game.onEnd = () => {
	history.add(game);
	game.clear();
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

	socket.on('start', username => {
		player.username = username;
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

	socket.on('difficulty', difficulty => {
		console.log(difficulty);
		game.difficulty = difficulty;
	});

	socket.on('leave', () => {
		console.log(`${player.username} a quitté la partie`);
		game.removePlayer(player);
		if (game.players.length === 0) {
			game.stop();
		}
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		socket.listeners('leave')[0]();
	});
});
