
/**** Recordset Class
|*		
|*	Recordset Class for creating, attaching and managing
|*	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
|*	Tabs Handle switching from one recordset to another, while
|*	Panels hold the record. 
|* 
	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $(this.template.panel.itemSelector);

|********************/
function ActionsContainer(config, data, template, useExistingElement) {
	DashboardElement.call(this, config, data, template, useExistingElement);
	this.actions = config.actions;

	if (this.actions) {
		var actionKeys = Object.keys(this.actions);
		for (var i = 0; i < actionKeys.length; i++) {
			var actionKey = actionKeys[i];
			var actionSettings = {};
			actionSettings.name = actionKey;
			actionSettings.settings = this.actions[actionKey];
			var action = new Action(actionSettings, data, template, useExistingElement);
			console.log(action);
			this.append(action);
		}
	}
	console.log(this);
}
ActionsContainer.prototype = Object.create(DashboardElement.prototype);
ActionsContainer.prototype.constructor = ActionsContainer;
/*

	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	$(this.template.tab.itemSelector).remove();
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $($(this.template.panel.itemSelector).get(0));

*/

ActionsContainer.defaultTemplate = {
	wrapper: ".actions-container",
	item: ".actions",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: "tr"
};

ActionsContainer.prototype.getTemplate = function (templateConfig) {	// pass Optional template to override default template
	var template = DashboardElement.prototype.getTemplate.call(this, templateConfig);
	return template;
}