/** 
 *	Dashboard Class
 *	
 *	The Dashboard Class is for creating, attaching and managing dashboards.
 * 	Dashboards contain tabs; and tabs contain recordsets and tools. (like sorting tools, paginations, search, ...etc)
 *	---------------------------------
 *	@param {Object} 					config 														The Config Object
 *  @param {string}						config.config												Required: The config object of the dashboard
 *  @param {string}						config.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	config.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					config.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					config.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						config.url													Optional: the url for the html template
 *
*******************************************/

function Dashboard({config, data, templateManager, useExistingElement, selectors, templateURL, appendTo}) {
	// The Dashboard Element by Default modifies the Existing Template in the current document without cloning it. (useExistingElement = true)
	// Unlike every other Dashboard ELement, which defaults to false (useExistingElement = false), which clones the template to be appended manually
	this.initialize({config, data, templateManager, useExistingElement, selectors, templateURL, appendTo});
}

Dashboard.prototype = Object.create(DashboardElement.prototype);
Dashboard.prototype.constructor = Dashboard;

Dashboard.prototype.initialize = async function ({config, data, templateManager, useExistingElement, selectors, templateURL, appendTo}){

	if (typeof useExistingElement === "undefined"){
		useExistingElement = true;
	}
	if (!templateManager){
		templateManager = new TemplateManager();
	}
	if (templateURL || appendTo){
		templateManager = await this.loadHTML(templateURL, appendTo);
	}
	
	DashboardElement.call(this, config, data, templateManager, useExistingElement, selectors);

	// Create Tab
	if (config.tabs){
		this.loadDashboard();
	}
	if (this.profile){
		var userProfile = new UserProfile(this, { ...this.profile}, [], templateManager);
		this.append(userProfile, 'profile');	
	}
};

Dashboard.prototype.loadHTML = async function (templateURL, appendTo){
	
	if (templateURL || appendTo){
		if (!templateURL || !appendTo){
			alert("Please supply both templateURL & appendTo");
			return;
		}
		/* containerTemplate = new Template({
			name:"Dashboard Container", 
			selectors: {item: appendTo, container: appendTo}, 
			useExistingElement : true
		}); */
		var templateLoader = new FileLoader(templateURL);
		var rootNode = await templateLoader.loadHTML();
		appendTo.appendChild(rootNode);
		var templateManager = new TemplateManager(rootNode);
		return templateManager
		/* if (containerTemplate){
			containerTemplate.append(rootNode);
		} */
	}
}

Dashboard.prototype.loadDashboard = function(){
	var tabs = new Tabs(this, this.config, this.data, this.templateManager);
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
