
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
function ViewSwitcherButton(viewSwitcher, config, template) {
	DashboardElement.call(this, config, null, template, false);
	this.viewSwitcher = viewSwitcher;
	this.dashboard = viewSwitcher.dashboard;
	this.setText(this.name);
	//clone field
	//var fieldObject = this.object;
	//this.setText(this.config.name?this.config.name:this.config.pageNumber);
	//fieldObject.innerHTML = this.config.pageNumber;
}
ViewSwitcherButton.prototype = Object.create(DashboardElement.prototype);
ViewSwitcherButton.prototype.constructor = ViewSwitcherButton;

ViewSwitcherButton.prototype.highlight = function (){
	this.addClass("active");
};

ViewSwitcherButton.prototype.unhighlight = function (){
	this.removeClass("active");
};

ViewSwitcherButton.defaultTemplate = {
	wrapper: ".view-container",
	item: "button",
	itemText: "button",
	itemIcon: "",
	itemLink: "",
	container: ""
};
