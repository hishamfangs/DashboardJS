/**** Component Class
|*		
|*	Base Class for All Dashboard Elements
|*	All Elements will inherit this class
|* 	Arguments:
|*	 	config: a js object literal that contains all the configuration and settings for the dashboard (optional, if nothing supplied, the dashboard will start with the defaults)
|*		data: the data values that will be fed to the dashboard (optional) (takes precident over the data object in the config argument)
|*  Example:
	config = {
		language: "en-US",						// Specifies Display language. Default Language is en-US
		name: "",								// Name of the Item. Default Name is ""
		template: {								// This is an object that contains the template selector as well as a clone of the HTML template in jQuery
			context:{
				object: $("body")
			}
			selectors:{
				wrapper: ".wrapper", 					// Selector for the Wrapper of the Item
				container: ".container", 				// Selector for the Container of the Item
				item: ".dashboard"	 					// Selector for the Item
			},
			objects: {
				wrapper: $(this.selectors.wrapper).clone(),		// JQuery object clone of the Wrapper
				container: $(this.selectors.container).clone(),	// JQuery object clone of the container
				item: $(this.selectors.item).clone()				// JQuery object clone of the template for this item
			}
		},
		data: {},  or data: []			// Can be a single key/value based pair object, or an array of objects.
		clone: true								// Specifies whether the object should be cloned on instantiation
	}											// true if you need to make a new copy of the HTML node everytime you create a new object, or false if you just want to use the existing one on the canvas

	data = [
		{
			Name: "Hisham El Fangary",
			Age: "15",
			Status: "Married",
			Date: "1980-08-10"		
		},{
			Name: "David Jonathan",
			Age: "15",
			Status: "Married",
			Date: "1980-08-10"		
		},{
			Name: "John Doe",
			Age: "15",
			Status: "Married",
			Date: "1980-08-10"		
		},{
			Name: "Damien Pilsner",
			Age: "15",
			Status: "Married",
			Date: "1980-08-10"		
		}
	];

|********************/


function Component(config, data, templateManager, useExistingElement, selectors, templateURL) {
	this.load(config, data, templateManager, useExistingElement, selectors, templateURL);
}

Component.prototype.load = function (config, data, templateManager, useExistingElement, selectors, templateURL){

	// Initialize the element by setting the config properties and adding them to the local scope
	// and set the Data & template 
	this.init(config, data, templateManager, useExistingElement, selectors, templateURL);

	// Render the Element as per the assigned config, data, & template
	this.render();

	// Process the Events set on the element
	// Ex: visibility, icon, onClick, onLoop, url
	this.processEvents();

	//console.log(this.__proto__.constructor.name, this);
};

Component.prototype.init = function (config, data, templateManager, useExistingElement, selectors, templateURL) {
	// Loop through the config properties and add them 
	// to the local context 
	// then add a reference the original copy of config as well.
	if (config) {
		var configKeys = Object.keys(config);
		for (var j in configKeys) {
			propKey = configKeys[j];
			// Check if the config property exists in this context
			//if (this[propKey] === undefined || this[propKey] === null){
			this[propKey] = config[propKey];
			//}
		}
		this.config = clone(config);
	}
	if (this.templateSettings){
/* 		if (this.config.template.selectors){
			this.template.selectors = 
		} */
	}else if (!this.templateSettings) {
		this.templateSettings = {};
		this.templateSettings.selectors = this.__proto__.constructor.defaultTemplate;
	}
	
	if (!selectors) {
		this.templateSettings.selectors = this.__proto__.constructor.defaultTemplate;
	}else{
		this.templateSettings.selectors = selectors;
	}

	if (!useExistingElement){
		this.templateSettings.useExistingElement = false;
	}else{
		this.templateSettings.useExistingElement = true;
	}

	if (templateManager) {
		this.templateManager = templateManager;
	}
	if (templateURL){
		this.templateURL = templateURL;
	}

	// ****************** Setup defaults
	// Order of priority: 
	// Properties in Config take priority over everything
	// Lastly comes the standard defaults (below), these will be set when neither the properties in this. (superclass defaults) nor the properties in config are set.


	if (!config.hasOwnProperty("clone")) {
		// Default Value
		this.clone = true;
	}
	if (!config.hasOwnProperty("language")) {
		// Default Value
		this.language = "en-US";
	}
	if (!config.hasOwnProperty("name")) {
		// Default Value
		this.name = this.__proto__.constructor.name;
	}

	if (!config.hasOwnProperty("class")) {
		// Default Value		
		this.class = "";
	}

	if (!config.hasOwnProperty("style")) {
		// Default Value		
		this.style = null;
	}
	// Translated Name
	var translatedName = this.name;
	if (this.translation) {
		if (this.translation[this.language]) {
			translatedName = this.translation[this.language];
		}
	}
	this.translatedName = translatedName;

	if (data) {
		// Use the passed data, takes priority over data object passed in config
		this.data = data;
	} else if (config.data) {
		// Use the data passed inside the config object
		this.data = config.data;
	} else {
		// Set data to null
		this.data = null;
	}

	if (config.dashboard) {
		this.dashboard = config.dashboard;
	} else {
		this.dashboard = null;
	}

	if (config.onLoop) {
		this.onLoop = config.onLoop;
	}

	// Remove all Events to stop them from cascading down the elements
	if (this.onAdd){
		config.onAdd = null;
		delete config.onAdd;
	}

	// Generate Readable ID from Name
	if (this.config.id){
		this.id = this.config.id;
	}else{
		this.id = this.generateId();
	}

	// Generate Unique ID
	if (this.config.id){
		this.uid = this.config.id;
	}else{
		this.uid = Component.generateRandomId();
	}
};

