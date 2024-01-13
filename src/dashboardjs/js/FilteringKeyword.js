/**** FilteringKeyword Class
 *		
 *	FilteringKeyword Class
 * -----------------------------
 *	@param {Object}						settings.filtering										Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function FilteringKeyword(settings) {
	var filteringKeyword = this;
	Component.call(this, settings);
	this.dataManager = settings.dataManager;
	this.filtering = settings.filtering; 
	//console.log(this);
	this.objects.itemClose.addEventListener('click', function(){
		filteringKeyword.close();
	});
	
}

FilteringKeyword.prototype = Object.create(Component.prototype);
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
	itemClose: ".close"
};
