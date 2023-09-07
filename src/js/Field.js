
/**** Field Class
|*		
|*	Field Class for creating, attaching and managing
|*	Fields on Records. 
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

function Field(settings) {
	Component.call(this, settings);
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
	itemLink: "",
	itemTitle: ".field-title",
	container: ""
};