Component.prototype.render = function () {

	this.template = this.getTemplate();
	var object = this.template.object;

	if (typeof object === "undefined" || typeof object === "null") {
		var object = null;
	} else {
		object.setAttribute("id", this.uid);
		object.setAttribute("class", object.getAttribute("class") + " " + this.class);
		if (this.style){
			for (var s in this.style){
				object.style.cssText += s + ":" + this.style[s] + ";";
			}
		}
	}

	// Set the HTML Object 
	this.object = object;
	this.objects = this.template.objects;
	this.renderValues();

};

// Default Template for every object will be the first div inside your document
Component.defaultTemplate = {
	wrapper: "",
	item: ".tab-content",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: ""
};
/******
 * Template Config File Sample
 * templateConfig = {
 * 		context: {
 *          object: doucment.body,
 *          template: null            
 *      },
 *      objects: {
 *    	    wrapper: doucment.body,
 *          item: $("body > div:first-of-type"),
 *          itemText : "",
 *          itemIcon : "",
 *          itemLink : "",
 *          container: ""
 *      },
 *      selectors: {
 *    	    wrapper: ".body",
 *          item: "body > div:first-of-type",
 *          itemText : "",
 *          itemIcon : "",
 *          itemLink : "",
 *          container: ""
 *      }
 * }
 * 
 */

// Create Node objects from the selectors
// Default selectors are used to create the Node objects ... or
// Optional: 	Any Passed template will take priority over the default selectors & Node objects
// 				You can pass ready Node objects, or custom selectors, or both.  
Component.prototype.getTemplate = function (name, selectors, useExistingElement) { // pass Optional template to override default template
	if (!selectors) {
		selectors = this.templateSettings.selectors
	}
	if (!name) {
		name = this.__proto__.constructor.name
	}
	if (!useExistingElement && useExistingElement!==false) {
		useExistingElement = this.templateSettings.useExistingElement;
	}
	return this.templateManager.getTemplate(name, selectors, useExistingElement)
};

Component.prototype.renderValues = function () {
	// Value of Title
	var value = processedValue = this.name;
/* 	if (this.onGetValue) {
		processedValue = this.onGetValue;
		if (typeof processedValue === "function") {
			processedValue = processedValue(this);
		}
		if (processedValue != null && typeof processedValue != 'undefined' ){
			value = processedValue;
		}
	} */

	// Apply Title
	value = ifEmptyReplaceWithSpace(value);	// If empty string replace with space (to avoid collapsing the row)
	//this.template.objects.itemText.innerHTML = value;
	if (this.template.objects.item) {	
		this.template.objects.item.setAttribute("title", value);
	}

	if (this.template.objects.itemText) {	
		this.setText(value);
	}


/* 
	// Apply visibility
	if (this.show) {
		if (visibility == "disable") {
			this.addClass("disabled");
		}
	} else {
		this.object.children.forEach((item) =>{item.hide()});
	}
 */
	// Apply Image
	if (this.template.objects.itemImage && this.config.image) {
		// Value of Image
		this.setImage(this.config.image);
	} else 	if (this.template.objects.itemBackgroundImage && this.config.image) {
		// Value of Image
		this.setBackgroundImage(this.config.image, null,this.config.imageCardHeight);
	}

	// On Loop Event
	if (this.onLoop) {
		var fieldOnLoopEvent = this.onLoop;
		// Apply the Action
		//console.log("field", field);				
		try {
			fieldOnLoopEvent(this);
		} catch (err) {
			console.log("ERROR in onLoop for Field: " + this.name + ". error: " + err);
		}
	}

};

