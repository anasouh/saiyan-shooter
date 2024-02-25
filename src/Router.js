/**
 * Classe Router qui permet de gérer la navigation dans l'application sans rechargement de page.
 * (Single Page Application)
 */
export default class Router {
	/**
	 * Tableau des routes/vues de l'application.
	 * @example `Router.routes = [{ path: '/help', view: helpView, title: 'Support' }]`
	 */
	static routes = [];
	static currentRoute;

	static titleElement;

	/**
	 * Affiche la view correspondant à `path` dans le tableau `routes`
	 * @param {String} path URL de la page à afficher
	 * @param {Boolean} skipPushState active/désactive le pushState (gestion des boutons précédent/suivant du navigateur)
	 */
	static navigate(path, skipPushState = false) {
		let slug = '';
		const route = this.routes.find(route => {
			if (route.path.endsWith('*')) {
				const index = route.path.indexOf('*');
				slug = path.substring(index);
				return path.substring(0, index) === route.path.substring(0, index);
			}
			return route.path === path;
		});
		if (route) {
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			if (slug.length > 0) {
				route.view.show(slug);
			} else {
				route.view.show();
			}
			document.title = route.title;

			// const previousMenuLink = this.#menuElement.querySelector('a.active'),
			// 	newMenuLink = this.#menuElement.querySelector(`a[href="${path}"]`);
			// previousMenuLink?.classList.remove('active');
			// newMenuLink?.classList.add('active');

			if (!skipPushState) {
				window.history.pushState(null, null, path);
			}
		}
	}
}
