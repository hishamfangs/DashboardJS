
/**** Recordset Class
|*		
|*	Recordset Class for creating, attaching and managing
|*	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
|*	Tabs Handle switching from one recordset to another, while
|*	Panels hold the record. 
|* 
|********************/


function Recordset(config, dataManager, templateManager, useExistingElement) {
	Component.call(this, config, dataManager.getData(), templateManager, useExistingElement);
	this.dataManager = dataManager;
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
	var fieldheaderContainer = new FieldHeaderContainer(this.config.recordSettings, this.data, this.templateManager);
	this.append(fieldheaderContainer, "fieldHeader");

	this.removeChildren("records");
	// Create Records inside the RecordSet
	if (this.data instanceof Array) {
		//this.dataManager.goToPage(5);
		for (i in this.data) {
			recordData = this.data[i];
			var record = new Record(this.config.recordSettings, recordData, this.templateManager);
			//console.log(record);
			this.append(record, "records");
		}
	}
	this.switchView(this.config.viewMode);
};

Recordset.prototype.switchView = function (viewMode){

};

Recordset.defaultTemplate = {
	wrapper: "",
	item: ".tab-panel",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: {
		records: ".record-container",
		fieldHeader: ".header"
	}
};
