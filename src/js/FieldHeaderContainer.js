/**** FieldHeaderContainer Class
|*		
|*	FieldHeaderContainer Class for creating, attaching and managing
|*	FieldHeaderContainers. 
|*	FieldHeaderContainers will mainly be used as containers to which
|*	FieldHeaders will be attached.
|* 
	// Get Field Header Template
	this.template.wrapperSelector = ".header";
	this.template.containerSelector = ".header-container";
	this.template.itemSelector = ".field-header";
	this.template.itemTextSelector = ".header-title";
	this.template.actionsSelector = ".actions-header";

	this.template.wrapper = $($(fieldHeader.wrapperSelector)[0]);
	this.template.container = $($(fieldHeader.wrapperSelector + " " + fieldHeader.containerSelector)[0]);
	this.template.item = $($(fieldHeader.wrapperSelector + " " + fieldHeader.containerSelector + " " + fieldHeader.itemSelector)[0]);
	this.template.itemText = $($(fieldHeader.wrapperSelector + " " + fieldHeader.containerSelector + " " + fieldHeader.itemSelector + " " + fieldHeader.itemTextSelector)[0]);

|********************/
function FieldHeaderContainer(config, data, template, useExistingElement){
	DashboardElement.call(this, config, data, template, useExistingElement);
	var fields = DashboardElement.getFieldSettings(this.fields, this.language);

	for (var key in fields) {
		if (fields.hasOwnProperty(key)) {
			var fieldSettings = fields[key];
			var field = new FieldHeader(fieldSettings, null, template);
			//console.log("fieldHeader", field);
			this.append(field);
		}
	}
	if (!this.image){
		this.objects.imageSpacer.hide();
	}
}
FieldHeaderContainer.prototype = Object.create(DashboardElement.prototype);
FieldHeaderContainer.prototype.constructor = FieldHeaderContainer;		


FieldHeaderContainer.defaultTemplate = {
	wrapper: ".header",
	item: ".header-container",
	itemText : "",
	itemIcon : "",
	itemLink : "",
	imageSpacer: ".image-spacer",
	container: ".field-header-container"
};