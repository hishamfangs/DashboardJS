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
