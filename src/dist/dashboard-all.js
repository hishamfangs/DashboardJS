var FutureLabs = (function () {/**** Action Class
 *		
 *	Actions Class for creating, attaching and managing
 *	Actions on Records. 
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

function Action(settings) {
	// If an action language is left blank, for Actions & Fields it will default to "all", which means show for all languages
	if (!settings.config.language) {
		settings.config.language = "all";
	}
	if (!settings.config.width){
		settings.config.width = 60;
	}
	// Call Default 
	Component.call(this, settings);
}

Action.prototype = Object.create(Component.prototype);
Action.prototype.constructor = Action;


/**** ActionsContainer Class
|*		
|*	Recordset Class for creating, attaching and managing
|*	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
|*	Tabs Handle switching from one recordset to another, while
|*	Panels hold the record. 
|* 
	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $(this.template.panel.itemSelector);

|********************/
// TODO: Obsolete. Delete Or Merge with Record.
// Ideally this should be used for Actions containers

function ActionsContainer(config, data, template, useExistingElement) {
	Component.call(this, config, data, template, useExistingElement);
	this.actions = config.actions;

	if (this.actions) {
		var actionKeys = Object.keys(this.actions);
		for (var i = 0; i < actionKeys.length; i++) {
			var actionKey = actionKeys[i];
			var actionSettings = {};
			actionSettings.name = actionKey;
			actionSettings.settings = this.actions[actionKey];
			var action = new Action(actionSettings, data, template, useExistingElement);
			console.log(action);
			this.append(action);
		}
	}
	console.log(this);
}
ActionsContainer.prototype = Object.create(Component.prototype);
ActionsContainer.prototype.constructor = ActionsContainer;
/*

	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	$(this.template.tab.itemSelector).remove();
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $($(this.template.panel.itemSelector).get(0));

*/

ActionsContainer.prototype.getTemplate = function (templateConfig) {	// pass Optional template to override default template
	var template = Component.prototype.getTemplate.call(this, templateConfig);
	return template;
}

ActionsContainer.defaultTemplate = {
	wrapper: ".actions-container",
	item: ".actions",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: "tr"
};

/**** ActionsMenu Class
 *		
 *	Class for switching the Action Buttons to a Drop Down Menu
 * ---------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.record												Required: A Reference to the record object where the menu will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function ActionsMenu({record, config, data, templateManager, useExistingElement}) {
	var actionsMenu = this;
	Component.call(this, {
		config: {
			...config, 
			onClick: function () {
				actionsMenu.toggleMenu();
			}
		}, 
		data: data, 
		templateManager: templateManager, 
		useExistingElement: useExistingElement
	});
	this.record = record
	this.record.addClass('actions-menu');

	document.addEventListener('mouseup', function(e) {
		//var theTarget = e.target.closest(actionsMenu.selectors.item);
		if (!actionsMenu.object.contains(e.target)) {
			actionsMenu.closeMenu();
		}
	});
	//this.dashboard = record.dashboard;
	//this.setLink(url);
}
ActionsMenu.prototype = Object.create(Component.prototype);
ActionsMenu.prototype.constructor = ActionsMenu;

ActionsMenu.prototype.toggleMenu = function () {
	if (this?.record?.object?.classList.contains('open')){
		this.record.removeClass('open')
	}else{
		this?.record?.addClass('open')
	}
};

ActionsMenu.prototype.closeMenu = function () {
	if (this?.record?.object?.classList.contains('open')){
		this.record.removeClass('open')
	}
};

/**** Component Class
 *		
 *	Base Class for All Dashboard Components
 *	All Components will inherit this class
 * 	Arguments:
 *	 	config: a js object literal that contains all the configuration and settings for the dashboard (optional, if nothing supplied, the dashboard will start with the defaults)
 *		data: the data values that will be fed to the dashboard (optional) (takes precident over the data object in the config argument)
 *	---------------------------------
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

function Component(settings) {
	// Returns a Promise that is waiting for the template to be loaded, and saves it to this.loadingTemplate 
	// so if required when you use templateURL property, you can check the Promise if the template is loaded before continuing
	this.loadingTemplate = this.load(settings);
}

Component.prototype.load = async function (settings){

	// Initialize the Component by setting the config properties and adding them to the local scope
	// and set the Data & template 
	this.init(settings);

	// Render the Component as per the assigned config, data, & template
	await this.render();

	// Process the Events set on the Component
	// Ex: visibility, icon, onClick, onLoop, url
	if (this.object){
		// make sure the object is rendered
		this.processEvents();
	}else{
		console.log('HTML Node for: ' + this.constructor.name + ' doesn\'t exist or has been removed from the DOM.');
	}

	//console.log(this.__proto__.constructor.name, this);
};

Component.prototype.init = function ({config, data, templateManager, useExistingElement, selectors, templateURL, appendTo, language}) {
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

	if (templateURL){
		this.templateURL = templateURL;
	}
	if (appendTo){
		this.appendTo = appendTo;
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
	if (language) {
		// Default Value
		this.language = language;
	}else {
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

Component.prototype.render = async function () {

	// Load Template From URL and use it to generate a Template Manager for this component.
	if (this.templateURL){
		this.templateManager = await this.loadHTML(this.templateURL, this.appendTo);
	}
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
		if (this.width){
			if (String(this.width).indexOf("px")>-1 || String(this.width).indexOf("%")>-1){
				object.style.width = this.width;
			}else{
				object.style.width = this.width+"px";
			}
		}
	}

	// Set the HTML Object 
	this.object = object;
	this.objects = this.template.objects;
	this.renderValues();

};

Component.prototype.loadHTML = async function (templateURL, appendTo){
	
	if (templateURL){
		var templateLoader = new FileLoader(templateURL);
		var rootNode = await templateLoader.loadHTML();
		if (appendTo){
			let appendToObject = document.querySelector(appendTo);
			appendToObject.appendChild(rootNode);
		}
		var templateManager = new TemplateManager(rootNode);
		return templateManager
	}
}


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
	if (this.translatedName){
		value = this.translatedName
	}
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

Component.getDefaultFieldWidth = function (fields){
	let numOfFields = Object.keys(fields).length;
	let pixels = 0;
	let percentages = 0;
	for (var key in fields) {
		if (fields.hasOwnProperty(key)) {
			var fieldSettings = fields[key];
			if (fieldSettings.width){
				numOfFields--;
				if (fieldSettings.width.indexOf("%")>-1){
					percentages += parseFloat(fieldSettings.width.replace("%", ""));
				}else if (fieldSettings.width.indexOf("px")>-1){
					pixels += parseFloat(fieldSettings.width.replace("px", ""));
				}
			}
		}
	}
	return 'calc(((100% - '+percentages+'%) - '+pixels+'px) / '+numOfFields+')';
};

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
/** 
 *	Dashboard Class
 *	
 *	The Dashboard Class is for creating, attaching and managing dashboards.
 * 	Dashboards contain tabs; and tabs contain recordsets and tools. (like sorting tools, paginations, search, ...etc)
 *	---------------------------------
 *	@param {Object} 					settings 														The settings Object
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 * 	@param {string}						settings.language											Optional: the language & culture of the Dashboard (defaults to en-US)
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
****************************************** */

function Dashboard(settings) {
	// The Dashboard Component requires a settings object, with a config object attached, however, if none exist, a default one is created.
	if (!settings){
		settings = {};
	}
	if (!settings.config){
		settings.config = {
			initialActiveTab: "All Records",
			tabs: {
				'All Records':{
					
				}
			}
		}
	}

	settings.config.dashboard = this;
	this.initialize(settings);
}

Dashboard.prototype = Object.create(Component.prototype);
Dashboard.prototype.constructor = Dashboard;

Dashboard.prototype.initialize = async function (settings){
	// The Dashboard Component by Default modifies the Existing Template in the current document without cloning it. (useExistingElement = true)
	// Unlike every other Component, which defaults to false (useExistingElement = false), which clones the template to be appended manually
	// Unless appendTo is passed, which overrides useExistingElement and set it to false.
	if (typeof settings.useExistingElement === "undefined"){
		var useExistingElement = true;
	}
	if (!settings.templateManager){
		var templateManager = new TemplateManager();
	}

	Component.call(this, {...settings, templateManager: templateManager, useExistingElement: useExistingElement});
	
	// Await the loading of the template if templateURL is supplied
	await this.loadingTemplate;

	// Create Tab
	if (settings.config.tabs){
		this.loadDashboard();
	}
	if (this.profile){
		var userProfile = new UserProfile({ config: this.profile, dashboard: this, templateManager: this.templateManager, language: this.language});
		this.append(userProfile, 'profile');	
	}
};
/* 
Dashboard.prototype.loadHTML = async function (templateURL, appendTo){
	
	if (templateURL || appendTo){
		if (!templateURL || !appendTo){
			alert("Please supply both templateURL & appendTo");
			return;
		}

		var templateLoader = new FileLoader(templateURL);
		var rootNode = await templateLoader.loadHTML();
		appendTo.appendChild(rootNode);
		var templateManager = new TemplateManager(rootNode);
		return templateManager

	}
} */

Dashboard.prototype.loadDashboard = function(){
	var tabs = new Tabs({config: this.config, data: this.data, templateManager: this.templateManager, language: this.language});
	this.append(tabs, "tabs");
};

Dashboard.prototype.switchView = function (viewMode){
	if (String(viewMode).trim().toLowerCase() == 'cards' || !viewMode){
		this.removeClass('list', 'item');
		this.addClass('cards', 'item');
	}else{
		this.removeClass('cards', 'item');
		this.addClass('list', 'item');
	}
};

Dashboard.defaultTemplate = {
	tabBreadCrumbs: ".tab-breadcrumbs",
	container: {
		tabs: ".tabs-wrapper",
		recordset: ".recordset-wrapper",
		filtering:".filtering-wrapper",
		profile: ".userprofile-wrapper",
		viewSwitcher:".viewswitcher-wrapper",
		sorting:".sorting-wrapper",
		//paging: ".paging-wrapper"
	}			
};

/**** DashboardEvent Class
|*		
|*	DashboardEvent Class for creating, and Managing Custom Events
|*	
|* 
|********************/

function DashboardEvent(){
	this.completed = false;
	this.succeeded = false;
	this.failed = false;
	this.successEvent = {
			functionToRun: function(){},
			params: {}
	}
	this.failureEvent = {
			functionToRun: function(){},
			params: {}
	}
	this.completionEvent = {
			functionToRun: function(){},
			params: {}
	}
}
DashboardEvent.prototype.triggerCompleted = function (){
	this.completed = true;
	this.onComplete();
};

DashboardEvent.prototype.triggerSucceeded = function (){
	this.completed = true;
	this.succeeded = true;
	this.failed = false;    
	this.onComplete();
	this.onSuccess();
};

DashboardEvent.prototype.triggerFailed = function (){
	this.completed = true;
	this.succeeded = false;
	this.failed = true; 
	this.onComplete();
	this.onFailure();   
};

DashboardEvent.prototype.onComplete = function (){
	this.completionEvent.functionToRun(this.completionEvent.params);
};
DashboardEvent.prototype.onSuccess = function (){
	this.successEvent.functionToRun(this.successEvent.params);
};
DashboardEvent.prototype.onFailure = function (){
	this.failureEvent.functionToRun(this.failureEvent.params);
};

DashboardEvent.prototype.addSuccessEvent = function (functionToRun, params){
	this.successEvent.functionToRun = functionToRun;
	this.successEvent.params = params;
	if (this.succeeded){
			this.onSuccess();
	}   
};

DashboardEvent.prototype.addFailureEvent = function (functionToRun, params){
	this.failureEvent.functionToRun = functionToRun;
	this.failureEvent.params = params;
	if (this.failed){
			this.onFailure();
	}   
};

DashboardEvent.prototype.addCompletedEvent = function (functionToRun, params){
	this.completionEvent.functionToRun = functionToRun;
	this.completionEvent.params = params;
	if (this.completed){
			this.onComplete();
	}
};

DashboardEvent.prototype.result = null;

/**** DataManager Class
|*		
|*	Recordset Class for creating, attaching and managing
|*	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
|*	Tabs Handle switching from one recordset to another, while
|*	Panels hold the record. 
|* 
		Useage:
		---------
		dm = new DataManager();
		dm.setData(data);
		dm.sort({sortBy: "Age", sortDirection: "asc"});
		dm.addKeyword("Hisham");
		dm.goToPage(5);
		dm.removeKeyword("Hisham");
		dm.addSearchParameters({
			field: "First Name", 
			value:"Hisham", 
			options: {
				enableSpecialCharacters: false,
				wholeWordSearch: false
			}
		});
		console.log("data: ", dm.data);
		console.log("count: ", dm.count);

|******************* */
function DataManager(config, data) {	// data is optional
	// The DataManager Element retrieves data & processes it

	this.init(config);
	this.setData(data);
	console.log("DataManager", this);
	//this.refresh();
}

DataManager.SORTING = {
	ASC : "asc",
	DESC : "desc"
}
DataManager.prototype.init = function (config){
	this.setDefaults();
	this.setConfig(config);	
};

DataManager.prototype.setDefaults = function (){
	// Set config defaults
	this.page = 1;
	this.pages = 1;
	this.selectedItem = -1;	
	this.itemsPerPage = 12;
	this.fetch = {
		options:{}
	};
	this.sorting = {
		sortBy: '',
		sortDirection: DataManager.SORTING.ASC,
		sortFieldText: ''
	};
	this.filtering = {
		keywords: []
	};
	this.search = {
		parameters: [],
		options: {
			enableSpecialCharacters: false,
			wholeWordSearch: false
		}
	};
	this.tabName = "";
};

DataManager.prototype.setConfig = function (config){
	// Overwrite default config with passed in configs
	if (config){
		this.config = config;
		if (config.page){
			this.page = config.page;
		}
		if (config.itemsPerPage){
			this.itemsPerPage = config.itemsPerPage;
		}
		if (config.fetch){
			this.fetch = {...this.fetch, ...config.fetch};
		}
		if (config.sorting){
			this.setSorting(config.sorting);
		}
		if (config.tabName){
			this.tabName = config.tabName;
		}		
		if (config.search){
			if (config.search.options){
				for (var c in config.search.options){
					if (config.search.options.hasOwnProperty(c)){
						var thisOption = config.search.options[c];
						this.search.options[c] = this.search.options;
					}
				}
			}
			if (config.search.parameters){
				this.search.parameters = config.search.parameters;				
			}
		}
	}
};

DataManager.prototype.load = async function(countOnly){
	if (this.fetch?.url){
		let {options, url} = this.generateFetchParameters(countOnly);
		this.loading = await fetch(url, options);
		var res = await this.loading.json();
		console.log(res);
		this.setData(res.data, res.count);
	}

	if (countOnly){
		return this.count;
	}else{
		return this.getData();
	}
};

DataManager.prototype.generateFetchParameters = function (countOnly){
	let fetchOptions = {...this.fetch?.options};
	let url = this.fetch.url;

	// Set Method
	if (!fetchOptions.method){
		this.fetch.options.method = fetchOptions.method = 'GET';
	}
	// Generate Parameters & Set Defaults
	defaultParameters = {
		page : 'page',
		itemsPerPage: 'itemsPerPage',
		count: 'count',
		getCount: 'getCount',
		filterBy: 'filterBy',
		sortBy: 'sortBy',
		tabName: 'tabName'
	};
	dashboardParameters = {...defaultParameters}; 
	if (this.fetch.dashboardParameters){
		dashboardParameters = {...dashboardParameters, ...this.fetch.dashboardParameters}
	}

	const data = new URLSearchParams();
	data.append(dashboardParameters.page, this.page);
	data.append(dashboardParameters.itemsPerPage, this.itemsPerPage);
	data.append(dashboardParameters.getCount, countOnly||false);
	data.append(dashboardParameters.filterBy, JSON.stringify(this.filtering.keywords));
	data.append(dashboardParameters.sortBy, JSON.stringify(this.sorting));
	data.append(dashboardParameters.tabName, this.tabName);
	
	if (fetchOptions.method=='POST'){
		fetchOptions.body = data;
	}else{
		url += '?' + data;
	}

	return {options: fetchOptions, url: url};
};

DataManager.prototype.setData = function (data, count){
	if (!data){
		data = [];
	}
	this.data = {
		raw: clone(data),
		searched: clone(data),
		filtered: clone(data),
		sorted: clone(data),
		paged: clone(data)
	};
	if (this.fetch?.url){
		this.count = count
	}else{
		this.count = this.data.sorted.length
	}
	this.processData();
	//this.refresh();
};

DataManager.prototype.processData = function (){
	if (this.data && !this.fetch?.url){
		if (this.data.sorted){
			var data = this.data.sorted;
			var count = data.length;
			var itemsPerPage = this.itemsPerPage;
			this.count = count;
			if (count){
				var pages = Math.ceil(count/itemsPerPage);
				this.pages = pages;
			}else{
				this.page = 1;
				this.pages = 1;
			}
		}
	}else{
		//var data = this.data.sorted;
		var count = this.count;
		var itemsPerPage = this.itemsPerPage;
		if (count){
			this.pages = Math.ceil(count/itemsPerPage);
		}else{
			this.pages = 1;
		}
	}
};
DataManager.prototype.toggleSorting = function (){
	this.sorting.sortDirection = this.sorting.sortDirection==DataManager.SORTING.ASC?DataManager.SORTING.DESC:DataManager.SORTING.ASC
};

DataManager.prototype.refresh = async function (){
	if (this.fetch?.url){
		await this.load();
	}else{
		this.processSearch();
		this.processFiltering();
		this.processSorting();
		this.processData();
		this.processPaging();	
	}
	return this.getData();
};

DataManager.prototype.reset = function (){
	this.setDefaults();
	this.refresh();
};

DataManager.prototype.doSearch = function (searchParameters){
	this.setSearch(searchParameters);
	this.refresh();
};

DataManager.prototype.setSearch = function (searchParameters){
	this.search.parameters = searchParameters;
};

DataManager.prototype.processSearch = function (){
	if (this.data){
		if (this.data.raw){
			if (this.search){
				if (this.search.parameters){
					this.processSearchParameters();
				}
			}
		}
	}
};

DataManager.prototype.processSearchParameters = function(){
	var dataset = this.data.searched = clone(this.data.raw);
	var enableSpecialCharacters = this.search.options.enableSpecialCharacters;
	var wholeWordSearch = this.search.options.wholeWordSearch;
			
	for (var i=0;i<dataset.length;i++){
		var found = true;
		var thisRecord = dataset[i];
		if (thisRecord){
		
			for (var k in this.search.parameters){
				if (this.search.parameters.hasOwnProperty(k)){
					var thisParameter = this.search.parameters[k];
					var thisWholeWordSearch = wholeWordSearch;
					var searchField = thisParameter.field;
					var searchValue = thisParameter.value;
					searchValue = String(searchValue).toLowerCase().trim();
					if (searchValue){
						var searchOptions = thisParameter.options;
						var currentRecordFieldValue = String(thisRecord[searchField]).toLowerCase().trim();
						if (searchOptions){
							if (searchOptions.wholeWordSearch){
								thisWholeWordSearch = searchOptions.wholeWordSearch;
							}
						}
						if (thisWholeWordSearch){
							if (currentRecordFieldValue != searchValue){
								found = false;
							}
						}else{
							if (currentRecordFieldValue.indexOf(searchValue)==-1){
								found = false;
							}
						}
					}
				}			
			}		
		}
		// If Not found, remove from Filtered Dataset
		//console.log("found: " + found);
		if (!found){
			//console.log(dataset);
			//console.log("Deleting iteration "+i+": " + dataset[i].RECORD_ID);
			dataset.splice(i, 1);
			// splice shifts the array indexes, so go back 1 iteration to make up for the shifted index!
			i--;
			//console.log("now i is: " + i);
			//console.log(dataset);
		}
	}	
};

DataManager.prototype.filter = function (filtering){
	this.setFiltering(filtering);
	this.refresh();
};

DataManager.prototype.setFiltering = function (filtering){
	this.filtering = filtering;
};

DataManager.prototype.processFiltering = function (){
	if (this.data){
		if (this.data.searched){
			if (this.filtering){
				if (this.filtering.keywords){
					this.processKeywordFilters();
				}
			}
		}
	}
};

DataManager.prototype.processKeywordFilters = function(){
	var dataset = this.data.filtered = clone(this.data.searched);
	for (k in this.filtering.keywords){
		var thisKeyword = this.filtering.keywords[k];
		for (var i=0;i<dataset.length;i++){
			var found = false;
			var thisRecord = dataset[i];
			if (thisRecord){
				for (var key in thisRecord) {
					if (thisRecord.hasOwnProperty(key)) {
						//console.log(key + " -> " + thisRecord[key]);
						var field = thisRecord[key];
						field = String(field).trim().toLowerCase();
						thisKeyword = String(thisKeyword).trim().toLowerCase();
						// If Keyword is found in the current field, set found to true
						//isKeywords
						if (field.indexOf(thisKeyword)>-1){
							found = true;
							//console.log("Found " + thisKeyword + " in " + key + ", exiting loop, going to next record. Found Record is: ");
							//console.log(thisRecord);
							break;
						}
					}
				}
			}
			// If Not found, remove from Filtered Dataset
			//console.log("found: " + found);
			if (!found){
				//console.log(dataset);
				//console.log("Deleting iteration "+i+": " + dataset[i].RECORD_ID);
				dataset.splice(i, 1);
				// splice shifts the array indexes, so go back 1 iteration to make up for the shifted index!
				i--;
				//console.log("now i is: " + i);
				//console.log(dataset);
			}
		}				
	}
};

DataManager.prototype.addKeyword = function (keyword){
	this.addFilterKeyword(keyword);
	this.refresh();
};
DataManager.prototype.addFilterKeyword = function (keyword){
	keyword = String(keyword).trim().toLowerCase();
	if (!this.filtering.keywords){
		this.filtering.keywords = [];
	}
	
	// Reset Filtered Dataset
	if (this.filtering.keywords.indexOf(keyword)>-1){
		// don't add duplicate keyword
	}else{
		this.filtering.keywords.push(keyword);
	}
};
DataManager.prototype.removeKeyword = function (keyword){
	this.removeFilterKeyword(keyword);
	this.refresh();
};
DataManager.prototype.removeFilterKeyword = function (keyword){
	console.log("Removing Filter: " + keyword);
	if (this.filtering.keywords.indexOf(keyword)>-1){
		for (k in this.filtering.keywords){
			thisKeyword = this.filtering.keywords[k];
			if (thisKeyword == keyword){
				console.log("Found it, Removing Keyword " + keyword);
				this.filtering.keywords.splice(k, 1);
				break;
			}
		}
	}
};

DataManager.prototype.sort = function (sorting){
	this.setSorting(sorting);
	this.refresh();
};

DataManager.prototype.setSorting = function (sorting){
	if (sorting.sortBy){
		this.sorting.sortBy = sorting.sortBy;
	}
	if (sorting.sortDirection){
		this.sorting.sortDirection = sorting.sortDirection;
	}
	if (sorting.sortFieldText){
		this.sorting.sortFieldText = sorting.sortFieldText;
	}
};

DataManager.prototype.processSorting = function (){
	if (this.data){
		if (this.sorting.sortBy){
			var dataset = clone(this.data.filtered);
			var sortBy = this.sorting.sortBy;
			var sortDirection = String(this.sorting.sortDirection).toLowerCase();
			if (sortDirection == "asc"){
				dataset.sort(function(a, b){return a[sortBy]<b[sortBy]?-1:1;});
			}else{
				dataset.sort(function(a, b){return a[sortBy]<b[sortBy]?1:-1;});
			}
			this.data.sorted = dataset;
		}else{
			this.data.sorted = clone(this.data.filtered);
		}
	}
};

DataManager.prototype.getData = function(){
	return this.data.paged;
};
DataManager.prototype.getFieldsFromData = function(){
	let fields = {};
	if (this?.data?.paged?.length){
		for (let d in this.data.paged[0]){
			fields[d] = {};
		}
	}
	return fields;
};
DataManager.prototype.updateProcessedDataset = function(){
	this.processedData = this.data.paged;
};

DataManager.prototype.goToPage = async function (page){
	this.setPaging(page);
	this.processPaging();
};

DataManager.prototype.setPaging = function (page){
	if (isNaN(page)){
		page = this.page;
		if (isNaN(page) || page == 0){
			page = 1;
		}
	}
	if (page > this.pages){
		page = this.pages;
	}
	this.page = page;
};

DataManager.prototype.processPaging = function (){

	// Local Data
	if (this.data && !this.fetch?.url){
		var data = this.data.sorted;
		var count = data.length;
		var itemsPerPage = this.itemsPerPage;
		var page = this.page;
		var pages = this.pages;
		var endItem = page*itemsPerPage;
		var startItem = endItem-itemsPerPage;
		var pagedData = [];

		for (j = startItem; j < endItem && j < count; j++){
			pagedData.push(data[j]);
		}
		this.data.paged = pagedData;
		this.updateProcessedDataset();	//sets the this.processedData to the paged dataset
	}else if (this.fetch?.url){
		// Fetch Data API
		//this.load();
	}
};





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

/**** FieldHeader Class
 *		
 *	FieldHeader Class for creating, attaching and managing
 *	FieldHeaders for each Recordset. 
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

function FieldHeader(settings){
	Component.call(this, settings);
	//var fieldSettings = Component.getFieldSettings(this);
	//var fields = fieldSettings.fields;

	// Modify Header DOM Object
	this.addClass(this.class);
	this.setText(this.translatedName);
}
FieldHeader.prototype = Object.create(Component.prototype);
FieldHeader.prototype.constructor = FieldHeader;		

/**** FieldHeaderContainer Class
|*		
|*	FieldHeaderContainer Class for creating, attaching and managing
|*	FieldHeaderContainers. 
|*	FieldHeaderContainers will mainly be used as containers to which
|*	FieldHeaders will be attached.
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

function FieldHeaderContainer(settings){
	Component.call(this, settings);
	var fields = Component.getFieldSettings(this.fields, this.language);
	var defaultWidth = Component.getDefaultFieldWidth(fields);
	for (let key in fields) {
		if (fields.hasOwnProperty(key)) {
			var fieldSettings = fields[key];
			var field = new FieldHeader({config: fieldSettings, templateManager: settings.templateManager, language: this.language});
			//console.log("fieldHeader", field);
			this.append(field);

			if (fieldSettings.width){
				field.object.style.width = fieldSettings.width;
			}else{
				field.object.style.width = defaultWidth;
			}

		}
	}
	if (!this.image){
		this.objects.imageSpacer.hide();
	}
}
FieldHeaderContainer.prototype = Object.create(Component.prototype);
FieldHeaderContainer.prototype.constructor = FieldHeaderContainer;		


FieldHeaderContainer.defaultTemplate = {
	imageSpacer: ".image-spacer",
	actionsHeader: ".actions-header"
};
/**************************************************************************************************
 * 	Class FileLoader(rootNode)
 * ---------------------------------
 * 	@param {string}	templateURL			Required:	URL of the template
 * 
 *  Description: 
 * 			Retrieved the contents of a remote file
 *************************************************************************************************/

function FileLoader(templateURL) {
	// Initialize the template by making a copy of the DOM
	this.templateURL = templateURL
}

FileLoader.prototype.loadFile = async function (){
	
	// If a templateURL is supplied, load from that template
	if (this.templateURL){
		try{
			var response = await fetch(this.templateURL);
			var text = await response.text();
			return text;
		} catch(err) {
			// There was an error
			console.warn('Something went wrong.', err);
		}
	}
}

FileLoader.prototype.loadHTML = async function(){
	html = await this.loadFile()
	// Convert the HTML string into a document object
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, 'text/html');

	// Get the rootNode
	var rootNode = doc.querySelector("*");
	console.log(rootNode);
	return rootNode;
}

/**** Filtering Class
 *		
 *	Filtering Class for searching and filtering through recordsets
 *	---------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab												Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Filtering(settings) {
	var filtering = this;
	Component.call(this, {...settings, data: settings.dataManager.getData()});
	this.dataManager = settings.dataManager;
	this.tab = settings.tab
	this.dashboard = this.tab.dashboard

	this.objects.itemButton.addEventListener('click', onClickFiltering);
	this.objects.itemInput.addEventListener('keyup', function(event) {
		if (event.key === "Enter") {
			onClickFiltering();
		}
	});
	this.refresh();

	function onClickFiltering(){
		filtering.addKeyword(filtering.objects.itemInput.value);
		filtering.clearInput();
	}
	//console.log(this);
}
Filtering.prototype = Object.create(Component.prototype);
Filtering.prototype.constructor = Filtering;

Filtering.prototype.addKeyword = function(keyword){
	this.dataManager.addKeyword(keyword);
	this.refresh();
};

Filtering.prototype.removeKeyword = function (keyword){
	this.dataManager.removeKeyword(keyword);
	this.refresh();
};

Filtering.prototype.renderKeywords = function (){
	this.removeChildren();
	for (var k in this.dataManager.filtering.keywords){
		var pKeyword = this.dataManager.filtering.keywords[k];
		var keyword = new FilteringKeyword({filtering: this, config: {...this.config, name: pKeyword}, dataManager: this.dataManager, templateManager: this.templateManager, useExistingElement: false});
		this.append(keyword)
	}
};
Filtering.prototype.refresh = async function (){
	this.renderKeywords();
	this.filterRecordset();
	// get Tab Recordset and Refresh

	await this.dashboard.getChild(this.tab.name).refresh();
	await this.dataManager.loading;
	this.tab.pagination.refresh();
	//this.tab.tabs.refresh();
};
Filtering.prototype.clearInput = function (){
	this.objects.itemInput.value = '';
};
Filtering.prototype.filterRecordset = function (){

};

Filtering.defaultTemplate = {
	itemInput: "input",
	itemButton: ".search-button"
};

/**** FilteringKeyword Class
 *		
 *	FilteringKeyword Class
 * -----------------------------
 *	@param {Object}						settings.filtering										Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function FilteringKeyword(settings) {
	var filteringKeyword = this;
	Component.call(this, settings);
	this.dataManager = settings.dataManager;
	this.filtering = settings.filtering; 
	//console.log(this);
	this.objects.itemClose.addEventListener('click', function(){
		filteringKeyword.close();
	});
	
}

FilteringKeyword.prototype = Object.create(Component.prototype);
FilteringKeyword.prototype.constructor = FilteringKeyword;

FilteringKeyword.prototype.close = function (){
	this.filtering.removeKeyword(this.name);
};
/*

	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	$(this.template.tab.itemSelector).remove();
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $($(this.template.panel.itemSelector).get(0));

*/

FilteringKeyword.defaultTemplate = {
	itemClose: ".close"
};

var timer;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

function startTimer() {
	timer = new Date();
	console.log("Timer Started");
}

function endTimer() {
	timerEnd = new Date();
	var dif = timerEnd.getTime() - timer.getTime();
	console.log("Timer: " + dif / 1000);
}

function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}
function getArabicNumbers(str) {
	var map =
		[
			"&\#1632;", "&\#1633;", "&\#1634;", "&\#1635;", "&\#1636;",
			"&\#1637;", "&\#1638;", "&\#1639;", "&\#1640;", "&\#1641;"
		];

	var newStr = "";

	str = String(str);

	for (i = 0; i < str.length; i++) {
		newStr += map[parseInt(str.charAt(i))];
	}

	return newStr;
}

