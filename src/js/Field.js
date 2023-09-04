
/**** Field Class
|*		
|*	Field Class for creating, attaching and managing
|*	Fields on Records. 
|* 
	// Get Fields Template
	this.template.wrapperSelector = record.wrapperSelector + " " + record.containerSelector + " " + record.itemSelector;
	this.template.containerSelector = ".container-fluid";
	this.template.itemSelector = ".field";
	this.template.itemTextSelector = ".field-value";
	this.template.itemIconSelector = ".icon";
	this.template.itemLinkSelector = ".field-click";

	this.template.wrapper = "";//$($(field.wrapperSelector)[0]);
	this.template.container = $($(field.wrapperSelector + " " + field.containerSelector)[0]);
	this.template.item = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector)[0]);
	this.template.itemText = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector + " " + field.itemTextSelector)[0]);
	this.template.itemIcon = $($(field.wrapperSelector + " " + field.containerSelector + " " + field.itemSelector + " " + field.itemIconSelector)[0]);

|********************/
function Field(config, data, template, useExistingElement) {
	Component.call(this, config, data, template, useExistingElement);

	this.object.setAttribute("class", this.object.getAttribute("class") + " go-" + this.position);

	this.renderFieldValues();
	
	

}
Field.prototype = Object.create(Component.prototype);
Field.prototype.constructor = Field;

Field.prototype.renderFieldValues = function (){

	// Field Value (Data)
	var fieldValue = this.data;
	// Visibility
	visibility = this.visibility;
	var processedValue = "";
	if (this.onGetValue) {
		processedValue = this.onGetValue;
		if (typeof processedValue === "function") {
			processedValue = processedValue(this);
		}
		if (processedValue){
			fieldValue = processedValue;
		}
	}

	//var show = this.show;

	// Date Field is Special, so generate Date Template
	if (this.dataType == "Date") {
		var dateTemplate = '<span class="record-date"><span class="calendar-icon"></span><span class="date"><span class="day">{Day}</span><span class="monthyear"><span class="month">{Month}</span><span class="year">{Year}</span></span></span></span>';
		var theDate = this.data;
		// Date
		var date = splitDate(theDate, this.language);
		if (date) {
			if (date.length >= 3) {
				dateTemplate = dateTemplate.replaceAll("{Year}", date[0]);
				dateTemplate = dateTemplate.replaceAll("{Month}", date[1]);
				dateTemplate = dateTemplate.replaceAll("{Day}", date[2]);
			} else {
				dateTemplate = dateTemplate.replaceAll("{Year}", "");
				dateTemplate = dateTemplate.replaceAll("{Month}", "");
				dateTemplate = dateTemplate.replaceAll("{Day}", "");
			}
		} else {
			dateTemplate = dateTemplate.replaceAll("{Year}", "");
			dateTemplate = dateTemplate.replaceAll("{Month}", "");
			dateTemplate = dateTemplate.replaceAll("{Day}", "");
		}
		fieldValue = dateTemplate;
	}

	// Apply Field Value (data)
	fieldValue = ifEmptyReplaceWithSpace(fieldValue);	// If empty string replace with space (to avoid collapsing the row)
	this.setText(fieldValue);
	this.setText(this.translatedName, 'itemTitle');
}

Field.defaultTemplate = {
	wrapper: ".record",
	item: ".field",
	itemText: ".field-value",
	itemIcon: ".field-icon",
	itemLink: ".field-click",
	itemTitle: ".field-title",
	container: ""
};
