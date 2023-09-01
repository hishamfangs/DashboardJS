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

|********************/
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
		var response = await fetch(url, options);
		var res = await response.json();
		console.log(res);
		debugger;
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
		pageKey : 'page',
		itemsPerPage: 'itemsPerPage',
		count: 'count',
		getCount: 'getCount',
		filterBy: 'filterBy',
		sortBy: 'sortBy'
	};
	dashboardParameters = {...defaultParameters}; 
	if (this.fetch.dashboardParameters){
		dashboardParameters = {...dashboardParameters, ...this.fetch.dashboardParameters}
	}

	const data = new URLSearchParams();
	data.append(dashboardParameters.pageKey, this.page);
	data.append(dashboardParameters.itemsPerPage, this.itemsPerPage);
	data.append(dashboardParameters.getCount, countOnly||false);
	data.append(dashboardParameters.filterBy, JSON.stringify(this.filtering.keywords));
	data.append(dashboardParameters.sortBy, JSON.stringify(this.sorting));		
	
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
			var pages = Math.ceil(count/itemsPerPage);
			this.pages = pages;
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
DataManager.prototype.updateProcessedDataset = function(){
	this.processedData = this.data.paged;
};

DataManager.prototype.goToPage = async function (page){
	debugger;
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



