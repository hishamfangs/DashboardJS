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
		tabConfig.dashboard = this.dashboard;

		// Check if ajax Fetch is configured either on the tab level or on the global config level
		var fetch = tabConfig.fetch || this.config.fetch;

		// Load DataManager with configuration
		dataManager = new DataManager({fetch: fetch, tabName:tabConfig.name}, this.data?.[tabConfig.name]);

		var tab = new Tab({tabs: this, config: tabConfig, dataManager: dataManager, templateManager: this.templateManager, language: this.language});
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

		
		// Set Translated Name
		var translatedName = tabConfig.name;
		if (tabConfig?.translation?.[this.language]) {
			translatedName = tabConfig.translation[this.language];
		};
		this.translatedName = translatedName;
		// Check if the data supplied is an array with no tabnames, then use the same data set for all tabs
		if (this.data){
			// Copy the dataset to a originalData
			if (Array.isArray(this.data) && !this.originalData){
				this.originalData = clone(this.data);
				this.data = {};
			}
			if (this.originalData){
				if (!this.data){
					this.data = {};
				}
				this.data[t] = this.originalData;
			}
		}
	}
};

