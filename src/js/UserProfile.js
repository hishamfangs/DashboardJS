/**** Tab Class
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
function UserProfile(dashboard, config, dataManager, template, useExistingElement) {

	DashboardElement.call(this, {...config}, dataManager, template, useExistingElement);
	this.dashboard = dashboard;
	//this.setLink(url);
}
UserProfile.prototype = Object.create(DashboardElement.prototype);
UserProfile.prototype.constructor = UserProfile;

UserProfile.defaultTemplate = {
	wrapper: "",
	item: ".user-container",
	itemText: ".name",
	itemIcon: "",
	itemLink: "",
	itemImage: "img",
	container: ""
};
