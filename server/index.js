import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';
import PlayerData from './models/PlayerData.js';

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
game.start();

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	const player = new PlayerData({
		x: 50,
		y: game.height / 2,
		characterId: 'goku',
		id: socket.id,
	});
	game.addPlayer(player);

	io.emit('game', game);
	game.onTick = () => {
		io.emit('game', game);
	};

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		game.removePlayer(player);
	});
});
