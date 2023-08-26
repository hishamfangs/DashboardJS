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
function FilteringKeyword(filtering, config, dataManager, template, useExistingElement) {
	var filteringKeyword = this;
	DashboardElement.call(this, config, [], template, useExistingElement);
	this.dataManager = dataManager;
	this.filtering = filtering; 
	//console.log(this);
	this.objects.itemClose.addEventListener('click', function(){
		filteringKeyword.close();
	});
	
}

FilteringKeyword.prototype = Object.create(DashboardElement.prototype);
FilteringKeyword.prototype.constructor = FilteringKeyword;

FilteringKeyword.prototype.close = function (){
	this.filtering.removeKeyword(this.name);
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

FilteringKeyword.defaultTemplate = {
	wrapper: ".keywords-container",
	item: ".keyword",
	itemText: ".keyword-text",
	itemIcon: "",
	itemLink: "",
	itemClose: ".close",
	container: ""
};
