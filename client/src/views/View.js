/**
 * Classe de base des vues de notre application.
 * Permet d'associer une balise HTML à la vue et de l'afficher/masquer.
 */
export default class View {
	/**
	 * Balise HTML associée à la vue
	 */
	element;

	constructor(element) {
		this.element = element;
	}
	/**
	 * Affiche la vue en lui ajoutant la classe CSS `active`
	 */
	show() {
		this.element.classList.add('active');
	}
	/**
	 * Masque la vue en enlevant la classe CSS `active`
	 */
	hide() {
		this.element.classList.remove('active');
	}
}
