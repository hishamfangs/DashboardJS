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
function Tabs(dashboard, config, data, template, useExistingElement) {
	Component.call(this, config, data, template, useExistingElement);
	this.dashboard = dashboard;
	this.loadTabs()
}
Tabs.prototype = Object.create(Component.prototype);
Tabs.prototype.constructor = Tabs;

Tabs.prototype.loadTabs = async function(){
	this.processTabs();

	for (var t in this.tabs){
		var tabConfig = this.tabs[t]; 

		// Check if ajax Fetch is configured either on the tab level or on the global config level
		var fetch = tabConfig.fetch || this.config.fetch;

		// Load DataManager with configuration
		dataManager = new DataManager({fetch: fetch}, this.data?.[tabConfig.name]);

		var tab = new Tab(this, tabConfig, dataManager, this.templateManager);
		this.tabs[t].dataManager = dataManager;
		this.tabs[t].tab = tab;
		this.append(tab);
		//var tl = gsap.timeline();
		//tl.from("#" + recordset.uid + " " + Record.defaultTemplate.item, {duration: 0.3, opacity: 0, x: 1600, stagger: 0.05});
	}
	if (!this.config.initialActiveTab){
		let keys = Object.keys(this.tabs); 
		this.config.initialActiveTab = keys.length?keys[0]:null;
	}
	this.goToTab(this.config.initialActiveTab);
}

Tabs.prototype.goToTab = function(tabName){
	if (tabName){
		//disable old active tab
		if (this.activeTab && this.activeTab.name != tabName){
			this.activeTab.deactivate();
			this.activeTab = null;
		}

		// Select new Tab
		this.activeTab = this.getChild(tabName);
		this.activeTab.setActive(true);
		this.activeTab.refresh();
	}	
};

Tabs.prototype.processTabs = function (){
	for (var t in this.tabs){
		var tabConfig = this.tabs[t]; 

		// Set The Name
		if (!tabConfig.name){
			tabConfig.name = t;
		}

		// Set Language, Default Value = en-US
		var currentLanguage = "en-US";
		if (tabConfig.hasOwnProperty('language')) {
			currentLanguage = tabConfig.language;
		}

		// Set Translated Name
		var translatedName = tabConfig.name;
		if (tabConfig?.translation?.[currentLanguage]) {
			translatedName = tabConfig.translation[currentLanguage];
		};
		this.translatedName = translatedName;
	}
};

Tabs.defaultTemplate = {
	wrapper: ".sidebar",
	item: ".tabs",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	itemBadge: "",
	container: ".tabs"
};
