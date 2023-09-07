/**** SortingItem Class
|*		
|*	SortingItem Class
 * -----------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.sorting											Required: A Reference to the sorting object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function SortingItem(settings) {
	
	settings.config.onClick = function (){
		// Toggle Sorting Direction
		settings.sorting.dataManager.toggleSorting();
		settings.sorting.dataManager.sort({
			sortBy: settings.config.fieldKey,
			sortFieldText: settings.config.name
		});
		
		//tab.dashboard.getChild(tab.name, 'recordset').remove()
		settings.sorting.toggleMenu();
		settings.sorting.tab.tabs.goToTab(settings.sorting.tab.name);
	}
	Component.call(this, settings);
	this.dataManager = settings.dataManager;
	this.sortDirection = "asc"
}

SortingItem.prototype = Object.create(Component.prototype);
SortingItem.prototype.constructor = SortingItem;

SortingItem.prototype.create = function (active){


}; 
