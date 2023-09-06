/** 
 *	Dashboard Class
 *	
 *	The Dashboard Class is for creating, attaching and managing dashboards.
 * 	Dashboards contain tabs; and tabs contain recordsets and tools. (like sorting tools, paginations, search, ...etc)
 *	---------------------------------
 *	@param {Object} 					settings 														The settings Object
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
****************************************** */

function Dashboard(settings) {
	// The Dashboard Component by Default modifies the Existing Template in the current document without cloning it. (useExistingElement = true)
	// Unlike every other Dashboard ELement, which defaults to false (useExistingElement = false), which clones the template to be appended manually
	settings.config.dashboard = this;
	this.initialize(settings);
}

Dashboard.prototype = Object.create(Component.prototype);
Dashboard.prototype.constructor = Dashboard;

Dashboard.prototype.initialize = async function (settings){

	if (typeof settings.useExistingElement === "undefined"){
		var useExistingElement = true;
	}
	if (!settings.templateManager){
		var templateManager = new TemplateManager();
	}

	Component.call(this, {...settings, templateManager: templateManager, useExistingElement: useExistingElement});
	
	// Await the loading of the template if templateURL is supplied
	await this.loadingTemplate;

	// Create Tab
	if (settings.config.tabs){
		this.loadDashboard();
	}
	if (this.profile){
		debugger;
		var userProfile = new UserProfile({ config: this.profile, dashboard: this, templateManager: this.templateManager});
		this.append(userProfile, 'profile');	
	}
};
/* 
Dashboard.prototype.loadHTML = async function (templateURL, appendTo){
	
	if (templateURL || appendTo){
		if (!templateURL || !appendTo){
			alert("Please supply both templateURL & appendTo");
			return;
		}

		var templateLoader = new FileLoader(templateURL);
		var rootNode = await templateLoader.loadHTML();
		appendTo.appendChild(rootNode);
		var templateManager = new TemplateManager(rootNode);
		return templateManager

	}
} */

Dashboard.prototype.loadDashboard = function(){
	var tabs = new Tabs({config: this.config, data: this.data, templateManager: this.templateManager});
	this.append(tabs, "tabs");
};

Dashboard.prototype.switchView = function (viewMode){
	if (String(viewMode).trim().toLowerCase() == 'cards' || !viewMode){
		this.removeClass('list', 'item');
		this.addClass('cards', 'item');
	}else{
		this.removeClass('cards', 'item');
		this.addClass('list', 'item');
	}
};

Dashboard.defaultTemplate = {
	wrapper: "",
	item: ".dashboard",
	itemText: "",
	tabBreadCrumbs: ".tab-breadcrumbs",
	itemIcon: "",
	itemLink: "",
	container: {
		tabs: ".tabs-container",
		//tab: ".tabs .container-fluid .row",	// Tab Container
		recordset: ".dashboard-content",
		filtering:".filtering",	//
		search:"",
		profile: ".user-profile",
		viewSwitcher:".view-mode",
		sorting:".sort",	//.sort
		paging: ".view-pagination"
	}			
};
