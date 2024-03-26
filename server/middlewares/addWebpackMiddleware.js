import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';

export default function addWebpackMiddleware(app) {
	const webpackConfigForMiddleware = {
		...webpackConfig,
		mode: 'development', // on force le mode development
		plugins: [new webpack.HotModuleReplacementPlugin()], // on ajoute le plugin Hot
	};
	if (typeof webpackConfigForMiddleware.entry === 'string') {
		webpackConfigForMiddleware.entry = [
			'webpack-hot-middleware/client?reload=true', // ajout du script permettant le reload
			webpackConfigForMiddleware.entry, // notre fichier client/src/main.js
		];
	}
	const compiler = webpack(webpackConfigForMiddleware);
	// activation des 2 middlewares nécessaires au live-reload :
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output?.publicPath,
		})
	);
	app.use(webpackHotMiddleware(compiler));
}