Component.prototype.generateId = function (optionalName) {
	try {
		var name = optionalName;
		if (!name) {
			name = this.name;
		}
		if (name) {
			var id = Component.generateIdFromName(name);
		} else {
			throw "Warning: " + this + " has no name. A random Id will be generated.";
		}
	} catch (err) {
		console.log(err);
		var id = Component.generateRandomId();
		return id;
	}
	return id;
};

Component.generateIdFromName = function (name) {
	var id = String(name).trim();
	id = id.replace("'", "");
	id = id.replace("\"", "");
	id = id.replace(/[^\w]/gi, '_');
	id = id.toLowerCase();
	return id;
};

Component.generateRandomId = function () {
	// I generate the UID from three parts here
	// to ensure the random number provide enough bits.
	var letterNumber = ((Math.random() * 24) | 0);
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = (Math.random() * 46656) | 0;
	var thirdPart = (Math.random() * 46656) | 0;

	firstLetter = String.fromCharCode(97 + letterNumber);
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	thirdPart = ("000" + thirdPart.toString(36)).slice(-3);
	return firstLetter + firstPart + secondPart + thirdPart;
};

Component.prototype.processEvents = function () {
	visibility = this.visibility;
	var show = false;
	if (typeof visibility === "string") {
		// visibility is set as is, use it to determine show
		if (visibility == "disable" || visibility == "enable" || visibility == "show") {
			show = true;
		} else if (visibility == "hide") {
			show = false;
		} else {
			show = true;
			visibility = "show";
		}
	} else if (typeof visibility === "function") {
		// Run Visibility function
		visibility = visibility(this);
		if (visibility == "disable" || visibility == "enable" || visibility == "show") {
			show = true;
		} else if (visibility == "hide") {
			show = false;
		} else if (visibility === false) {
			show = false;
			visibility = "hide";
		} else {
			show = true;
			visibility = "show";
		}
	} else {
		if (visibility === false || visibility === 0) {
			show = false;
			visibility = "hide";
		} else {
			show = true;
			visibility = "show";
		}
	}

	// Icons
	var icon = null;
	if (this.icon) {
		icon = this.icon;
		if (typeof icon === "function") {
			icon = icon(this);
		}
		if (this.objects.itemIcon) {
			// Apply Icon
			this.addClass(icon, 'itemIcon');
		}
	}

	if (visibility != "show" && visibility != "enable") {
		this.addClass(visibility);
	}

	if (visibility == "show" || visibility == "enable") {
		if (this.url || this.onClick) {
 			if (!this.template.selectors.itemLink) {
				this.template.selectors.itemLink = this.template.selectors.item;
			} 
			if (!this.objects.itemLink){
				this.objects.itemLink = this.objects.item;
			}			
			if (this.url) {
				this.setLink(this.url, null, this.urlTarget);
	
				var url = this.url;
				// Check if it's a function, if it is, expect the url to be returned				
				if (typeof url === "function") {
					url = url(this);
				}
				
				if (!url) {
					// Remove <a> tag
					if (this.object.getElementsByTagName("a").length > 0) {
						this.object.querySelectorAll("a").unwrap();
					}

				} else {
					this.objects.itemLink.setAttribute("href", url);
					if (this.target){
						this.objects.itemLink.setAttribute("target", this.target);
					}
				
				}

				// Stop Event Propagation
				/* 					$( cloned_field ).click(function( event ) {
								event.stopPropagation();
							});  */
			}
			if (this.onClick) {
				// First, check if the user wants to use a default action that exists in Dashboard.defaultActions
				var itemOnClick = this.onClick;
				// Apply the onclick Action
				this.objects.itemLink.classList.add('cursor-pointer');
				this.objects.itemLink.addClickHandler(processOnClick, { "dashboard": this, "record": this.data, "item": this, "theFunction": itemOnClick })
				// Prevent Event Propagation Up the Tree
				this.object.addEventListener('click', stopEventPropagation, false);
			}

		} else {
			// Remove <a> tag
			if (this.object.querySelectorAll(this.template.selectors.item + " > a").length) {
				try{
					this.object.querySelector(this.template.selectors.item + "> a").children[0].unwrap("a");
				}catch(err){

				}
			}
		}
	}else if (visibility == 'disable'){
		if (this.onClick) {
			this.object.addEventListener('click', stopEventPropagation, false);
		}
	}


	// If onLoop event
	if (this.onLoop) {
		this.onLoop(this);
	}

	this.visibility = visibility;
	this.show = show;
	this.onClick = itemOnClick;
	this.url = url;
	this.icon = icon;
};
Component.prototype.setText = function (value, selectorKey){
	this.template.setText(value, selectorKey);
};

