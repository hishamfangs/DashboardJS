

/**** Record Class
 *		
 *	Record Class for creating, attaching and managing
 *	Records. 
 * ---------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Record(settings) {
	Component.call(this, settings);
	// Process Field Settings
	this.fields = Component.getFieldSettings(this.fields, this.language);

	// Apply Default Image
	if (this?.image?.url && this.data?.[this.image.url]){
		this.setBackgroundImage(this.data?.[this.image.url], null, {height: this.image.height});
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
			var field = new Field({config: thisFieldSettings, data: this.data[thisFieldSettings.dataField], templateManager: this.templateManager, useExistingElement: this.useExistingElement});
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
				var action = new Action({config: actionConfig, data: this.data, templateManager: this.templateManager, useExistingElement: this.useExistingElement});

				// Attach action to current Record
				this.append(action, "actions");

			}
		}
		if (this.actionsType == 'menu'){
			var actionsMenu = new ActionsMenu({record: this, config: this.config, data: this.data, templateManager: this.templateManager, useExistingElement: this.useExistingElement})
			this.prepend(actionsMenu, 'actionMenu');	
		}
	}
	
}
Record.prototype = Object.create(Component.prototype);
Record.prototype.constructor = Record;

Record.defaultTemplate = {
	itemBackgroundImage: ".record-image",
	container: {
		actionMenu: '.actionsmenu-wrapper',
		fields: ".fields-wrapper",
		actions: ".actions-wrapper"
	}
};

Record.prototype.createFields = function () {
	//this.fields = config
};