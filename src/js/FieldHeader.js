/**** FieldHeader Class
|*		
|*	FieldHeader Class for creating, attaching and managing
|*	FieldHeaders for each Recordset. 
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
function FieldHeader(config, data, template, useExistingElement){
	Component.call(this, config, data, template, useExistingElement);
	//var fieldSettings = Component.getFieldSettings(this);
	//var fields = fieldSettings.fields;

	// Modify Header DOM Object
	this.addClass(this.class);
	this.setText(this.translatedName);
}
FieldHeader.prototype = Object.create(Component.prototype);
FieldHeader.prototype.constructor = FieldHeader;		


FieldHeader.defaultTemplate = {
	wrapper: ".field-header-container",
	item: ".field-header",
	itemText : ".header-title",
	itemIcon : ".header-icon",
	itemLink : "",
	container: ""
};
/* 
Recordset.prototype.getTemplate = function (jqContext, pTemplate){	// pass Optional template to override default template
	var template = Component.prototype.getTemplate.call(this, jqContext, pTemplate);
	return template;
} */