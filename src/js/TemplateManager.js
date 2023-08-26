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
