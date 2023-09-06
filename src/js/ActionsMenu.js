/**** ActionsMenu Class
 *		
 *	Class for switching the Action Buttons to a Drop Down Menu
 * ---------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.record												Required: A Reference to the record object where the menu will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function ActionsMenu({record, config, data, templateManager, useExistingElement}) {
	var actionsMenu = this;
	Component.call(this, {
		config: {
			...config, 
			onClick: function () {
				actionsMenu.toggleMenu();
			}
		}, 
		data: data, 
		templateManager: templateManager, 
		useExistingElement: useExistingElement
	});
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
ActionsMenu.prototype = Object.create(Component.prototype);
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