Component.prototype.addClass = function (value, selectorKey){
	this.template.addClass(value, selectorKey);
};
Component.prototype.removeClass = function (value, selectorKey){
	try{
		this.template.removeClass(value, selectorKey);
	}catch(err){
		console.log(err)
	}
};

Component.prototype.setImage = function (value, selectorKey){
	this.template.setImage(value, selectorKey);
};

Component.prototype.setBackgroundImage = function (value, selectorKey, height){
	this.template.setBackgroundImage(value, selectorKey, height);
};

Component.prototype.setIcon = function (value, selectorKey){
	this.template.setIcon(value, selectorKey);
};

Component.prototype.removeIcon = function (selectorKey){
	this.template.removeIcon(value, selectorKey);
};

Component.prototype.setLink = function (value, selectorKey, target){
	// If there is no A tag, and the link is to be created on the 'item' itself, then a new link tag is created and returned
	var newLink = this.template.setLink(value, selectorKey, target);

	// Which then will take the place of the existing item in the object tree.
	if (newLink){
		var id = this.object.id;
		this.object.id = this.object.id + "_replaced_by_a_tag"
		this.object = newLink;
		this.objects.item = newLink;
		this.object.id = id;
	}
};

Component.prototype.remove = function(){
	// If onRemove event
	if (this.onRemove) {
		var event = new DashboardEvent();
		event.addCompletedEvent(function(element){
			element.delete();
		}, this);
		this.onRemove(event);
	}else{
		this.delete();
	}
};

Component.prototype.removeChildren = function(selectorKey){
	// If onRemove event
	if (this.onRemove) {
		var event = new DashboardEvent();
		event.addCompletedEvent(function(element){
			for(var c in this.children){
				if (this.children[c] && (!selectorKey || selectorKey == c)){
					for(var cc in this.children[c]){
						if (this.children[c][cc]){
							if (this.children[c][cc]){
								this.children[c][cc].delete();
							}
						}
					}				
				}
			}
			if (selectorKey){
				if (this.children?.[selectorKey]){
					this.children[selectorKey] = [];
				}
			}else{
				for(var c in this.children){
					this.children[c] = [];
				}
			}
		}, this);
		this.onRemove(event);
	}else{
		for(var c in this.children){
			if (this.children[c] && (!selectorKey || selectorKey == c)){
				for(var cc in this.children[c]){
					if (this.children[c][cc]){
						if (this.children[c][cc]){
							this.children[c][cc].delete();
						}
					}
				}				
			}
		}
		if (selectorKey){
			if (this.children?.[selectorKey]){
				this.children[selectorKey] = [];
			}
		}else{
			for(var c in this.children){
				this.children[c] = [];
			}
		}
	}
};

Component.prototype.delete = function(){
	try{
		this.object.parentNode.removeChild(this.object);
	}catch(er){

	}
	for (var a in this){
		if (this.hasOwnProperty(a)){
			delete this[a];
		}
	}
};

