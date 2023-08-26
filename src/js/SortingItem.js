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
function SortingItem(sorting, config, dataManager, template, useExistingElement) {
	
	config.onClick = function (){
		// Toggle Sorting Direction
		sorting.dataManager.toggleSorting();
		sorting.dataManager.sort({
			sortBy: config.fieldKey,
			sortFieldText: config.name
		});
		
		//tab.dashboard.getChild(tab.name, 'recordset').remove()
		sorting.toggleMenu();
		sorting.tab.tabs.goToTab(sorting.tab.name);
	}
	DashboardElement.call(this, config, [], template, useExistingElement);
	this.dataManager = dataManager;
	this.sortDirection = "asc"
	//console.log(this);

	
}

SortingItem.prototype = Object.create(DashboardElement.prototype);
SortingItem.prototype.constructor = SortingItem;

SortingItem.prototype.create = function (active){


};
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

SortingItem.defaultTemplate = {
	wrapper: ".sort",
	item: "li",
	itemText: "a",
	itemIcon: "",
	itemLink: "",
	itemBadge: "",
	container: ""
};
