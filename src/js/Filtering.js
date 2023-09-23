/**** Filtering Class
 *		
 *	Filtering Class for searching and filtering through recordsets
 *	---------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab												Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Filtering(settings) {
	var filtering = this;
	Component.call(this, {...settings, data: settings.dataManager.getData()});
	this.dataManager = settings.dataManager;
	this.tab = settings.tab
	this.dashboard = this.tab.dashboard

	this.objects.itemButton.addEventListener('click', onClickFiltering);
	this.objects.itemInput.addEventListener('keyup', function(event) {
		if (event.key === "Enter") {
			onClickFiltering();
		}
	});
	this.refresh();

	function onClickFiltering(){
		filtering.addKeyword(filtering.objects.itemInput.value);
		filtering.clearInput();
	}
	//console.log(this);
}
Filtering.prototype = Object.create(Component.prototype);
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
		var keyword = new FilteringKeyword({filtering: this, config: {...this.config, name: pKeyword}, dataManager: this.dataManager, templateManager: this.templateManager, useExistingElement: false});
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
	debugger;
	this.tab.pagination.refresh();
	//this.tab.tabs.refresh();
};
Filtering.prototype.clearInput = function (){
	this.objects.itemInput.value = '';
};
Filtering.prototype.filterRecordset = function (){

};

Filtering.defaultTemplate = {
	itemInput: "input",
	itemButton: ".search-button"
};