function ifEmptyReplaceWithSpace(value) {
	if (value == "") {
		value = " &nbsp; ";
	}
	return value;
}

function processOnClick(event) {
	theDashboard = event.currentTarget.params.dashboard;
	theCurrentRecord = event.currentTarget.params.record;
	theCurrentItem = event.currentTarget.params.item;
	theFunction = event.currentTarget.params.theFunction;
	// First, stop event propagation
	//event.originalEvent.stopPropagation();
	//event.stopPropagation();
	//event.cancelBubble = true;
	//event.stopImmediatePropagation();

	//test = event.isPropagationStopped();
	//test2 = event.originalEvent.isPropagationStopped();

	//console.log("Clicked on", theCurrentRecord);
	theFunction.call(theCurrentItem, theDashboard, theCurrentRecord);
	//event.preventDefault();
	//event.originalEvent.preventDefault();
	//test3 = event.isDefaultPrevented();
	//test4 = event.originalEvent.isDefaultPrevented();
}

function splitDate(date, language) {
	if (language == "ar-AE") {
		var monthNames = ["", "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
			"يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
		];
	} else {
		var monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
	}
	var theDate = String(date).split("-");
	if (theDate) {
		if (theDate.length > 0) {
			var month = parseInt(theDate[1]);
			if (month < 1) {
				month = 1;
			}
			theDate[1] = monthNames[month];
			if (language == "ar-AE") {
				theDate[0] = getArabicNumbers(theDate[0]);
				theDate[2] = getArabicNumbers(theDate[2]);
			}
			return theDate;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/************* Jquery Replacement Functions *******************/
NodeList.prototype.wrap = function (wrapper) {
	// creating a temporary element to contain the HTML string ('wrapper'):
	var temp = document.createElement('div'),
		// a reference to the parent of the first Node:
		parent = this[0].parentNode,
		// a reference to where the newly-created nodes should be inserted:
		insertWhere = this[0].previousSibling,
		// caching a variable:
		target;

	// setting the innerHTML of the temporary element to what was passed-in:
	temp.innerHTML = wrapper;

	// getting a reference to the outermost element in the HTML string passed-in:
	target = temp.firstChild;

	// a naive search for the deepest node of the passed-in string:        
	while (target.firstChild) {
		target = target.firstChild;
	}

	// iterating over each Node:
	[].forEach.call(this, function (a) {
		// appending each of those Nodes to the deepest node of the passed-in string:
		target.appendChild(a);
	});

	// inserting the created-nodes either before the previousSibling of the first
	// Node (if there is one), or before the firstChild of the parent:
	parent.insertBefore(temp.firstChild, (insertWhere ? insertWhere.nextSibling : parent.firstChild));

}
Node.prototype.wrap = function (wrapper) {
	// creating a temporary element to contain the HTML string ('wrapper'):
	var temp = document.createElement('div'),
		// a reference to the parent of the first Node:
		parent = this.parentNode,
		// a reference to where the newly-created nodes should be inserted:
		insertWhere = this.previousSibling,
		// caching a variable:
		target;

	// setting the innerHTML of the temporary element to what was passed-in:
	temp.innerHTML = wrapper;

	// getting a reference to the outermost element in the HTML string passed-in:
	target = temp.firstChild;

	// a naive search for the deepest node of the passed-in string:        
	while (target.firstChild) {
		target = target.firstChild;
	}

	// appending each of those Nodes to the deepest node of the passed-in string:
	target.appendChild(this);

	// inserting the created-nodes either before the previousSibling of the first
	// Node (if there is one), or before the firstChild of the parent:
	if (parent){
		parent.insertBefore(temp.firstChild, (insertWhere ? insertWhere.nextSibling : parent.firstChild));
	}
  return target;
}

NodeList.prototype.unwrap = function () {
	this.forEach(function (el, index) {
		// get the element's parent node
		var parent = el.parentNode;

		// move all children out of the element
		while (el.firstChild) parent.insertBefore(el.firstChild, el);

		// remove the empty element
		parent.removeChild(el);
	});
}

Node.prototype.unwrap = function () {

		// get the element's parent node
		var parent = this.parentNode;

		// move all children out of the element
		while (this.firstChild) parent.insertBefore(this.firstChild, this);

		// remove the empty element
		parent.removeChild(this);

}

NodeList.prototype.appendChild = function (child) {
	this.forEach(function (el, index) {
		el.appendChild(child);
	});
}


Node.prototype.prependChild = function (child) {
	this.insertBefore(child, this.firstChild);
}


NodeList.prototype.remove = function () {
	this.forEach(function (el, index) {
		el.parentNode.removeChild(el);
	});
}


Node.prototype.remove = function (child) {
	this.parentNode.removeChild(this);
}


NodeList.prototype.hide = function () {
	this.forEach(function (el, index) {
		el.style.display = 'none';
	});
}

Node.prototype.hide = function () {
	this.style.display = 'none';
}

NodeList.prototype.show = function () {
	this.forEach(function (el, index) {
		el.style.display = 'block';
	});
}

Node.prototype.show = function () {
	this.style.display = 'block';
}


var createNodeListFromArray = (function () {
	// make an empty node list to inherit from
	var nodelist = document.createDocumentFragment().childNodes;
	// return a function to create object formed as desired
	return function (nodeArray) {
		var nodeLength = nodeArray.length;
		var nodeListObj = {
			'length': { value: nodeLength },
			'item': {
				"value": function (i) {
					return this[+i || 0];
				},
				enumerable: true
			}
		};
		for (var n in nodeArray) {
			var node = nodeArray[n];
			nodeListObj[n] = { value: node, enumerable: true };
		}
		return Object.create(nodelist, nodeListObj); // return an object pretending to be a NodeList
	};
}());

NodeList.prototype.querySelectorAll = function (selector) {
	var nodeArray = [];
	[].forEach.call(this, function (el) {
		var nodeList = el.querySelectorAll(selector);
		[].forEach.call(nodeList, function (el2) {
			nodeArray.push(el2);
		});
	});
	return createNodeListFromArray(nodeArray);
}

NodeList.prototype.addClickHandler = function (clickHandler, params) {
	[].forEach.call(this, function (el) {
		el.addEventListener('click', clickHandler, false);
		el.params = params;
	});
};

Node.prototype.addClickHandler = function (clickHandler, params) {
		this.addEventListener('click', clickHandler, false);
		this.params = params;
};

Node.prototype.toggleClass = function (className) {
	if (this.classList.contains(className)) {
		this.classList.remove(className);
	}else{
		this.classList.add(className);
	}
};

NodeList.prototype.toggleClass = function (className) {
	[].forEach.call(this, function (el) {
		el.toggleClass(className);
	});
};

/******** General Helper Functions *****/
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		enumerable: false,
		value: function (searchElement /*, fromIndex*/) {
			'use strict';
			var O = Object(this);
			var len = parseInt(O.length) || 0;
			if (len === 0) {
				return false;
			}
			var n = parseInt(arguments[1]) || 0;
			var k;
			if (n >= 0) {
				k = n;
			} else {
				k = len + n;
				if (k < 0) { k = 0; }
			}
			var currentElement;
			while (k < len) {
				currentElement = O[k];
				if (searchElement === currentElement ||
					(searchElement !== searchElement && currentElement !== currentElement)) {
					return true;
				}
				k++;
			}
			return false;
		}
	});
}