/* 
Component.prototype.append = function (childObject, containerSelector) {	// Append to an optional Container
	try {
		if (this.object) {
			if (childObject.object) {
				// Define the container, if optional containerSelector is passed, use that container instead
				var container = this.template.selectors.container;
				if (containerSelector) {
					if (typeof container == "string"){
						container = containerSelector;
					}else{
						container = this.template.selectors.container[containerSelector];
						if (!container){
							container = containerSelector;
						}
					}
				}
				// If a container is defined, append to the container, if not, append to the item itself
				if (container && container != "") {
					this.object.querySelectorAll(container).appendChild(childObject.object);
				} else {
					this.object.appendChild(childObject.object);
				}
			} else {
				throw "Error: " + childObject.name + " has no jQuery Object.";
			}
		} else {
			throw "Error: " + this.name + " has no jQuery Object.";
		}
	} catch (err) {
		console.log(err);
	}
} */
Component.prototype.append = function (childElement, containerSelector) {	// Append to an optional Container
	try {
		pContainer = "container";
		this.template.append(childElement, containerSelector);
		if (!this.children){
			this.children = {};
		}
		if (containerSelector){
			pContainer = containerSelector;
		}
		if (this.children[pContainer]){
			var oldElement = this.children[pContainer];
			if (oldElement instanceof Array){
				this.children[pContainer].push(childElement)
			}else{
				this.children[pContainer] = new Array();
				this.children[pContainer].push(oldElement);
				this.children[pContainer].push(childElement);	
			}
		}else{
			this.children[pContainer] = [childElement];
		}
	} catch (err) {
		console.log(err);
	}
	
	if (childElement.onAdd) {
		var event = new DashboardEvent();
		childElement.onAdd(event);
/* 		event.addCompletedEvent(function(ev, element){
			
		}, this);	 */
	}		
}

Component.prototype.prepend = function (childElement, containerSelector) {
	try {
		var pContainer = "container";
		this.template.prepend(childElement, containerSelector);
		if (!this.children){
			this.children = {};
		}
		if (containerSelector){
			pContainer = containerSelector;
		}
		if (this.children[pContainer]){
			var oldElement = this.children[pContainer];
			if (oldElement instanceof Array){
				this.children[pContainer].unshift(childElement)
			}else{
				this.children[pContainer] = new Array();
				this.children[pContainer].unshift(oldElement);
				this.children[pContainer].unshift(childElement);	
			}
		}else{
			this.children[pContainer] = [childElement];
		}

	} catch (err) {
		console.log(err);
	}
	
	if (this.onAdd) {
		var event = new DashboardEvent();
		this.onAdd(event);
/* 		event.addCompletedEvent(function(ev, element){
			
		}, this);	 */
	}
}

/* 
Component.prototype.appendTo = function (parentObject){
	try{
		if (this.object){
			if (parentObject.object){
                // If a container is defined, append to the container, if not, append to the item itself
                if (this.template.selectors.container && this.template.selectors.container!=""){
                    this.object.querySelectorAll(this.template.selectors.container).appendTo(parentObject.object);
                }else{
                    this.object.appendTo(parentObject.object);
                }                
			}else{
				throw "Error: " + parentObject.name + " has no jQuery Object.";
			}
		}else{
			throw "Error: " + this.name + " has no jQuery Object.";
		}
	}catch(err){
		console.log(err);
	}
}
 */

