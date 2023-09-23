/************************************	Load Dashboard	*************************************/
/******************************************************************************************
|* 	Date: March 10th, 2018
|* 	Author: Hisham El Fangary
|* 	Description: Load the Dashboard, attach it to a container.
|* 	
*******************************************************************************************/

console.log("Page Loaded.");
/* 
const config = {	
	fetch: {
		url: 'http://localhost:3010/getData'
	},
	profile:{
		name: 'John Addams',
		image: 'assets/jadams.jpg',
		url: 'www.google.com',
		urlTarget: '_blank'
	},
	initialActiveTab: "User Profiles",
	tabs: {
		'User Profiles': {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				image: {
					url: 'imageURL',
					height: '200px',
				},
				onClick: function (record) {
					alert("Record Clicked: record: " + JSON.stringify(record.data));
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", position: "right", dataType: "Number", translation: { "ar-AE": "خد كثير" } },
					Name: {
						name: "Name", position: "left", translation: { "ar-AE": "الإسم" }, icon: "fas fa-user-circle",
						onClick: function (element, record) {
							console.log("Field Clicked: element, data:", element, record);
						}
					},
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 2'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'menu',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		},
		Invoices: {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				onClick: function (record) {
					alert("Record Clicked: record: " + JSON.stringify(record.data));
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Name: {
						style:{
							'grid-column':'span 3'
						},
						translation: { "ar-AE": "الإسم" }, 
						icon: "fas fa-user-circle",
						onClick: function (field) {
							console.log("Field Clicked! field:", field);
						}
					},						
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", translation: { "ar-AE": "خد كثير" } },
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 3'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'buttons',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		},
		Test: {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				image: {
					url: 'imageURL',
					height: '200px',
				},
				onClick: function (record) {
					alert("Record Clicked: record:", record);
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", position: "right", dataType: "Number", translation: { "ar-AE": "خد كثير" } },
					Name: {
						name: "Name", position: "left", translation: { "ar-AE": "الإسم" }, icon: "fas fa-user-circle",
						onClick: function (element, record) {
							console.log("Field Clicked: element, data:", element, record);
						}
					},
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 2'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'menu',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		}
	}
};

var dashboard = new Dashboard({
	config: config, 
	//data: data,
	templateURL: 'dashboard.html',
	appendTo: document.querySelector(".dashboard-container")
});
 */

const config = {	
	fetch: {
		url: 'http://localhost:3010/getData'
	},
	profile:{
		name: 'John Addams',
		image: 'assets/jadams.jpg',
		url: 'www.google.com',
		urlTarget: '_blank'
	},
	initialActiveTab: "User Profiles",
	tabs: {
		'User Profiles': {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				image: {
					url: 'imageURL',
					height: '200px',
				},
				onClick: function (record) {
					alert("Record Clicked: record: " + JSON.stringify(record.data));
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", position: "right", dataType: "Number", translation: { "ar-AE": "خد كثير" } },
					Name: {
						name: "Name", position: "left", translation: { "ar-AE": "الإسم" }, icon: "fas fa-user-circle",
						onClick: function (element, record) {
							console.log("Field Clicked: element, data:", element, record);
						}
					},
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 2'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'menu',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		},
		Invoices: {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				onClick: function (record) {
					alert("Record Clicked: record: " + JSON.stringify(record.data));
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Name: {
						style:{
							'grid-column':'span 3'
						},
						translation: { "ar-AE": "الإسم" }, 
						icon: "fas fa-user-circle",
						onClick: function (field) {
							console.log("Field Clicked! field:", field);
						}
					},						
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", translation: { "ar-AE": "خد كثير" } },
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 3'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'buttons',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		},
		Test: {
			icon: "fas fa-address-book",
			description: 'This is the first Test Tab',
			viewMode: 'Cards',
			recordsGrid:{
				'grid-template-columns': '1fr 1fr 1fr',
				'gap': '20px',
				'justify-items': 'stretch'					
			},
			recordSettings:{
				image: {
					url: 'imageURL',
					height: '200px',
				},
				onClick: function (record) {
					alert("Record Clicked: record:", record);
				},					
				fieldsGrid: {
					'grid-template-columns': '1fr 1fr',
					'gap': '15px',
					'justify-items': 'stretch'
				},
				fields: {
					Date: { name: "Date of Birth", position: "left", dataType: "Date",  translation: { "ar-AE": "السن" } },
					Status: { name: "Marital Status", position: "right", dataType: "Number", translation: { "ar-AE": "خد كثير" } },
					Name: {
						name: "Name", position: "left", translation: { "ar-AE": "الإسم" }, icon: "fas fa-user-circle",
						onClick: function (element, record) {
							console.log("Field Clicked: element, data:", element, record);
						}
					},
					Gender: { name: "Gender", position: "right", dataType: "Text", translation: { "ar-AE": "السن" } },
					Description: {
						position: "left",
						style:{
							'grid-column': 'span 2'
						},
						class: 'justify',
						onGetValue: function (item){
							// If there is no value
							if (!item.data){
								return '<span style="color: gray">N/A</span>'
							}
						}
					}
				},
				actionsType: 'menu',	// menu or buttons
				actions: {
					"More details...": {
						icon: 'info-icon',
						onClick: function(){
							alert('Clicked More Info ...');
						}
					},  	// Default View action Will appear
					"Pay": {
						icon: "pay-icon",
						visibility: function (actionObj) {
							// returns a string representing the visibility
							return "disable";
						},
						onClick: function(){
							alert('Clicked Pay!');
						}
					},
					"Edit": {
						icon: 'edit-icon',
						onClick: function(){
							alert('Clicked Edit');
						}
					},
					"Cancel": {
						icon: 'cancel-icon',
						onClick: function(){
							alert('Clicked Cancel');
						}
					}
				}
			}
		}
	}
};

var dashboard = new FutureLabs.Dashboard({
  config: config,
	/* data: [{
      "Name": "Jessie Bambergans",
      "Status": "Married",
      "Date": "1980-08-10",
      "Gender": "Female"
    },{
      "Name": "Jerome Berner",
      "Status": "Single",
      "Date": "1980-08-10",
      "Gender": "Male"
    },{
      "Name": "Ruba Jackman",
      "Status": "Married",
      "Date": "1984-01-05",
      "Gender": "Female"
    }], */
	templateURL: 'dashboard.html',
	appendTo: document.querySelector(".dashboard-container")
});
console.log("Dashboard: ", dashboard);