if (!String.prototype.replaceAll) {
	Object.defineProperty(String.prototype, 'replaceAll', {
		enumerable: false,
		value: function (find, replace) {
			var theString = String(this);
			if (theString) {
				return theString.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
			} else {
				return theString;
			}
		}
	});
}

var timer;
function startTimer() {
	timer = new Date();
	console.log("Timer Started");
}

function endTimer() {
	timerEnd = new Date();
	var dif = timerEnd.getTime() - timer.getTime();
	console.log("Timer: " + dif / 1000);
}

function clone(obj) {
	var copy;
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj || obj.templateManager instanceof TemplateManager || obj instanceof Dashboard){
		return obj;
	}else if (obj instanceof HTMLDivElement){
		return obj; //obj.cloneNode(true)
	} 

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof HTMLElement){
		return obj.cloneNode(true);
	}else if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}


function stopEventPropagation(e) {
	//e.stopImmediatePropagation();
	e.preventDefault();
	e.stopPropagation();
}

// Check if 2 objects are equal (only checks first level)
function shallowCompare (o1, o2){
	for(var p in o1){
			if(o1.hasOwnProperty(p)){
					if(o1[p] !== o2[p]){
							return false;
					}
			}
	}
	for(var p in o2){
			if(o2.hasOwnProperty(p)){
					if(o1[p] !== o2[p]){
							return false;
					}
			}
	}
	return true;
};


