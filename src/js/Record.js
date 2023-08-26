

/**** Record Class
|*		
|*	Record Class for creating, attaching and managing
|*	Records. 
|* 
	// Get Record Template Default Values
	this.template.wrapperSelector = "";
	this.template.containerSelector = ".content-container";
	this.template.itemSelector = ".record";
	this.template.itemIconSelector = ".record-icon";
	this.template.wrapper = null; //$($(record.wrapperSelector)[0]);
	this.template.container = $($(record.wrapperSelector + " " + record.containerSelector)[0]);
	this.template.item = $($(record.wrapperSelector + " " + record.containerSelector + " " + record.itemSelector)[0]);

|********************/
function Record(config, data, template, useExistingElement) {
	DashboardElement.call(this, config, data, template, useExistingElement);

	// Process Field Settings
	this.fields = DashboardElement.getFieldSettings(this.fields, this.language);

	// Apply Default Image
	if (this?.image?.url && data?.[this.image.url]){
		this.setBackgroundImage(data?.[this.image.url], null, {height: this.image.height});
	}else if (this?.image){
		this.setBackgroundImage('assets/defaultImage.jpg', null, {height: this.image.height, 'background-size':'contain'});
	}else{
		this.objects.itemBackgroundImage.hide();
	}

	// Apply Field Grid CSS
	if (this.fieldsGrid){
		for (var f in this.fieldsGrid){
			this.objects.container.fields.style.cssText += f + ":" + this.fieldsGrid[f] + ";";
		}
	}

	// Add Fields
	if (this.fields) {
		var fieldKeys = Object.keys(this.fields);
		for (var i = 0; i < fieldKeys.length; i++) {
			var fieldKey = fieldKeys[i];
			thisFieldSettings = this.fields[fieldKey];
			var field = new Field(thisFieldSettings, data[thisFieldSettings.dataField], template, useExistingElement);
			//console.log(field);
			this.append(field, "fields");
		}
	}

	// Add Actions
	if (this.actions) {
		/*		config.clone = true;
				config.context = this;				
					var actionsContainer = new ActionsContainer(config, data);
		 */
		var actionKeys = Object.keys(this.actions);
		for (var i = 0; i < actionKeys.length; i++) {
			// Loop through the actions object and 
			// Create a config file for each action 
			var actionKey = actionKeys[i];
			var actionConfig = this.actions[actionKey];
			if (actionConfig) {
				if (actionConfig === true) {
					actionConfig = {};
				}
				actionConfig.name = actionKey;
				// Create an action	
				var action = new Action(actionConfig, this.data, template, useExistingElement);

				// Attach action to current Record
				this.append(action, "actions");

			}
		}
		if (this.actionsType == 'menu'){
			var actionsMenu = new ActionsMenu(this, this.config, data, template, useExistingElement)
			this.prepend(actionsMenu, 'actionMenu');	
		}
	}
	
}
Record.prototype = Object.create(DashboardElement.prototype);
Record.prototype.constructor = Record;

Record.defaultTemplate = {
	wrapper: "",
	item: ".record",
	itemText: "",
	itemIcon: ".record-icon",
	itemLink: ".record",
	itemBackgroundImage: ".record-image",
	container: {
		actionMenu: '.action-menu-container',
		fields: ".field-container",
		actions: ".actions-container .actions > tbody > tr"
	}
};

Record.prototype.createFields = function () {
	//this.fields = config
};