
/**** Recordset Class
 *		
 *	Recordset Class for creating, attaching and managing
 *	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
 *	Tabs Handle switching from one recordset to another, while
 *	Panels hold the record. 
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


function Recordset(settings) {
	Component.call(this, {...settings, dataManager: settings.dataManager.getData(), language: settings.language});
	this.dataManager = settings.dataManager;
	this.refresh();
	//console.log(this);

	// Apply Field Grid CSS
	if (this.recordsGrid){
		for (var g in this.recordsGrid){
			this.objects.container.records.style.cssText += g + ":" + this.recordsGrid[g] + ";";
		}
	}
}

Recordset.prototype = Object.create(Component.prototype);
Recordset.prototype.constructor = Recordset;

Recordset.prototype.setDataManager = function(dataManager){
	this.dataManager = dataManager
	this.data = dataManager.getData()
}

Recordset.prototype.refresh = async function (){
	
	//var recordset = this.dashboard.getChild(this.name);
	await this.showLoader();
	this.data = await this.dataManager.refresh();
	this.hideLoader();

	// Create Field Headers
	this.removeChildren("fieldHeader");

	// Get Fields from config object, else if it doesn't exist, automatically generate the fields from the data
	let recordSettings = {};
	if (this?.config?.recordSettings){
		recordSettings = this?.config?.recordSettings;
	}
	if (!this?.config?.recordSettings?.fields){
		recordSettings.fields = this.dataManager.getFieldsFromData();
		this.recordSettings = recordSettings;
	}

	var fieldheaderContainer = new FieldHeaderContainer({config: recordSettings, data: this.data, templateManager: this.templateManager, language: this.language});
	this.append(fieldheaderContainer, "fieldHeader");

	this.removeChildren("records");
	// Create Records inside the RecordSet
	if (this.data instanceof Array) {
		//this.dataManager.goToPage(5);
		for (i in this.data) {
			recordData = this.data[i];
			if (recordData){
				var record = new Record({config: recordSettings, data: recordData, templateManager: this.templateManager, language: this.language});
				//console.log(record);
				this.append(record, "records");	
			}
		}
	}
	this.switchView(this.config.viewMode);

	// Set the Width of the Actions based on the largest action width in the entire recordset
	this.setActionsListViewWidth();

	// Add 'enable-action-menu' Class to indicate that this recordset uses the action-menu
	if (recordSettings.actionsType=="menu"){
		this.addClass("enable-action-menu");
	}
};

Recordset.prototype.switchView = function (viewMode){

};

Recordset.defaultTemplate = {
	container: {
		records: ".record-wrapper",
		fieldHeader: ".fieldheader-wrapper"
	}
};

Recordset.prototype.setActionsListViewWidth = function (){
	// Set the Width of the Actions based on the largest action width in the entire recordset
	let largestWidth = 0;
	// Loop to get the largest Width
	for (let rec in this.children.records){
		let record = this.children.records[rec];
		//let actionsWrapper = record.objects.container.actions;
		let actions = record.children.actions;
		let totalWidth = 0;
		for (let a in actions){
			let action = actions[a];
			totalWidth += action.width;
		}
		if (largestWidth < totalWidth){
			largestWidth = totalWidth;
		}
	}
	// Loop to apply the largest width to all the records.
	for (let rec in this.children.records){
		let record = this.children.records[rec];
		let actionsWrapper = record.objects.container.actions;
		actionsWrapper.style.width = largestWidth + 'px';
	}
	// Apply same width to Action Field Header
	let fieldContainer = this.getChild("FieldHeaderContainer");
	fieldContainer.objects.actionsHeader.style.width = largestWidth + 'px';

}