function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

function str(msg) {
	if (msg) {
		return String(msg).trim();
	}
	return "";
}

/**** PageButton Class
|*		
|*	PageButton Class 
 *	---------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab												Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function PageButton(settings) {
	Component.call(this, settings);

	//clone field
	//var fieldObject = this.object;
	this.setText(this.config.name?this.config.name:this.config.pageNumber);
	//fieldObject.innerHTML = this.config.pageNumber;
}
PageButton.prototype = Object.create(Component.prototype);
PageButton.prototype.constructor = PageButton;

PageButton.prototype.highlight = function (){
	this.addClass("active");
};

PageButton.prototype.unhighlight = function (){
	this.removeClass("active");
};



/**** Paging Class
 *		
 *	Paging Class for pagination on records
 *	Paging on Records. 
 *	---------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab												Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Paging(settings) {
	Component.call(this, settings);
	this.dataManager = settings.dataManager;
	this.tab = settings.tab;
	this.visiblePages = 6;
	this.refresh();
}
Paging.prototype = Object.create(Component.prototype);
Paging.prototype.constructor = Paging;

Paging.prototype.renderPageHighlight = function (){
	var pButton = this.getPageButton(this.dataManager.page);
	if (pButton){
		pButton.highlight();
	}
};

Paging.prototype.refresh = function (){
	this.removeChildren();
	var dataManager = this.dataManager;
	var paginationObject = this;
	var visiblePages = this.visiblePages;
	var visibleBlock = this.visibleBlock?this.visibleBlock:Math.ceil(this.dataManager.page/visiblePages);
	var totalBlocks = Math.ceil(this.dataManager.pages/visiblePages);
	if (visibleBlock>totalBlocks){
		visibleBlock = totalBlocks;
	}
	var startPage = (visibleBlock * visiblePages) - visiblePages + 1;
	var endPage = visibleBlock * visiblePages;
	if (this.dataManager.pages<endPage){
		endPage = this.dataManager.pages;
	}
	
	// Create Go To begining Button
	var pageStart = new PageButton({
		config: {
			pageNumber: '1', 
			name: '<<',
			onClick: function(){
				paginationObject.tab.goToPage(this.pageNumber);
				paginationObject.unhighlight()
				this.highlight();
			},
			id: this.tab+'_page_'+p+'_start'
		}, 
		templateManager: this.templateManager
	});
	this.append(pageStart);

	// Create Go To Previous Block Button
	var prevBlock = new PageButton({
		config: {
			pageNumber: '', 
			name: '<',
			onClick: function(){
				paginationObject.visibleBlock = visibleBlock-1<=0?1:visibleBlock-1;
				paginationObject.refresh();
			},
			id: this.tab+'_page_'+p+'_prev'
		}, 
		templateManager: this.templateManager});
	this.append(prevBlock);

	// Create Page Buttons
	for (var p=startPage; p<=endPage; p++) {
		var pageBtn = new PageButton({
			config: {
				pageNumber: p, 
				onClick: function(){
					paginationObject.tab.goToPage(this.pageNumber);
					paginationObject.unhighlight()
					this.highlight();
					paginationObject.visibleBlock = null
				},
				id: this.tab+'_page_'+p
			}, 
			templateManager: this.templateManager
		});
		this.append(pageBtn);
	}

	// Create Go To Next Block Button
	var nextBlock = new PageButton({
		config: {
			pageNumber: '', 
			name: '>',
			onClick: function(){
				paginationObject.visibleBlock = visibleBlock+1>totalBlocks?totalBlocks:visibleBlock+1;
				paginationObject.refresh();
			},
			id: this.tab+'_page_'+p+'_prev'
		}, 
		templateManager: this.templateManager
	});
	this.append(nextBlock);

	// Create Go to End Button
	var pageEnd = new PageButton({
		config: {
			pageNumber: this.dataManager.pages, 
			name: '>>',
			onClick: function(){
				paginationObject.tab.goToPage(dataManager.pages);
				paginationObject.unhighlight()
				this.highlight();
			},
			id: this.tab+'_page_'+p+'_end'
		}, 
		templateManager: this.templateManager
	});
	this.append(pageEnd);

	this.renderPageHighlight();
};

Paging.prototype.getPageButton = function (page){
	for (var p in this.children.container){
		if (this.children.container[p]){
			if (this.children.container[p].id == this.tab+'_page_'+page){
				return this.children.container[p]
			}	
		}
	}
	//var pButton = document.querySelector('[id="'+this.tab+'_page_'+page+'"]');
	//return pButton
};

Paging.prototype.unhighlight = function (page){
	for (var p in this.children.container){
		if (this.children.container[p]){
			this.children.container[p].unhighlight();
		}
	}
	//var pButton = document.querySelector('[id="'+this.tab+'_page_'+page+'"]');
	//return pButton
};

/**** Panel Class
|*		
|*	Recordset Class for creating, attaching and managing
|*	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
|*	Tabs Handle switching from one recordset to another, while
|*	Panels hold the record. 
|* 
	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $(this.template.panel.itemSelector);

|********************/
function Panel(config, data, template, useExistingElement) {
	Component.call(this, config, data, template, useExistingElement);

	// Create Tab
	var tab = new Tab(config, data, { templateBuilder: template.templateBuilder});
	var recordset = new Recordset(config, data, { templateBuilder: template.templateBuilder});

	this.append(tab, "tab");
	this.append(recordset, "panel");

	//console.log(this);
}

Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;

