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
function ActionsMenu(record, config, dataManager, template, useExistingElement) {
	var actionsMenu = this;
	DashboardElement.call(this, {...config, 
		onClick: function () {
			actionsMenu.toggleMenu();
		}
	}, dataManager, template, useExistingElement);
	this.record = record
	this.record.addClass('actions-menu');

	document.addEventListener('mouseup', function(e) {
		//var theTarget = e.target.closest(actionsMenu.selectors.item);
		if (!actionsMenu.object.contains(e.target)) {
			actionsMenu.closeMenu();
		}
	});
	//this.dashboard = record.dashboard;
	//this.setLink(url);
}
ActionsMenu.prototype = Object.create(DashboardElement.prototype);
ActionsMenu.prototype.constructor = ActionsMenu;

ActionsMenu.prototype.toggleMenu = function () {
	if (this?.record?.object?.classList.contains('open')){
		this.record.removeClass('open')
	}else{
		this?.record?.addClass('open')
	}
};

ActionsMenu.prototype.closeMenu = function () {
	if (this?.record?.object?.classList.contains('open')){
		this.record.removeClass('open')
	}
};

ActionsMenu.defaultTemplate = {
	wrapper: "",
	item: ".kebab-menu",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	itemImage: "",
	container: ""
};
