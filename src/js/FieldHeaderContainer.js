/**** FieldHeaderContainer Class
|*		
|*	FieldHeaderContainer Class for creating, attaching and managing
|*	FieldHeaderContainers. 
|*	FieldHeaderContainers will mainly be used as containers to which
|*	FieldHeaders will be attached.
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

function FieldHeaderContainer(settings){
	Component.call(this, settings);
	var fields = Component.getFieldSettings(this.fields, this.language);

	for (var key in fields) {
		if (fields.hasOwnProperty(key)) {
			var fieldSettings = fields[key];
			var field = new FieldHeader({config: fieldSettings, templateManager: settings.templateManager});
			//console.log("fieldHeader", field);
			this.append(field);
		}
	}
	if (!this.image){
		this.objects.imageSpacer.hide();
	}
}
FieldHeaderContainer.prototype = Object.create(Component.prototype);
FieldHeaderContainer.prototype.constructor = FieldHeaderContainer;		


FieldHeaderContainer.defaultTemplate = {
	imageSpacer: ".image-spacer"
};