/*

	// Get Tabs Template
	this.template.tab = {};
	this.template.tab.itemSelector = ".tab";
	this.template.tab.itemIconSelector = ".icon";
	this.template.tab.defaultIcon = "glyphicon glyphicon-th";	// For replacing
	this.template.tab.defaultIcon = "fas fa-th-list";
	this.template.tab.item = $($(this.template.tab.itemSelector)[0]);
	this.template.tab.titleItemSelector = ".active-tab-title";
	$(this.template.tab.itemSelector).remove();
	
	// Get Panel Template
	this.template.panel = {};
	this.template.panel.wrapperSelector = ".dashboard-content";
	this.template.panel.containerSelector = ".tab-content";
	this.template.panel.itemSelector = ".tab-pane";
	this.template.panel.item = $($(this.template.panel.itemSelector).get(0));

*/

Panel.defaultTemplate = {
	wrapper: "",
	item: ".main",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: {
		tab: ".tabs .container-fluid .row",	// Tab Container
		panel: ".tab-content"
	}					
};



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
	var defaultWidth = Component.getDefaultFieldWidth(this.fields);

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
			var field = new Field({config: thisFieldSettings, data: this.data[thisFieldSettings.dataField], templateManager: this.templateManager, useExistingElement: this.useExistingElement, language: this.language});
			//console.log(field);
			this.append(field, "fields");
			if (thisFieldSettings.width){
				field.object.style.width = thisFieldSettings.width;
			}else{
				field.object.style.width = defaultWidth;
			}
		}
	}

	var actionsWidth = 0;
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
				var action = new Action({config: actionConfig, data: this.data, templateManager: this.templateManager, useExistingElement: this.useExistingElement, language: this.language});

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

/**** Sorting Class
 *		
 *	Sorting Class
 * -----------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab													Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function Sorting(settings) {
	debugger;
	Component.call(this, {
		config: {
			...settings.config, 
			onClick: function(){
				this.toggleMenu();
			}
		}, 
		data: dataManager.getData(), 
		templateManager: settings.templateManager, 
		useExistingElement: settings.useExistingElement,
		language: settings.language
	});
	this.dataManager = settings.dataManager;
	this.tab = settings.tab
	this.dashboard = this.tab.dashboard
	this.createItems();
	this.highlightSelected();
	this.closeMenu();
	var sorting = this; 
	
	document.addEventListener('mouseup', function closeSortingMenu(e) {
		//var theTarget = e.target.closest(actionsMenu.selectors.item);
		if (!sorting?.object?.contains(e.target)) {
			sorting.closeMenu();
		}
	});
/* 
	this.onRemove = function (e){
		document.removeEventListener('mouseup', function closeSortingMenu(e) {
			//var theTarget = e.target.closest(actionsMenu.selectors.item);
			if (!sorting.object.contains(e.target)) {
				sorting.closeMenu();
			}
		});
	} */
	//console.log(this);
}
Sorting.prototype = Object.create(Component.prototype);
Sorting.prototype.constructor = Sorting;

Sorting.prototype.toggleMenu = function(){
	this.template.objects.itemDropDown.toggleClass('open');
};
Sorting.prototype.closeMenu = function(){
	this.removeClass('open', 'itemDropDown');
};

Sorting.prototype.createItems = function (){
	for (var f in this.fields){
		debugger;
		var item = new SortingItem({sorting: this, config: {...this.fields[f], tab: this.tab, fieldKey: f}, templateManager: this.templateManager, useExistingElement: false, language: this.language});
		this.append(item)
	}
};

Sorting.prototype.highlightSelected = function (){
	var sortingConfig = this.dataManager.sorting;
	if (sortingConfig && sortingConfig.sortBy){
		this.setText(sortingConfig.sortFieldText,'itemSortingButton');
	}else{
		originalText = this.getTemplate(null, null, false).objects.itemSortingButton.innerHTML;
		this.setText(originalText,'itemSortingButton');
	}
	if (this.dataManager.sorting.sortDirection == DataManager.SORTING.ASC){
		this.addClass('flip', 'itemSortingDirection')
	}else{
		this.removeClass('flip', 'itemSortingDirection')
	}
};

Sorting.defaultTemplate = {
	itemSortingButton: ".buttonText",
	itemDropDown: ".dropdown",
	itemSortingDirection: '.caret'
};

