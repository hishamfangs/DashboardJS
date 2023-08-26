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
function Sorting(tab, config, dataManager, template, useExistingElement) {

	DashboardElement.call(this, {...config, 
		onClick: function(){
			this.toggleMenu();
		}}, dataManager.getData(), template, useExistingElement);
	this.dataManager = dataManager;
	this.tab = tab
	this.dashboard = tab.dashboard
	this.createItems();
	this.highlightSelected();
	this.closeMenu();
	var sorting = this; 
	
	document.addEventListener('mouseup', function(e) {
		//var theTarget = e.target.closest(actionsMenu.selectors.item);
		if (!sorting.object.contains(e.target)) {
			sorting.closeMenu();
		}
	});
	//console.log(this);
}
Sorting.prototype = Object.create(DashboardElement.prototype);
Sorting.prototype.constructor = Sorting;

Sorting.prototype.toggleMenu = function(){
	this.template.objects.itemDropDown.toggleClass('open');
};
Sorting.prototype.closeMenu = function(){
	this.removeClass('open', 'itemDropDown');
};

Sorting.prototype.createItems = function (){
	for (var f in this.fields){
		var item = new SortingItem(this, {...this.fields[f], tab: this.tab, fieldKey: f}, [], this.templateManager, false);
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

Sorting.defaultTemplate = {
	wrapper: "",
	item: ".sort",
	itemText: ".sortText",
	itemIcon: "",
	itemLink: "",
	itemBadge: "",
	itemSortingButton: ".buttonText",
	itemDropDown: ".dropdown",
	itemSortingDirection: '.caret',
	container: ".dropdown-menu"
};
