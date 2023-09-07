/**** FieldHeader Class
 *		
 *	FieldHeader Class for creating, attaching and managing
 *	FieldHeaders for each Recordset. 
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

function FieldHeader(settings){
	Component.call(this, settings);
	//var fieldSettings = Component.getFieldSettings(this);
	//var fields = fieldSettings.fields;

	// Modify Header DOM Object
	this.addClass(this.class);
	this.setText(this.translatedName);
}
FieldHeader.prototype = Object.create(Component.prototype);
FieldHeader.prototype.constructor = FieldHeader;		