/**** SortingItem Class
|*		
|*	SortingItem Class
 * -----------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.sorting											Required: A Reference to the sorting object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function SortingItem(settings) {
	debugger;
	settings.config.onClick = function (){
		// Toggle Sorting Direction
		settings.sorting.dataManager.toggleSorting();
		settings.sorting.dataManager.sort({
			sortBy: settings.config.fieldKey,
			sortFieldText: settings.config.translatedName?settings.config.translatedName:settings.config.name
		});
		
		//tab.dashboard.getChild(tab.name, 'recordset').remove()
		settings.sorting.toggleMenu();
		settings.sorting.tab.tabs.goToTab(settings.sorting.tab.name);
	}
	Component.call(this, settings);
	this.dataManager = settings.dataManager;
	this.sortDirection = "asc"
}

SortingItem.prototype = Object.create(Component.prototype);
SortingItem.prototype.constructor = SortingItem;

SortingItem.prototype.create = function (active){


}; 

/**** Tab Class
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

function Tab(settings) {
	this.active = false;
	// Make a copy as to not modify original config
	var tabConfig = {...settings.config};
	if (!tabConfig.onClick){
		tabConfig.onClick = function (){
			this.setActive(true);
			settings.tabs.goToTab(tabConfig.name);	
		};
	}

	Component.call(this, {config: tabConfig, data: settings.dataManager.getData(), templateManager: settings.templateManager, useExistingElement: settings.useExistingElement, language: settings.language});

	this.dataManager = settings.dataManager;
	this.tabs = settings.tabs;
	this.dashboard = this.tabs.dashboard;
	//this.dashboard = settings.config.dashboard;
	// Save Original Config without the OnClick added, so we can pass it down to the Recordset.
	this.originalConfig = {...settings.config};
	this.refreshCount();
};

Tab.prototype = Object.create(Component.prototype);
Tab.prototype.constructor = Tab;

Tab.prototype.refreshCount = async function (){
	// Create Staggered Loader (so the loading animation don't sync)
	//var staggeredSeed = getRandomInt(100,900);
	//setTimeout(()=> this.showLoader(), staggeredSeed);
	await this.showLoader();
	await this.dataManager.load(true);
	if (this.objects.itemBadge) {
		this.setText(this.dataManager.count, "itemBadge");
	}
	this.hideLoader();
	this.pagination?.refresh();

};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
Tab.prototype.setActive = function (active){
	if (active){
		this.active = true;
		this.addClass("active");
	}else{
		this.active = false;
		this.removeClass("active");
	}
};

Tab.prototype.goToPage = async function(page){
	await this.dataManager.goToPage(page);
	await this.refresh();
	//tl.from("#" + recordset.uid + " " + Record.defaultTemplate.item, {duration: 0.3, opacity: 0, x: (oldPage<page?1600:-1600), stagger: 0.05});
};

Tab.prototype.refresh = async function(){
	
	this.setBreadCrumbs();
	this.setRecordset();
	this.setPagination();
	this.setFiltering();
	this.setView();
	this.setSorting();
};

Tab.prototype.setBreadCrumbs = function (){
	this.dashboard.setText('<span class="bc-tab-title">'+(this.translatedName?this.translatedName:this.name)+': </span>' +  (this.description? this.description:''), 'tabBreadCrumbs');
};

Tab.prototype.setRecordset = function (){
	var recordset = this.dashboard.getChild(this.name);
	if (recordset){
		recordset.refresh();
	}else{
		recordset = new Recordset({config: this.originalConfig, dataManager: this.dataManager, templateManager: this.templateManager, language: this.language});
		this.dashboard.append(recordset, "recordset");			
	}
};

Tab.prototype.setPagination = function (){
	var pagination = new Paging({tab: this, config: {name: this.name}, dataManager: this.dataManager, templateManager: this.templateManager, language: this.language, useExistingElement:true});
	this.pagination = pagination;
};

Tab.prototype.setFiltering = function (){
	var filtering = this.dashboard.getChild('Search')
	if (filtering){
		filtering.remove();
	}
	var filtering = new Filtering({tab: this,  config: {name: 'Search'}, dataManager: this.dataManager, templateManager: this.templateManager, language: this.language});
	this.dashboard.append(filtering, 'filtering');
};

Tab.prototype.setSorting = async function (){
	var sorting = this.dashboard.getChild('Sort By')
	if (sorting){
		sorting.remove();
	}
	if (!this?.recordSettings?.fields || JSON.stringify(this?.recordSettings?.fields)=='{}'){
		await this.dataManager.loading;
		this.fields = this.dataManager.getFieldsFromData();	
		this.fields = Component.getFieldSettings(this.fields, this.language);
	}else{
		this.fields = Component.getFieldSettings(this.recordSettings.fields, this.language);
	}
	debugger;
	var sorting = new Sorting({tab: this, config: {fields: this.fields, name: 'Sort By'}, dataManager: this.dataManager, templateManager: this.templateManager, language: this.language});
	this.dashboard.append(sorting, 'sorting');
};

Tab.prototype.setView = function (){
	var viewSwitcher = this.dashboard.getChild('View')
	if (viewSwitcher){
		viewSwitcher.remove();
	}
	var viewSwitcher = new ViewSwitcher({tab: this, config: {name: 'View', viewMode: this.viewMode}, dataManager: this.dataManager, templateManager: this.templateManager, language: this.language});
	this.dashboard.append(viewSwitcher, 'viewSwitcher');
};

Tab.prototype.deactivate = function () {
	var activeRecordset = this.dashboard.getChild(this.name)
	this.setActive(false);
	if (activeRecordset){
		activeRecordset.remove();
	}
};

Tab.defaultTemplate = {
	itemBadge: ".badge"
};

/**** Tabs Class
 *		
 *	Tabs Class for 
 * 
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

function Tabs(settings) {
	Component.call(this, settings);
	this.loadTabs()
}

Tabs.prototype = Object.create(Component.prototype);
Tabs.prototype.constructor = Tabs;

Tabs.prototype.loadTabs = async function(){
	this.processTabs();

	for (var t in this.tabs){
		var tabConfig = this.tabs[t]; 
		tabConfig.dashboard = this.dashboard;

		// Check if ajax Fetch is configured either on the tab level or on the global config level
		var fetch = tabConfig.fetch || this.config.fetch;

		// Load DataManager with configuration
		dataManager = new DataManager({fetch: fetch, tabName:tabConfig.name}, this.data?.[tabConfig.name]);

		var tab = new Tab({tabs: this, config: tabConfig, dataManager: dataManager, templateManager: this.templateManager, language: this.language});
		this.tabs[t].dataManager = dataManager;
		this.tabs[t].tab = tab;
		this.append(tab);
		//var tl = gsap.timeline();
		//tl.from("#" + recordset.uid + " " + Record.defaultTemplate.item, {duration: 0.3, opacity: 0, x: 1600, stagger: 0.05});
	}
	if (!this.config.initialActiveTab){
		let keys = Object.keys(this.tabs); 
		this.config.initialActiveTab = keys.length?keys[0]:null;
	}
	this.goToTab(this.config.initialActiveTab);
}

Tabs.prototype.goToTab = function(tabName){
	if (tabName){
		//disable old active tab
		if (this.activeTab && this.activeTab.name != tabName){
			this.activeTab.deactivate();
			this.activeTab = null;
		}

		// Select new Tab
		this.activeTab = this.getChild(tabName);
		this.activeTab.setActive(true);
		this.activeTab.refresh();
	}	
};

Tabs.prototype.processTabs = function (){
	for (var t in this.tabs){
		var tabConfig = this.tabs[t]; 

		// Set The Name
		if (!tabConfig.name){
			tabConfig.name = t;
		}

		
		// Set Translated Name
		var translatedName = tabConfig.name;
		if (tabConfig?.translation?.[this.language]) {
			translatedName = tabConfig.translation[this.language];
		};
		this.translatedName = translatedName;
		// Check if the data supplied is an array with no tabnames, then use the same data set for all tabs
		if (this.data){
			// Copy the dataset to a originalData
			if (Array.isArray(this.data) && !this.originalData){
				this.originalData = clone(this.data);
				this.data = {};
			}
			if (this.originalData){
				if (!this.data){
					this.data = {};
				}
				this.data[t] = this.originalData;
			}
		}
	}
};


/**************************************************************************************************
 * 	Class Template 
 * ---------------------------------
 *	@param {Object} 					config 														The Config Object
 *  @param {string}						config.name													Required: The Name of the Template
 *  @param {Templatemanager}	config.templateManager							The Template manager Object That Manages the Template 
 *  @param {Object} 					config.selectors										An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					config.useExistingElement = false		false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 *  Description: 
 * 			Builds Templates out of HTML Objects 
 * 	Example:
 * 		Simplest Form:
 * 				var template = new Template({name: "clock"});
 * 															// Will look for a selector: ".clock-element" inside the current document root, and make a copy of that node
 * 		Advanced:
 * 				var template = new Template({
 * 															name: "clock", 
 * 															templateManager: tm, 
 * 															selectors: {wrapper:"", item: ".the-clock", itemText: ".text", container: ".container"},
 * 															useExistingElement: true
 * 												});
 * 															// Will look for a selector:".the-clock" inside the templateManager document object, using the existing node as a live template (no copy of the node is made) 
 *************************************************************************************************/

function Template({name, templateManager, selectors, useExistingElement}) {
	this.init(name, selectors, templateManager, useExistingElement);
}

Template.prototype.init = function (templateName, selectors, templateManager, useExistingElement){
	this.objects = {};
	this.object = {};
	this.selectors = {};
	this.name = templateName;
	this.generateId();
	this.templateManager = templateManager?templateManager:new TemplateManager();
	this.useExistingElement = useExistingElement===false?false:true;
	this.currentIcons = {};
	this.selectors = {
		wrapper: "",
		item: "." + Template.sanitizeName(templateName) + "-component",
		itemText : "." + Template.sanitizeName(templateName) + "-text",
		itemIcon : "." + Template.sanitizeName(templateName) + "-icon",
		itemLink : "." + Template.sanitizeName(templateName) + "-link",
		itemImage : "." + Template.sanitizeName(templateName) + "-image",
		container: "." + Template.sanitizeName(templateName) + "-container"
	};

	// Merge passed in Selectors with the Default Selectors.
	if (selectors){
		this.selectors = {...this.selectors, ...selectors};
	}

	// If there is no wrapper configured, make it's selector an empty string
	if (!this.selectors.wrapper) {
		this.selectors.wrapper = "";
	}
};

Template.prototype.setText = function (value, selectorKey){
	if (!selectorKey){
		selectorKey = "itemText"
	}
	try{
		this.objects[selectorKey].innerHTML = value
	}catch(err){
		console.log("%cTemplate "+this.name+" setText: " + err, 'color:  #989126');
	}
};

Template.prototype.addClass = function (value, selectorKey){
	if (value!=""){
		if (!selectorKey){
			selectorKey = "item"
		}
		var valueArray = value.split(' ');
		try{
			for (var v in valueArray){
				this.objects[selectorKey].classList.add(valueArray[v]);
			}
		}catch(err){
			console.log("%cTemplate "+this.name+" addClass: " + err, 'color:  #989126');
		}
	}
};
Template.prototype.removeClass = function (value, selectorKey){
	if (!selectorKey){
		selectorKey = "item"
	}
	try{
		var valueArray = value.split(' ');
		for (var v in valueArray){
			this.objects[selectorKey].classList.remove(valueArray[v]);
		}
	}catch(err){
		console.log("%cTemplate "+this.name+" removeClass: " + err, 'color:  #989126');
	}
};
Template.prototype.setImage = function (value, selectorKey){
	if (!selectorKey){
		selectorKey = "itemImage"
	}
	try{
		this.objects[selectorKey].setAttribute("src", value);
	}catch(err){
		console.log("%cTemplate "+this.name+" setImage: " + err, 'color:  #989126');
	}
};

