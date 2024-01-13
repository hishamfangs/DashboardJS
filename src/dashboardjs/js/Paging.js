
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