Component.getFieldSettings = function (fields, language) {

	// Check if a Tab Object is Passed
	if (typeof fields === "object") {

		//console.log("Original Tab is ", originalTab);
		//var dataset = tab.data;
		//console.log("Dataset for Original Tab is ", dataset);

		// Get the Field Settings for the current tab
		var specifiedFields = fields;
		//var showAllFields = tab.config?.records?.showAllFields;

		// Set Show All Fields Default Value = false;
		/* if (!tab.config?.records.hasOwnProperty('showAllFields')) {
			showAllFields = false;
		} */

		// Set Language, Default Value = en-US
		var currentLanguage = language?language:"en-US";


	// Set the Main Values
	var processedFieldSettings = {};

	//************************* Generates Headers
	// If the fields are specified in a list, and it is set to Not show all fields,
	// OR if fields were specified and no Dataset was sent 
	// then only loop through the specified field list.
	// Otherwise, loop through all the fields from the dataset

/* 	if ((specifiedFields && !showAllFields) || (specifiedFields && !dataset)) {
		// Loop through the Specified Fields only
		theFieldsLooper = specifiedFields;
	} else if (showAllFields) {
		// Loop through the Supplied Fields from the first row of the dataset
		// To get the Headers
		theFieldsLooper = {};
		if (dataset && typeof dataset === "object") {
			if (dataset instanceof Array) {
				if (dataset.length > 0) {
					theFieldsLooper = dataset[0];
				}
			} else {
				theFieldsLooper = dataset;
			}
		}
	} */

	var fieldKeys = Object.keys(fields);
	for (var i = 0; i < fieldKeys.length; i++) {
		var fieldKey = fieldKeys[i];
		// Field Object from the Specified Fields if exists
		var fieldSettings = fields[fieldKey];

		// Assign Default Values
		var name = fieldKey;
		var fieldKey = fieldKey;
		var visible = true;
		var language = "all";
		var className = "";
		var dataType = "String";
		var url = "";
		var position = "center";
		var onClickFunction = null;
		var translation = null;
		var translatedName = null;

		// Check if the fields are Specified, if so, overwrite default values
		if (fieldSettings) {
			// get name
			if (fieldSettings.hasOwnProperty('name')) {
				name = fieldSettings.name;
			}
			// get visibility 
			if (fieldSettings.hasOwnProperty('visible')) {
				visible = fieldSettings.visible;
			}

			// get Language 
			if (fieldSettings.hasOwnProperty('language')) {
				language = fieldSettings.language;
			}

			// get Classname 
			if (fieldSettings.hasOwnProperty('class')) {
				className = fieldSettings.class;
			}

			// get DataType 
			if (fieldSettings.hasOwnProperty('dataType')) {
				dataType = fieldSettings.dataType;
			}

			// get URL 
			if (fieldSettings.hasOwnProperty('url')) {
				url = fieldSettings.url;
			}

			// get onClick 
			if (fieldSettings.hasOwnProperty('onClick')) {
				onClickFunction = fieldSettings.onClick;
			}

			// get position 
			if (fieldSettings.hasOwnProperty('position')) {
				position = fieldSettings.position;
			}

			// Translation
			if (fieldSettings.hasOwnProperty('translation')) {
				translation = fieldSettings.translation;
			}


		}
		if (visible && (language == currentLanguage || language == "all")) {
			var translatedName = name;
			if (translation) {
				if (translation[currentLanguage]) {
					var translatedName = translation[currentLanguage];
				}
			}
			processedFieldSettings[fieldKey] = {};
			processedFieldSettings[fieldKey].fieldKey = fieldKey;
			processedFieldSettings[fieldKey].name = name;
			processedFieldSettings[fieldKey].translatedName = translatedName;
			processedFieldSettings[fieldKey].visible = visible;
			processedFieldSettings[fieldKey].language = language;
			processedFieldSettings[fieldKey].class = className;
			processedFieldSettings[fieldKey].position = position;
			processedFieldSettings[fieldKey].dataType = dataType;
			processedFieldSettings[fieldKey].dataField = fieldKey;
			processedFieldSettings[fieldKey].url = url;
			processedFieldSettings[fieldKey].onClick = onClickFunction;
			processedFieldSettings[fieldKey].translation = translation;

			// Loop through the remaining fieldProperties and add them if they don't exist
			var processedField = processedFieldSettings[fieldKey];
			if (fieldSettings && (typeof fieldSettings === "object" || typeof fieldSettings === "array")) {
				var fieldPropertyKeys = Object.keys(fieldSettings);
				for (var j in fieldPropertyKeys) {
					propKey = fieldPropertyKeys[j];
					// Check if the field exists in the processedFields
					if (processedField[propKey] === undefined || processedField[propKey] === null) {
						processedField[propKey] = fieldSettings[propKey];
					}
				}
			}
		}
	}
	return processedFieldSettings;

	}

};

Component.prototype.fadeOut = function() {

	var fadeTarget = this.object;
	var fadeEffect = setInterval(function () {
		try{
			if (!fadeTarget.style.opacity) {
					fadeTarget.style.opacity = 1;
			}
			if (fadeTarget.style.opacity > 0) {
					fadeTarget.style.opacity -= 0.1;
			} else {
					clearInterval(fadeEffect);
			}			
		}catch(err){
			clearInterval(fadeEffect);
		}
	}, 50);
}

Component.prototype.fadeLeft = function() {
	var fadeTarget = this.object;
	fadeTarget.style.position = "absolute";
	var event = new DashboardEvent();
	var fadeEffect = setInterval(function () {
		try{
			if (!fadeTarget.style.opacity) {
					fadeTarget.style.opacity = 1;
			}
			if (!fadeTarget.style.marginLeft) {
				fadeTarget.style.marginLeft = "0%";
			}		
			if (!fadeTarget.style.marginRight) {
				fadeTarget.style.marginRight = "0%";
			}						
			if ((parseInt(fadeTarget.style.marginRight)) < 150) {
					//fadeTarget.style.opacity -= 0.05;
					fadeTarget.style.marginLeft = (parseInt(fadeTarget.style.marginLeft) - 5) + "%";
					fadeTarget.style.marginRight = (parseInt(fadeTarget.style.marginRight) + 5) + "%";
			} else {			
					clearInterval(fadeEffect);
					event.triggerCompleted();
			}			
		}catch(err){
			clearInterval(fadeEffect);
			event.triggerCompleted();
		}
	}, 10);
	return event;
}