Template.prototype.setBackgroundImage = function (value, selectorKey, properties){
	if (!selectorKey){
		selectorKey = "itemBackgroundImage"
	}
	try{
		this.objects[selectorKey].style.background = 'url("'+value+'")';
		this.objects[selectorKey].style.backgroundPosition = 'center center';
		this.objects[selectorKey].style.backgroundRepeat = 'no-repeat';
		this.objects[selectorKey].style.backgroundSize = 'cover';
		if (properties){
			for (var p in properties){
				this.objects[selectorKey].style.cssText += p + ":" + properties[p] + ";";
			}
		}
	}catch(err){
		console.log("%cTemplate "+this.name+" setBackgroundImage: " + err, 'color:  #989126');
	}
};


Template.prototype.setIcon = function (value, selectorKey){
	if (!selectorKey){
		selectorKey = "itemIcon"
	}
	this.currentIcons[selectorKey] = value;
	this.addClass(value, selectorKey);
};

Template.prototype.removeIcon = function (selectorKey){
	if (!selectorKey){
		selectorKey = "itemIcon"
	}
	if (this.currentIcons[selectorKey]){
		this.removeClass(this.currentIcons[selectorKey], selectorKey);
	}
};

Template.prototype.setLink = function (value, selectorKey, target){
	if (!selectorKey){
		selectorKey = "itemLink"
	}
	if (!this.objects[selectorKey]){
		selectorKey = "item"
	}
	var linkClassName = String(this.selectors[selectorKey]).replaceAll(".", "");
	try{
		if (String(this.objects[selectorKey].tagName).toLowerCase() == "a"){
			this.objects[selectorKey].setAttribute("href", value);
			this.objects[selectorKey].setAttribute("target", target);
		}else{
			var itemLink = this.objects[selectorKey].wrap('<a href="'+value+'" class="'+linkClassName+'"></a>');
			this.objects[selectorKey] = itemLink;
			this.objects[selectorKey].setAttribute("target", target);
			if (this.selectors[selectorKey] == this.selectors.item){
				return itemLink;
			}
			
			//this.selectors.itemLink = linkClassName;
		}
	}catch(err){
		console.log("%cTemplate "+this.name+" setLink: " + err, 'color: #989126');
	}
};

Template.prototype.render = function (){

	if (this.useExistingElement){
		// Use LIVE DOM
		if (this.selectors.wrapper) {
			this.objects.wrapper = this.templateManager.liveDOMNode.querySelector(this.selectors.wrapper);
			//console.log("%cGenerating Template by using existing element for " + this.name + " -> wrapper : " + this.selectors.wrapper, "color: blue", this.objects.wrapper);
		} 
		this.objects.item = this.templateManager.liveDOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item);		
		// If the DOM object we are trying to use has been emptied out from the liveDOMNode, grab a copy from the DOMNode
		if (this.objects.item && this.objects.item.innerHTML==''){
			if (this.selectors.wrapper) {
				this.objects.wrapper = this.templateManager.DOMNode.querySelector(this.selectors.wrapper);
				//console.log("%cGenerating New Template for " + this.name + " -> wrapper : " + this.selectors.wrapper, "color: blue", this.objects.wrapper);
			}
			this.objects.item = this.templateManager.DOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item)?.cloneNode(true);
			if (this.objects.item){
				this.templateManager.liveDOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item).innerHTML = this.objects.item.innerHTML;
				this.objects.item = this.templateManager.liveDOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item);
			}

		}			
		//console.log("%cGenerating Template by using existing element for " + this.name + " -> item : " + this.selectors.item, "color: blue", this.objects.item);
	} else {
		if (this.selectors.wrapper) {
			this.objects.wrapper = this.templateManager.DOMNode.querySelector(this.selectors.wrapper);
			//console.log("%cGenerating New Template for " + this.name + " -> wrapper : " + this.selectors.wrapper, "color: blue", this.objects.wrapper);
		}
		this.objects.item = this.templateManager.DOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item).cloneNode(true);
		//console.log("%cGenerating New Template for " + this.name + " -> item : " + this.selectors.item, "color: blue", this.objects.item);
	}

	// Loop through the Template Selectors and 
	// create The HTML Node Objects for the Template from the Selectors.
	var selectorKeys = Object.keys(this.selectors);
	var i;
	for (i in selectorKeys) {
		var selectorKey = selectorKeys[i];
		var selector = this.selectors[selectorKey];
		if (selectorKey!="item" && selectorKey!="wrapper"){
			// If Template Selector is a string
			if (typeof selector === "string" && selector) {
				var templateObject = this.objects[selectorKey];
				// Check if the HTML Node object already exists, then don't clone it
				if (!templateObject) {
					var selectedNode = this.objects.item.querySelector(selector);

					if (selectedNode) {
						this.objects[selectorKey] = selectedNode;
						//console.log("%cGeneratring Template by using existing element for " + this.name + " -> " + selectorKey + " : " + selector, "color: blue", this.objects[selectorKey]);
					} else {
						var selectedNode = this.objects.item.matches(selector);
						if (selectedNode) {
							this.objects[selectorKey] = this.objects.item;
						}else{
							// Node not found
							//console.log("%cCannot find Node for " + this.name + " -> " + selectorKey + " : " + selector, "color: red");
						}
					}
				}
			// If Template selector is an object, then traverse it's children and get all child objects
			}else if (typeof selector === "object" && selector){
				for (var childKey in selector){
					if (selector.hasOwnProperty(childKey)){
						childSelector = selector[childKey];
						if (childSelector){
							var selectedNode = this.objects.item.querySelector(childSelector);

							if (selectedNode) {
								if (!this.objects[selectorKey]){
									this.objects[selectorKey] = {};
								}
								this.objects[selectorKey][childKey] = selectedNode;
								//console.log("%cGeneratring Template by using existing element for " + this.name + " -> " + selectorKey + " -> " + childKey +  " : " + childSelector, "color: blue", this.objects[selectorKey][childKey]);
							} else {
								//console.log("%cCannot find Node for " + this.name + " -> " + selectorKey + " -> " + childKey +  " : " + childSelector, "color: red");
							}		
						}
				
					}
				}
				
			}
		}
	}

	// Now Clear the Container from it's contents so we can start appending with a clean slate!
	if (this.objects["container"]){
		if (isElement(this.objects["container"])){
			this.objects["container"].innerHTML = "";
		}else{
			for (var c in this.objects["container"]){
				if (this.objects["container"].hasOwnProperty(c)){
					var container = this.objects["container"][c];
					if (container){
						container.innerHTML = "";
					}
				}
			}
		}
		
	}/* else if (this.objects["item"]){
		if (isElement(this.objects["item"])){
			this.objects["item"].innerHTML = "";
		}
	} */
	this.object = this.objects.item;
	this.setId();
	this.addClass(Template.sanitizeName(this.name) + "-element")
	//console.log("%cTemplate Generated Sucessfully for " + this.name + ". Id: " + this.id, "color: green", this);

};



Template.prototype.clone = function (){
	var clonedTemplate = new Template({name: this.name, selectors: this.selectors, templateManager: this.templateManager, useExistingElement: false});
	clonedTemplate.render();
	return clonedTemplate;
};


Template.prototype.setId = function () {	// Append to an optional Container 
	try {
		if (this.object) {
			this.object.id = this.id;
		} else {
			throw "Error: " + this.name + " has no Node Object.";
		}
	} catch (err) {
		console.log(err);
	}	
};
/**************************************************************************************************
 * 	method append(childTemplate, container)
 * ---------------------------------
 * 	@param {Template}			childTemplate 															Child Template to Attach.
 * 	@param {string}				[container=template.selectors.container] 		The porperty of the selector of one of the containers. If Omitted, then there is only a single container, use it.
 * 
 *  Description: 
 * 			Returns a template object which includes the selectors and the clones of the template Nodes
 * 
 * 
 */

Template.prototype.append = function (childObject, containerSelectorKeyName) {	// Append to an optional Container 
	try {
		if (this.object) {
			if (childObject.object) {
				// Define the container, if optional containerSelectorKeyName is passed, use that container selector instead
				var container = this.selectors.container;
				var containerKeyName = "container";
				var appendToObjectDirectly = true;

				// If the containerSelectorKeyName refers to one of the items not in container, just assign it to that item
				if (this.selectors[containerSelectorKeyName]){
					containerKeyName = containerSelectorKeyName;	// Default container
					container = this.selectors[containerSelectorKeyName];
				}else{
					if (containerSelectorKeyName) {
						// If containerSelectorKeyName is defined, but the container is a string, then assume the containerSelectorKeyName is an actual selector.
						if (typeof container == "string"){
							container = containerSelectorKeyName;
							containerKeyName = null;
							appendToObjectDirectly = false;
						}else{
						// but if the container is an object, then the containerSelectorKeyName is the name of the container selector key!
							container = this.selectors.container[containerSelectorKeyName];
							containerKeyName = containerSelectorKeyName;
							
							if (!container){
								// If you cannot find the container by supplied Key, then just use the containerSelectorKeyName as a selector.
								container = containerSelectorKeyName;
								containerKeyName = null;
								appendToObjectDirectly = false;
							}
						}
					}
				}
				// If a container is defined, append to the container, if not, append to the item itself
				if (container && container != "") {
					if (appendToObjectDirectly){
						if (this.objects[containerKeyName]){
							this.objects[containerKeyName].appendChild(childObject.object);
						}else if (this.objects.container[containerKeyName]){
							this.objects.container[containerKeyName].appendChild(childObject.object);
						}else{
							throw "Error: " + this.name + " has no Container named: " + containerKeyName + " with a selector: " + container;
						}
					}else{
						this.object.querySelectorAll(container).appendChild(childObject.object);
					}
					
				} else {
					this.object.appendChild(childObject.object);
				}
			} else {
				throw "Error: " + childObject.name + " has no Node Object.";
			}
		} else {
			throw "Error: " + this.name + " has no Node Object.";
		}
	} catch (err) {
		console.log(err);
	}	
};


