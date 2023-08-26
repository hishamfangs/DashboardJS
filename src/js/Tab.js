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
function Tab(tabs, config, dataManager, template, useExistingElement) {
	this.active = false;
	// Make a copy as to not modify original config
	var tabConfig = {...config};
	if (!tabConfig.onClick){
		tabConfig.onClick = function (){
			this.setActive(true);
			tabs.goToTab(tabConfig.name);	
		};
	}

	DashboardElement.call(this, tabConfig, dataManager.getData(), template, useExistingElement);

	this.dataManager = dataManager;
	this.tabs = tabs;
	this.dashboard = tabs.dashboard;
	// Save Original Config without the OnClick added, so we can pass it down to the Recordset.
	this.originalConfig = config;
	this.refreshCount();
};

Tab.prototype = Object.create(DashboardElement.prototype);
Tab.prototype.constructor = Tab;

Tab.prototype.refreshCount = async function (){
	// Create Staggered Loader (so the loading animation don't sync)
	//var staggeredSeed = getRandomInt(100,900);
	//setTimeout(()=> this.showLoader(), staggeredSeed);
	await this.showLoader();
	await this.dataManager.load(true);
	if (this.objects.itemBadge) {
		this.setText(this.dataManager.count, "itemBadge");
	}
	this.hideLoader();
	this.pagination?.refresh();

};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
Tab.prototype.setActive = function (active){
	if (active){
		this.active = true;
		this.addClass("active");
	}else{
		this.active = false;
		this.removeClass("active");
	}
};

Tab.prototype.goToPage = async function(page){
	await this.dataManager.goToPage(page);
	await this.refresh();
	//tl.from("#" + recordset.uid + " " + Record.defaultTemplate.item, {duration: 0.3, opacity: 0, x: (oldPage<page?1600:-1600), stagger: 0.05});
};

Tab.prototype.refresh = async function(){
	this.fields = DashboardElement.getFieldSettings(this.recordSettings.fields, this.language);
	
	this.setBreadCrumbs();
	this.setRecordset();
	this.setPagination();
	this.setSorting();
	this.setFiltering();
	this.setView();
};

Tab.prototype.setBreadCrumbs = function (){
	this.dashboard.setText('<span class="bc-tab-title">'+this.name+': </span>' +  (this.description? this.description:''), 'tabBreadCrumbs');
};

Tab.prototype.setRecordset = function (){
	var recordset = this.dashboard.getChild(this.name);
	if (recordset){
		recordset.refresh();
	}else{
		recordset = new Recordset(this.originalConfig, this.dataManager, this.templateManager);
		this.dashboard.append(recordset, "recordset");			
	}
};

Tab.prototype.setPagination = function (){
	var pagination = new Paging(this, {name: this.name}, this.dataManager, this.templateManager, true);
	this.pagination = pagination;
};

Tab.prototype.setFiltering = function (){
	var filtering = this.dashboard.getChild('Search')
	if (filtering){
		filtering.remove();
	}
	var filtering = new Filtering(this, {name: 'Search'}, this.dataManager, this.templateManager);
	this.dashboard.append(filtering, 'filtering');
};

Tab.prototype.setSorting = function (){
	var sorting = new Sorting(this, {fields: this.fields, name: 'Sort By'}, this.dataManager, this.templateManager, true);
};

Tab.prototype.setView = function (){
	var viewSwitcher = this.dashboard.getChild('View')
	if (viewSwitcher){
		viewSwitcher.remove();
	}
	var viewSwitcher = new ViewSwitcher(this, {name: 'View', viewMode: this.viewMode}, this.dataManager, this.templateManager);
	this.dashboard.append(viewSwitcher, 'viewSwitcher');
};

Tab.prototype.deactivate = function () {
	var activeRecordset = this.dashboard.getChild(this.name)
	this.setActive(false);
	if (activeRecordset){
		activeRecordset.remove();
	}
};

Tab.defaultTemplate = {
	wrapper: ".tabs",
	item: ".tab",
	itemText: ".tab-title",
	itemIcon: ".icon",
	itemLink: "a",
	itemBadge: ".badge",
	container: ""
};
