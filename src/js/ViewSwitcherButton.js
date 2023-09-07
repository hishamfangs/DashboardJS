
/**** ViewSwitcherButton Class
 *		
 *	ViewSwitcherButton Class 
 *  ---------------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.viewSwitcher									Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function ViewSwitcherButton(settings) {
	Component.call(this, settings);
	this.viewSwitcher = settings.viewSwitcher;
	this.dashboard = settings.viewSwitcher.dashboard;
	this.setText(this.name);
	//clone field
	//var fieldObject = this.object;
	//this.setText(this.config.name?this.config.name:this.config.pageNumber);
	//fieldObject.innerHTML = this.config.pageNumber;
}
ViewSwitcherButton.prototype = Object.create(Component.prototype);
ViewSwitcherButton.prototype.constructor = ViewSwitcherButton;

ViewSwitcherButton.prototype.highlight = function (){
	this.addClass("active");
};

ViewSwitcherButton.prototype.unhighlight = function (){
	this.removeClass("active");
};
