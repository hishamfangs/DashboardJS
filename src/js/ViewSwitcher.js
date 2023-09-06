/**** ViewSwitcher Class
|*		
|*	ViewSwitcher Class
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

function ViewSwitcher(settings) {
	Component.call(this, settings);
	this.viewMode = this.viewMode?String(this.viewMode).trim().toLowerCase():'cards';
	this.tab = settings.tab;
	this.dashboard = settings.tab.dashboard;
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
	var cards = new ViewSwitcherButton({
		viewSwitcher: this, 
			config: {
				name: 'cards',
				onClick: function(){
					viewSwitcher.switchView('cards');
				},
				id: this.tab+'_view_cards'
			}, 
		templateManager: this.templateManager
	});
	this.append(cards);

	var list = new ViewSwitcherButton({
		viewSwitcher: this, 
		config: {
			name: 'list',
			onClick: function(){
				viewSwitcher.switchView('list');
			},
			id: this.tab+'_view_list'
		}, 
		templateManager: this.templateManager
	});
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
