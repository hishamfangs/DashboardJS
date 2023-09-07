/**** Action Class
 *		
 *	Actions Class for creating, attaching and managing
 *	Actions on Records. 
 * ---------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Action(settings) {
	// Default Language is treated differently in Actions & Fields than it is in the Dashboard & Records.
	// If a language is left blank, for Actions & Fields it will default to "all", which means show for all languages
	// For Dashboard & Records, it defaults to "en-US", so the default language is always english. 
	if (!settings.config.language) {
		settings.config.language = this.language = "all";
	}

	/***************************************************************/
	/******************* Default actions ***************************/
	// Before running the inherited Constructor
	// Check the default Actions if any are found, and set the properties from there
	

	// Call Default 
	Component.call(this, settings);

	// The final Action Object
	actionItem = {
		name: this.name,
		domId: this.uid,
		class: this.class,
		icon: this.icon,
		url: this.url,
		onClick: this.onClick,
		language: this.language,
		translation: this.translatedName
	};

	// Set the Text Element
	this.object.querySelector(this.template.selectors.itemText).innerHTML = this.translatedName;

}

Action.prototype = Object.create(Component.prototype);
Action.prototype.constructor = Action;
