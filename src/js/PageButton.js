
/**** PageButton Class
|*		
|*	PageButton Class 
 *	---------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab												Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function PageButton(settings) {
	Component.call(this, settings);

	//clone field
	//var fieldObject = this.object;
	this.setText(this.config.name?this.config.name:this.config.pageNumber);
	//fieldObject.innerHTML = this.config.pageNumber;
}
PageButton.prototype = Object.create(Component.prototype);
PageButton.prototype.constructor = PageButton;

PageButton.prototype.highlight = function (){
	this.addClass("active");
};

PageButton.prototype.unhighlight = function (){
	this.removeClass("active");
};

