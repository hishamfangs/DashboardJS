
/**** Field Class
|*		
|*	Field Class for creating, attaching and managing
|*	Fields on Records. 
|* 
	// Get Fields Template
	this.template.wrapperSelector = record.wrapperSelector + " " + record.containerSelector + " " + record.itemSelector;
	this.template.containerSelector = ".container-fluid";
	this.template.itemSelector = ".field";
	this.template.itemTextSelector = ".field-value";
	this.template.itemIconSelector = ".icon";
	this.template.itemLinkSelector = ".field-click";

	this.template.wrapper = "";//$($(field.wrapperSelector)[0]);
	this.template.container = $($(field.wrapperSelector + " " + field.containerSelector)[0]);
	this.template.item = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector)[0]);
	this.template.itemText = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector + " " + field.itemTextSelector)[0]);
	this.template.itemIcon = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector + " " + field.itemIconSelector)[0]);

|********************/
function PageButton(config, template) {
	Component.call(this, config, null, template, false);

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
PageButton.defaultTemplate = {
	wrapper: "",
	item: ".button-paging",
	itemText: ".button-paging",
	itemIcon: "",
	itemLink: "",
	container: ""
};
