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
		this.objects.item = this.templateManager.liveDOMNode.matches(this.selectors.wrapper + " " + this.selectors.item)?this.templateManager.liveDOMNode:this.templateManager.liveDOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item);		
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
		this.objects.item = this.templateManager.DOMNode.matches(this.selectors.wrapper + " " + this.selectors.item)?this.templateManager.DOMNode.cloneNode(true):this.templateManager.DOMNode.querySelector(this.selectors.wrapper + " " + this.selectors.item).cloneNode(true);		
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