Component.prototype.fadeRight = function() {
	var fadeTarget = this.object;
	var fadeEffect = setInterval(function () {
		try{
			if (!fadeTarget.style.opacity) {
					fadeTarget.style.opacity = 1;
			}
			if (!fadeTarget.style.marginRight ) {
				fadeTarget.style.marginRight = 0;
		}			
			if (fadeTarget.style.opacity > 0) {
					fadeTarget.style.opacity -= 0.1;
					fadeTarget.style.marginRight = (parseInt(fadeTarget.style.marginRight) - 20) + "px";
			} else {
					clearInterval(fadeEffect);
			}
		}catch(err){
			clearInterval(fadeEffect);
		}
	}, 50);
}


Component.prototype.fadeInLeft = function() {
	var fadeTarget = this.object;
	//fadeTarget.style.opacity = 0;
	var event = new DashboardEvent();
	
	var fadeEffect = setInterval(function () {
		try{
		
			if (!fadeTarget.style.opacity) {
					//fadeTarget.style.opacity = 1;
			}
			if (!fadeTarget.style.marginRight) {
				fadeTarget.style.marginRight = "-150%";
			}	
			if (!fadeTarget.style.marginLeft) {
				fadeTarget.style.marginLeft = "150%";
			}						
			if ((parseInt(fadeTarget.style.marginRight) + 8) <= 0) {
					//fadeTarget.style.opacity = parseFloat(fadeTarget.style.opacity) + 0.13;
					fadeTarget.style.marginRight = (parseInt(fadeTarget.style.marginRight) + 8) + "%";
					fadeTarget.style.marginLeft = (parseInt(fadeTarget.style.marginLeft) - 8) + "%";
			} else {
					clearInterval(fadeEffect);
					fadeTarget.style.opacity = 1;
					fadeTarget.style.marginRight = "0%";
					fadeTarget.style.marginLeft = "0%";
					event.triggerCompleted();					
			}			
		}catch(err){
			clearInterval(fadeEffect);
			fadeTarget.style.opacity = 1;
			fadeTarget.style.marginRight = "0px";			
			fadeTarget.style.marginLeft = "0px";			
			event.triggerCompleted();
		}
	}, 5);
	return event;
}

Component.prototype.getChild = function(name, containerKey){
	// If containerKey is specified
	if (containerKey){
		if (this.children[containerKey]){
			for(var cc in this.children[containerKey]){
				if (this.children[containerKey][cc]){
					if (this.children[containerKey][cc].name == name){
						return this.children[containerKey][cc];
					}
				}
			}		
	
		}
	}else{
	// Children that are added to the container's children
		for(var c in this.children){
			if (this.children[c]){
				for(var cc in this.children[c]){
					if (this.children[c][cc]){
						if (this.children[c][cc].name == name){
							return this.children[c][cc];
						}
					}
				}				
			}
		}
	}
};

Component.prototype.showLoader = async function (){
	this.addClass('loader-fade');
	await new Promise(resolve => setTimeout(()=>{
		this.addClass('loader');
		resolve();
	}, 100));
	
};

Component.prototype.hideLoader = function (){
	this.removeClass('loader');
	setTimeout(()=>{
		this.removeClass('loader-fade');
		// In case The loader was not removed
		//setTimeout(()=>{this.removeClass('loader');
	}, 1000);
};

Component.prototype.getChildById = function(id){
	// Children that are added directly to the container
	for(var c in this.children.container){

		if (this.children.tab[c]){
			if (this.children.tab[c].id == id){
				return this.children.tab[c];
			}
		}
	}
	// Children that are added to the container's children
	for(var c in this.children){

		if (this.children[c]){
			for(var cc in this.children[c]){
				if (this.children[c][cc]){
					if (this.children[c][cc].id == id){
						return this.children[c][cc];
					}			
				}
			}
		}
	}
};