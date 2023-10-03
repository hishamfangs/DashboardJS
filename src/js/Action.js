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
	// If an action language is left blank, for Actions & Fields it will default to "all", which means show for all languages
	if (!settings.config.language) {
		settings.config.language = "all";
	}
	if (!settings.config.width){
		settings.config.width = 60;
	}
	// Call Default 
	Component.call(this, settings);
}

Action.prototype = Object.create(Component.prototype);
Action.prototype.constructor = Action;
