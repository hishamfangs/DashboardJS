/**** Tabs Class
 *		
 *	Tabs Class for 
 * 
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

function Tabs(settings) {
	Component.call(this, settings);
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

		var tab = new Tab({tabs: this, config: tabConfig, dataManager: dataManager, templateManager: this.templateManager});
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

