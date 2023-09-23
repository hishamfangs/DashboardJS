
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
	Component.call(this, {...settings, dataManager: settings.dataManager.getData()});
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

	// Get Fields from config object, else if it doesn't exist, generate the fields from the data
	if (this?.config?.recordSettings){
		var recordSettings = this.config.recordSettings;
	}else{
		var recordSettings = {
			fields: this.dataManager.getFieldsFromData()
		}
	}
	var fieldheaderContainer = new FieldHeaderContainer({config: recordSettings, data: this.data, templateManager: this.templateManager});
	this.append(fieldheaderContainer, "fieldHeader");

	this.removeChildren("records");
	// Create Records inside the RecordSet
	if (this.data instanceof Array) {
		//this.dataManager.goToPage(5);
		for (i in this.data) {
			recordData = this.data[i];
			var record = new Record({config: recordSettings, data: recordData, templateManager: this.templateManager});
			//console.log(record);
			this.append(record, "records");
		}
	}
	this.switchView(this.config.viewMode);
};

Recordset.prototype.switchView = function (viewMode){

};

Recordset.defaultTemplate = {
	container: {
		records: ".record-wrapper",
		fieldHeader: ".fieldheader-wrapper"
	}
};
