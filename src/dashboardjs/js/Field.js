
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

	// The `value` hook (formerly onGetValue) owns the displayed value outright.
	//
	// Two long-standing surprises are fixed here:
	//   - Returning a falsy value used to be ignored, so a field could not be
	//     blanked. Now only `undefined` means "no opinion"; "" blanks it.
	//   - dataType: "Date" used to overwrite whatever the hook returned. Now the
	//     hook wins, and the date template is the default when it opts out.
	var computed;
	if (this.__computed && typeof this.__computed.value === "function") {
		computed = this.resolve("value", undefined);
	}

	var fieldValue;
	if (computed !== undefined) {
		fieldValue = computed;
	} else if (this.dataType == "Date") {
		fieldValue = this.renderDateValue(this.data);
	} else {
		fieldValue = this.data;
	}

	// Apply Field Value (data)
	fieldValue = ifEmptyReplaceWithSpace(fieldValue);	// If empty string replace with space (to avoid collapsing the row)
	this.setText(fieldValue);
	this.setText(this.translatedName, 'itemTitle');
}

/**
 * Builds the graphical day / month / year markup used by dataType: "Date".
 */
Field.prototype.renderDateValue = function (theDate) {
	var dateTemplate = '<span class="record-date"><span class="calendar-icon"></span><span class="date"><span class="day">{Day}</span><span class="monthyear"><span class="month">{Month}</span><span class="year">{Year}</span></span></span></span>';
	var date = splitDate(theDate, this.language);

	if (date && date.length >= 3) {
		dateTemplate = dateTemplate.replaceAll("{Year}", date[0]);
		dateTemplate = dateTemplate.replaceAll("{Month}", date[1]);
		dateTemplate = dateTemplate.replaceAll("{Day}", date[2]);
	} else {
		dateTemplate = dateTemplate.replaceAll("{Year}", "");
		dateTemplate = dateTemplate.replaceAll("{Month}", "");
		dateTemplate = dateTemplate.replaceAll("{Day}", "");
	}
	return dateTemplate;
};

/**
 * ctx.value - the field's own value. Deliberately distinct from ctx.record:
 * `data` used to mean the value on a Field but the whole row on an Action,
 * and that single overload caused most of the confusion this contract fixes.
 */
Object.defineProperty(Field.prototype, "value", {
	get: function () {
		return this.__valueStatic !== undefined ? this.__valueStatic : this.data;
	},
	set: function (staticValue) {
		// A non-function `value` in the config is a constant for this field.
		this.__valueStatic = staticValue;
	},
	configurable: true,
});

Field.defaultTemplate = {
	itemLink: "",
	itemTitle: ".field-title",
	container: ""
};
