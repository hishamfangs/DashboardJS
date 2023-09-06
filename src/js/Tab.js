/**** Tab Class
 *		
 *	Recordset Class for creating, attaching and managing
 *	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
 *	Tabs Handle switching from one recordset to another, while
 *	Panels hold the record. 
 * ---------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Tab(settings) {
	this.active = false;
	// Make a copy as to not modify original config
	var tabConfig = {...settings.config};
	if (!tabConfig.onClick){
		tabConfig.onClick = function (){
			this.setActive(true);
			settings.tabs.goToTab(tabConfig.name);	
		};
	}

	Component.call(this, {config: tabConfig, data: settings.dataManager.getData(), templateManager: settings.templateManager, useExistingElement: settings.useExistingElement});

	this.dataManager = settings.dataManager;
	this.tabs = settings.tabs;
	this.dashboard = this.tabs.dashboard;
	//this.dashboard = settings.config.dashboard;
	// Save Original Config without the OnClick added, so we can pass it down to the Recordset.
	this.originalConfig = {...settings.config};
	this.refreshCount();
};

Tab.prototype = Object.create(Component.prototype);
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
	this.fields = Component.getFieldSettings(this.recordSettings.fields, this.language);
	
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
		recordset = new Recordset({config: this.originalConfig, dataManager: this.dataManager, templateManager: this.templateManager});
		this.dashboard.append(recordset, "recordset");			
	}
};

Tab.prototype.setPagination = function (){
	var pagination = new Paging({tab: this, config: {name: this.name}, dataManager: this.dataManager, templateManager: this.templateManager, useExistingElement:true});
	this.pagination = pagination;
};

Tab.prototype.setFiltering = function (){
	var filtering = this.dashboard.getChild('Search')
	if (filtering){
		filtering.remove();
	}
	var filtering = new Filtering({tab: this,  config: {name: 'Search'}, dataManager: this.dataManager, templateManager: this.templateManager});
	this.dashboard.append(filtering, 'filtering');
};

Tab.prototype.setSorting = function (){
	var sorting = new Sorting({tab: this, config: {fields: this.fields, name: 'Sort By'}, dataManager: this.dataManager, templateManager: this.templateManager, useExistingElement:true});
};

Tab.prototype.setView = function (){
	var viewSwitcher = this.dashboard.getChild('View')
	if (viewSwitcher){
		viewSwitcher.remove();
	}
	var viewSwitcher = new ViewSwitcher({tab: this, config: {name: 'View', viewMode: this.viewMode}, dataManager: this.dataManager, templateManager: this.templateManager});
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
