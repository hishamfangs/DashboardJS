/**** Sorting Class
 *		
 *	Sorting Class
 * -----------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab													Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Sorting(settings) {

	Component.call(this, {
		config: {
			...settings.config, 
			onClick: function(){
				this.toggleMenu();
			}
		}, 
		data: dataManager.getData(), 
		templateManager: settings.templateManager, 
		useExistingElement: settings.useExistingElement
	});
	this.dataManager = settings.dataManager;
	this.tab = settings.tab
	this.dashboard = this.tab.dashboard
	this.createItems();
	this.highlightSelected();
	this.closeMenu();
	var sorting = this; 
	
	document.addEventListener('mouseup', function closeSortingMenu(e) {
		//var theTarget = e.target.closest(actionsMenu.selectors.item);
		if (!sorting?.object?.contains(e.target)) {
			sorting.closeMenu();
		}
	});
/* 
	this.onRemove = function (e){
		document.removeEventListener('mouseup', function closeSortingMenu(e) {
			//var theTarget = e.target.closest(actionsMenu.selectors.item);
			if (!sorting.object.contains(e.target)) {
				sorting.closeMenu();
			}
		});
	} */
	//console.log(this);
}
Sorting.prototype = Object.create(Component.prototype);
Sorting.prototype.constructor = Sorting;

Sorting.prototype.toggleMenu = function(){
	this.template.objects.itemDropDown.toggleClass('open');
};
Sorting.prototype.closeMenu = function(){
	this.removeClass('open', 'itemDropDown');
};

Sorting.prototype.createItems = function (){
	for (var f in this.fields){
		var item = new SortingItem({sorting: this, config: {...this.fields[f], tab: this.tab, fieldKey: f}, templateManager: this.templateManager, useExistingElement: false});
		this.append(item)
	}
};

Sorting.prototype.highlightSelected = function (){
	var sortingConfig = this.dataManager.sorting;
	if (sortingConfig && sortingConfig.sortBy){
		this.setText(sortingConfig.sortFieldText,'itemSortingButton');
	}else{
		originalText = this.getTemplate(null, null, false).objects.itemSortingButton.innerHTML;
		this.setText(originalText,'itemSortingButton');
	}
	if (this.dataManager.sorting.sortDirection == DataManager.SORTING.ASC){
		this.addClass('flip', 'itemSortingDirection')
	}else{
		this.removeClass('flip', 'itemSortingDirection')
	}
};

Sorting.defaultTemplate = {
	itemSortingButton: ".buttonText",
	itemDropDown: ".dropdown",
	itemSortingDirection: '.caret'
};
