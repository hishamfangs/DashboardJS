/**** Panel Class
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
function ViewSwitcher(tab, config, data, template, useExistingElement) {
	Component.call(this, config, data, template, useExistingElement);
	this.viewMode = this.viewMode?String(this.viewMode).trim().toLowerCase():'cards';
	this.tab = tab;
	this.dashboard = tab.dashboard;
	this.refresh();
	this.switchView(this.viewMode);
	//console.log(this);
}

ViewSwitcher.prototype = Object.create(Component.prototype);
ViewSwitcher.prototype.constructor = ViewSwitcher;

ViewSwitcher.prototype.refresh = function (){
	if (!this.viewMode){
		this.viewMode = 'cards';
	}
	this.removeChildren();
	this.unhighlight();
	var viewSwitcher = this;
	var cards = new ViewSwitcherButton(this, {
		name: 'cards',
		onClick: function(){
			viewSwitcher.switchView('cards');
		},
		id: this.tab+'_view_cards'
	}, this.templateManager);
	this.append(cards);

	var list = new ViewSwitcherButton(this, {
		name: 'list',
		onClick: function(){
			viewSwitcher.switchView('list');
		},
		id: this.tab+'_view_list'
	}, this.templateManager);
	this.append(list);
	this.renderHighlights();
};

ViewSwitcher.prototype.switchView = function (mode){
	this.viewMode = mode;
	this.tab.viewMode = mode;
	this.dashboard.switchView(mode);
	this.renderHighlights();
};

ViewSwitcher.prototype.renderHighlights = function(){
	this.getChild('cards')?.unhighlight();
	this.getChild('list')?.unhighlight();
	this.getChild(this.viewMode)?.highlight();
};

ViewSwitcher.prototype.unhighlight = function(){
	this.getChild('cards')?.unhighlight();
	this.getChild('list')?.unhighlight();
};

ViewSwitcher.defaultTemplate = {
	wrapper: "",
	item: ".view-tool",
	itemText: ".view-text",
	itemIcon: "",
	itemLink: "",
	container: ".view-container"					
};
