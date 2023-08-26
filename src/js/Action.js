/**** Action Class
|*		
|*	Actions Class for creating, attaching and managing
|*	Actions on Records. 
|* 
	// Actions Template
	this.template.actions.wrapperSelector = "div.actions";
	this.template.containerSelector = "table.actions tr";
	this.template.itemSelector = ".action";
	this.template.itemTextSelector = ".subtitle";
	this.template.iconSelector = ".action-icon";

	this.template.wrapper = null;
	this.template.container = null;
	this.template.item = $($(actions.wrapperSelector + " " + actions.containerSelector + " " + actions.itemSelector).get(0));;
	this.template.itemText = null;
	this.template.icon = null;

|********************/

function Action(config, data, template, useExistingElement) {
	// Default Language is treated differently in Actions & Fields than it is in the Dashboard & Records.
	// If a language is left blank, for Actions & Fields it will default to "all", which means show for all languages
	// For Dashboard & Records, it defaults to "en-US", so the default language is always english. 
	if (!config.language) {
		config.language = this.language = "all";
	}

	/***************************************************************/
	/******************* Default actions ***************************/
	// Before running the inherited Constructor
	// Check the default Actions if any are found, and set the properties from there
	

	// Call Default 
	DashboardElement.call(this, config, data, template, useExistingElement);

	// The final Action Object
	actionItem = {
		name: this.name,
		domId: this.uid,
		class: this.class,
		icon: this.icon,
		url: this.url,
		onClick: this.onClick,
		language: this.language,
		translation: this.translatedName
	};

	// Set the Text Element
	this.object.querySelector(this.template.selectors.itemText).innerHTML = this.translatedName;

}

Action.prototype = Object.create(DashboardElement.prototype);
Action.prototype.constructor = Action;

Action.defaultTemplate = {
	wrapper: ".actions-container table.actions tr",
	item: ".action",
	itemText: ".subtitle",
	itemIcon: ".action-icon",
	itemLink: "a",
	container: ""
};

