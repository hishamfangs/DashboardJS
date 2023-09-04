
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
function Paging(tab, config, dataManager, template, useExistingElement) {
	Component.call(this, config, null, template, useExistingElement);
	this.dataManager = dataManager;
	this.tab = tab;
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
	
	var pageStart = new PageButton({
		pageNumber: '1', 
		name: '<<',
		onClick: function(){
			paginationObject.tab.goToPage(this.pageNumber);
			paginationObject.unhighlight()
			this.highlight();
		},
		id: this.tab+'_page_'+p+'_start'
	}, this.templateManager);
	this.append(pageStart);

	var prevBlock = new PageButton({
		pageNumber: '', 
		name: '<',
		onClick: function(){
			paginationObject.visibleBlock = visibleBlock-1<=0?1:visibleBlock-1;
			paginationObject.refresh();
		},
		id: this.tab+'_page_'+p+'_prev'
	}, this.templateManager);
	this.append(prevBlock);

	for (var p=startPage; p<=endPage; p++) {
		var pageBtn = new PageButton({
			pageNumber: p, 
			onClick: function(){
				paginationObject.tab.goToPage(this.pageNumber);
				paginationObject.unhighlight()
				this.highlight();
				paginationObject.visibleBlock = null
			},
			id: this.tab+'_page_'+p
		}, this.templateManager);
		this.append(pageBtn);
	}

	
	var nextBlock = new PageButton({
		pageNumber: '', 
		name: '>',
		onClick: function(){
			paginationObject.visibleBlock = visibleBlock+1>totalBlocks?totalBlocks:visibleBlock+1;
			paginationObject.refresh();
		},
		id: this.tab+'_page_'+p+'_prev'
	}, this.templateManager);
	this.append(nextBlock);

	var pageEnd = new PageButton({
		pageNumber: this.dataManager.pages, 
		name: '>>',
		onClick: function(){
			paginationObject.tab.goToPage(dataManager.pages);
			paginationObject.unhighlight()
			this.highlight();
		},
		id: this.tab+'_page_'+p+'_end'
	}, this.templateManager);
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
Paging.defaultTemplate = {
	wrapper: "",
	item: ".paging",
	itemText: "",
	itemIcon: "",
	itemLink: "",
	container: ".paging-container"
};