Template.prototype.prepend = function (childObject, containerSelectorKeyName) {	// Append to an optional Container 
	try {
		if (this.object) {
			if (childObject.object) {
				// Define the container, if optional containerSelectorKeyName is passed, use that container selector instead
				var container = this.selectors.container;
				var containerKeyName = "container";	// Default container
				var appendToObjectDirectly = true;

				// 
				if (this.selectors[containerSelectorKeyName]){
					containerKeyName = containerSelectorKeyName;	// Default container
					container = this.selectors[containerSelectorKeyName];
				}else{
					if (containerSelectorKeyName) {
						// If containerSelectorKeyName is defined, but the container is a string, then assume the containerSelectorKeyName is an actual selector.
						if (typeof container == "string"){
							container = containerSelectorKeyName;
							containerKeyName = null;
							appendToObjectDirectly = false;
						}else{
						// but if the container is an object, then the containerSelectorKeyName is the name of the container selector key!
							container = this.selectors.container[containerSelectorKeyName];
							containerKeyName = containerSelectorKeyName;
							
							if (!container){
								// If you cannot find the container by supplied Key, then just use the containerSelectorKeyName as a selector.
								container = containerSelectorKeyName;
								containerKeyName = null;
								appendToObjectDirectly = false;
							}
						}
					}
				}

				// If a container is defined, append to the container, if not, append to the item itself
				if (container && container != "") {
					if (appendToObjectDirectly){
						if (this.objects[containerKeyName]){
							this.objects[containerKeyName].prependChild(childObject.object);
						}else{
							this.objects.container[containerKeyName].prependChild(childObject.object);
						}
					}else{
						this.object.querySelectorAll(container).prependChild(childObject.object);
					}
					
				} else {
					this.object.prependChild(childObject.object);
				}
			} else {
				throw "Error: " + childObject.name + " has no Node Object.";
			}
		} else {
			throw "Error: " + this.name + " has no Node Object.";
		}
	} catch (err) {
		console.log(err);
	}	
};

Template.prototype.generateId = function (optionalName) {
	try {
		var name = optionalName;
		if (!name) {
			name = this.name;
		}
		var newId = Template.generateId(name);
		this.id = newId;
	} catch (err) {
		console.log(err);
	}
};

Template.generateId = function (optionalName) {
	try {
		var name = optionalName;
		if (name) {
			var id = Template.generateIdFromName(name);
		} else {
			throw "Warning: " + this + " has no name. A random Id will be generated.";
		}
	} catch (err) {
		console.log(err);
		var id = Template.generateRandomId();
		return id;
	}
	return id;
};

Template.generateIdFromName = function (name) {
	var uuid = Template.generateRandomId();
	var id = String(name).trim();
	id = id.replace("'", "");
	id = id.replace("\"", "");
	id = id.replace(/[^\w]/gi, '_');
	id = id.toLowerCase();
	id += "-" + uuid;
	return id;
};

Template.sanitizeName = function (name) {
	var id = String(name).trim();
	id = id.replace("'", "");
	id = id.replace("\"", "");
	id = id.replace(/[^\w]/gi, '_');
	id = id.toLowerCase();
	return id;
};

Template.generateRandomId = function () {
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


function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;  
}


/**************************************************************************************************
 * 	Class TemplateManager(rootNode)
 * ---------------------------------
 * 	@param {Node}								[rootNode=document.querySelector("*")] 			optional:	HTML Node of the template. By default it is the root of the current document.
 * 
 *  Description: 
 * 			Builds Templates out of HTML Objects 
 *************************************************************************************************/

function TemplateManager(rootNode) {

	// Initialize the template by making a copy of the DOM
	if (!rootNode){
		rootNode=document.querySelector("*");
	}
	this.DOMNode = rootNode.cloneNode(true);
	this.liveDOMNode = rootNode;
	this.cachedTemplates = {};
}

/**************************************************************************************************
 * 	method getTemplate(selectors)
 * ---------------------------------
 * 	@param {Object Literal}			selectors 										Selectors for genertaing the template.
 * 	@param {string}							templateName 									Pass in any custom Template Name to store the generated template for future retrieval in this.cachedTemplates (for caching)
 * 	@param {boolean}						useExistingElement 						Don't create a clone of the template, directly manipulate the existing one, live.
 * 
 *  Description: 
 * 			Returns a template object which includes the selectors and the clones of the template Nodes
 * 
 * example return:
 * template = {
 * 		
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

TemplateManager.prototype.getTemplate = function (templateName, selectors, useExistingElement) { // pass Optional templateName to enable TemplateCacheing (store template for further use)

	if (this.DOMNode) {

		//console.log("%cGenerating a template for " + templateName + " using the following selectors: ", "color: green", selectors);
		/***** 
		 * 		Check if the template was generated & processed before 
		 * 		(no need to re-process the Template each item, wastes cpu)  
		 * 		make sure that the selectors are the same as the ones cached (otherwise regenerate the template!)
		 * ********/
		if (templateName && this.cachedTemplates[templateName] && (selectors?shallowCompare(this.cachedTemplates[templateName].selectors, selectors):true) && !useExistingElement) {
			// Use the template that was generated before
			var template = this.cachedTemplates[templateName].clone();
			//console.log("%cUsing Existing Template for " + templateName + ". Id: " + template.id, "color: green", template);
		} else {
			// Get the HTML Node objects of the items that were not already provided.
			// Create Wrapper Object & Item Object
				
			// Create Template 
			var template = new Template({name: templateName, selectors: selectors, templateManager: this, useExistingElement: useExistingElement});
			template.render();
			
			// Store the generated Template in the Static Object, to be retrieved in case more objects are created (instead of re-cloning the template each time).
			if (templateName){
				this.cachedTemplates[templateName] = template.clone();
			}
		}

		return template;
	} else {
		console.log("%cNo Template was instantiated!", "color: red");
		throw "No Template was instantiated!";
	}

};
function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;  
}

/**** UserProfile Class
 *		
 *	UserProfile Class
 * 
******************* */

function UserProfile(settings) {
	Component.call(this, settings);
	this.dashboard = settings.dashboard;
	//this.setLink(url);
}
UserProfile.prototype = Object.create(Component.prototype);
UserProfile.prototype.constructor = UserProfile;

/**** ViewSwitcher Class
|*		
|*	ViewSwitcher Class
 * -----------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.tab													Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function ViewSwitcher(settings) {
	Component.call(this, settings);
	this.viewMode = this.viewMode?String(this.viewMode).trim().toLowerCase():'cards';
	this.tab = settings.tab;
	this.dashboard = settings.tab.dashboard;
	this.refresh();
	this.switchView(this.viewMode);
	//console.log(this);
}

ViewSwitcher.prototype = Object.create(Component.prototype);
ViewSwitcher.prototype.constructor = ViewSwitcher;

ViewSwitcher.prototype.refresh = function (){
	if (!this.viewMode){
		this.viewMode = 'cards';
	}
	this.removeChildren();
	this.unhighlight();
	var viewSwitcher = this;
	var cards = new ViewSwitcherButton({
		viewSwitcher: this, 
			config: {
				name: 'cards',
				onClick: function(){
					viewSwitcher.switchView('cards');
				},
				id: this.tab+'_view_cards',
				image:'../assets/cards.png'
			}, 
		templateManager: this.templateManager
	});
	this.append(cards);

	var list = new ViewSwitcherButton({
		viewSwitcher: this, 
		config: {
			name: 'list',
			onClick: function(){
				viewSwitcher.switchView('list');
			},
			id: this.tab+'_view_list',
			image:'../assets/list.png'
		}, 
		templateManager: this.templateManager
	});
	this.append(list);
	this.renderHighlights();
};

ViewSwitcher.prototype.switchView = function (mode){
	this.viewMode = mode;
	this.tab.viewMode = mode;
	this.dashboard.switchView(mode);
	this.renderHighlights();
};

ViewSwitcher.prototype.renderHighlights = function(){
	this.getChild('cards')?.unhighlight();
	this.getChild('list')?.unhighlight();
	this.getChild(this.viewMode)?.highlight();
};

ViewSwitcher.prototype.unhighlight = function(){
	this.getChild('cards')?.unhighlight();
	this.getChild('list')?.unhighlight();
};


/**** ViewSwitcherButton Class
 *		
 *	ViewSwitcherButton Class 
 *  ---------------------------------------------
 *	@param {Object} 					settings 														The Settings Object
 *	@param {Object}						settings.viewSwitcher									Required: A Reference to the tab object where the pagination will attach
 *  @param {string}						settings.config												Required: The config object of the dashboard
 *  @param {string}						settings.data													Optional: The data to run the dashboard
 *  @param {Templatemanager}	settings.templateManager							Optional: The Template manager Object That Manages the Template, if not passed, one will be created automatically
 *  @param {Object} 					settings.selectors										Optional: An Object literal of Selectors	ex: {wrapper:".wrapper", item: ".action-element", itemText: ".text", container: ".container"}	
 * 	@param {boolean}					settings.useExistingElement = false		Optional: false: make a copy of the existing node. true: using the existing node as a live template and make changes there directly (ie don't make a copy of the node) 
 * 	@param {string}						settings.templateURL									Optional: the url for the html template
 * 	@param {string}						settings.appendTo											Optional: the HTML node you will append this component to
 *
******************* */

function ViewSwitcherButton(settings) {
	Component.call(this, settings);
	this.viewSwitcher = settings.viewSwitcher;
	this.dashboard = settings.viewSwitcher.dashboard;
	//this.setText(this.name);
	//clone field
	//var fieldObject = this.object;
	//this.setText(this.config.name?this.config.name:this.config.pageNumber);
	//fieldObject.innerHTML = this.config.pageNumber;
}
ViewSwitcherButton.prototype = Object.create(Component.prototype);
ViewSwitcherButton.prototype.constructor = ViewSwitcherButton;

ViewSwitcherButton.prototype.highlight = function (){
	this.addClass("active");
};

ViewSwitcherButton.prototype.unhighlight = function (){
	this.removeClass("active");
};

				return {
					Action: Action,
					ActionsContainer: ActionsContainer,
					ActionsMenu: ActionsMenu,
					Component: Component,
					Dashboard: Dashboard,
					DataManager: DataManager,
					Field: Field,
					FieldHeader: FieldHeader,
					FieldHeaderContainer: FieldHeaderContainer,
					FileLoader: FileLoader,
					Filtering: Filtering,
					FilteringKeyword: FilteringKeyword,
					PageButton: PageButton,
					Paging: Paging,
					Record: Record,
					Recordset: Recordset,
					Sorting: Sorting,
					SortingItem: SortingItem,
					Tab: Tab,
					Tabs: Tabs,
					Template: Template,
					TemplateManager: TemplateManager,
					UserProfile: UserProfile,
					ViewSwitcher: ViewSwitcher,
					ViewSwitcherButton: ViewSwitcherButton
				};
			})();