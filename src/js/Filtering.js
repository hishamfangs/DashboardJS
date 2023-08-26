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
function Filtering(tab, config, dataManager, template, useExistingElement) {
	var filtering = this;
	DashboardElement.call(this, config, dataManager.getData(), template, useExistingElement);
	this.dataManager = dataManager;
	this.tab = tab
	this.dashboard = tab.dashboard

	this.objects.itemButton.addEventListener('click', onClickFiltering);
	this.refresh();

	function onClickFiltering(){
		filtering.addKeyword(filtering.objects.itemInput.value);
		filtering.clearInput();
	}
	//console.log(this);
}
Filtering.prototype = Object.create(DashboardElement.prototype);
Filtering.prototype.constructor = Filtering;

Filtering.prototype.addKeyword = function(keyword){
	this.dataManager.addKeyword(keyword);
	this.refresh();
};

Filtering.prototype.removeKeyword = function (keyword){
	this.dataManager.removeKeyword(keyword);
	this.refresh();
};

Filtering.prototype.renderKeywords = function (){
	this.removeChildren();
	for (var k in this.dataManager.filtering.keywords){
		var pKeyword = this.dataManager.filtering.keywords[k];
		var keyword = new FilteringKeyword(this, {...config, name: pKeyword}, this.dataManager, this.templateManager, false);
		this.append(keyword)
	}
};
Filtering.prototype.refresh = function (){
	this.renderKeywords();
	this.filterRecordset();
	// get Tab Recordset and Refresh
	this.dashboard.getChild(this.tab.name).refresh();
	//this.tab.pagination.tab = this.tab.name;
	//this.tab.pagination.dataManager = this.dataManager;
	
	this.tab.pagination.refresh();
	//this.tab.tabs.refresh();
};
Filtering.prototype.clearInput = function (){
	this.objects.itemInput.value = '';
};
Filtering.prototype.filterRecordset = function (){

};

Filtering.defaultTemplate = {
	wrapper: ".filtering",
	item: ".search-tab",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	itemInput: "input",
	itemButton: ".search-button",
	container: ".keywords-container"
};
