/************************************  Load Dashboard  *************************************/
/******************************************************************************************
|*   Date: March 10th, 2018
|*   Author: Hisham El Fangary
|*   Description: Load the Dashboard, attach it to a container.
|*   
*******************************************************************************************/

var dashboard = new FutureLabs.Dashboard({
	// The Dashboard Language (will use the translation objects in each config property to translate)
	// 'en-US' is the default langauge when the language property is ommitted
	language: 'en-US',
	config: {	
		profile:{
			name: 'John Addams',
			translation: {
				'ar-AE':'عبد الله المستكاوي'
			},
			image: 'assets/jadams.jpg',
			url: 'www.google.com',
			urlTarget: '_blank'
		},
		initialActiveTab: "User Profiles",
		tabs: {
			'User Profiles': {
				// translations for multilingual support
				// This works for all config objects: tabs, fields, actions, ...etc
				// Simply add the translations and pair them up to the language code that is passed to the dashboard in the config object
				translation: {
					'ar-AE':'ملفات تعريف المستخدم'
				},
				// The class name for the tab icon. You can use custom class names (add them to theme.css), or if you include the fontawesome library
				// you can just use the icon classname from fontawesome (Supports fontawesome)
				icon: "far fa-user",
				// A brief description that will appear on top of each tab
				// Can be just a string when multilanguage support is not needed
				// Alternatively, can be an object with language keys as below for multilingual support
				description: {
					'en-US': 'A list of all approved users',
					'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
				},	
				// Sets the default view mode for this tab: Cards view or List view
				viewMode: 'Cards',	// 'Cards' or 'List'
				// CSS GRID property/value pairs to format the records in Cards view.
				// Below is the default css properties, can be changed to any valid CSS proeprty/value pairs
				recordsGrid:{				
					'grid-template-columns': '1fr 1fr 1fr',
					'gap': '20px',
					'justify-items': 'stretch'					
				},
				// Pagination. Define how many records per page.
				// Defaults to 12!
				itemsPerPage: 12,
				recordSettings:{
					// Renders an image for each record
					image: {
						url: 'imageURL',	// this is the key that is used to retrieve the URL from the supplied data  
						height: '200px',	// Height of the image in Card View
					},
					// On Click event for the entire record
					onClick: function (record) {
						alert("Record Clicked: record: " + JSON.stringify(record.data));
					},					
					fieldsGrid: {
						'grid-template-columns': '1fr 1fr',
						'gap': '15px',
						'justify-items': 'stretch'
					},
					fields: {
						// This is a collcation of value/key pair of objects describing the record fields
						// Each key maps to the key of the supplied data to retrieve the value of each field
						Date: { 	// This key name maps to the data 
							name: "Date of Birth", // Displayed Name of the field int he dashboard
							position: "left", 	// Position in the Card View
							dataType: "Date",  // This just formats and renders the date in a graphical way
							translation: { "ar-AE": "السن" } 
						},
						Status: { 
							name: "Marital Status", 
							position: "right", 
							dataType: "String", // Does nothing at the moment
							// Can use this to modify the data value before displaying it to the dashboard							
							onGetValue: function (field){	
								if (field.data == 'Married' && field.record['Gender']=='Female'){
									return '<span style="font-weight: bold;color: #72de72">' + field.data + '</span>';
								}else{
									return field.data;
								}
							},
							translation: { "ar-AE": "الحالة الزوجية" } 
						},
						Name: {
							name: "Name", 
							position: "left",	// Position in the Card View
							// This controls the visibility of the field.
							// Accepts 3 values: show, hide, disable
							visibility: function (field){
								// Checks to see if the name of this person contains the phrase (disabled) in the name, then disable this field
								// disable greys out the field and removes all actions on the field (including onClick)
								if (field.data.indexOf('(disabled)')>-1){
									return 'disable';
								}else{
									return 'show'
								}
							},
							onClick: function (element, record) {
								console.log("Field Clicked: element, data:", element, record);
							},
							translation: { "ar-AE": "الإسم" }
						},
						Gender: { 
							name: "Gender", 
							position: "right", 	// Position in the Card View
							dataType: "String", 
							translation: { "ar-AE": "الجنس" } 
						},
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
							},
							translation: { "ar-AE": "الوصف" }
						}
					},
					// How should the actions appear? 
					// 'buttons' (default) displays the actions as buttons
					// 'menu' shows the action as a drop down menu
					actionsType: 'menu',
					actions: {
						"More details...": {
							icon: 'info-icon',
							translation: {
								'ar-AE': 'معلومات أخرى'
							},
							onClick: function(action){
								alert('Clicked More Info ... on record ' + JSON.stringify(action.record));
							}
						},
						"Pay": {
							icon: "pay-icon",
							translation: {
								'ar-AE': 'دفع'
							},
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
							translation: {
								'ar-AE': 'تعديل'
							},
							onClick: function(){
								alert('Clicked Edit');
							}
						},
						"Cancel": {
							icon: 'cancel-icon',
							translation: {
								'ar-AE': 'إلغاء'
							},
							onClick: function(){
								alert('Clicked Cancel');
							}
						}
					}
				}
			},
			Invoices: {
				description: 'This show all invoices',
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
								'grid-column':'span 2'
							},
							translation: { "ar-AE": "الإسم" }, 
							icon: "fas fa-user-circle",				// You can use Fontawesome icon classes if you include the fontawesome library
							onClick: function (field) {
								console.log("Field Clicked! field:", field);
							}
						},	
						Balance: {
							style:{
								'grid-column':'span 1'
							},
							position:"right",
							icon: "fas fa-money-bill-wave",		// You can use Fontawesome icon classes if you include the fontawesome library
							onGetValue: function(field, record){
								debugger;
								if (field.data){
									return '$' + field.data;
								}
							},
							translation: { "ar-AE": "الحساب" }, 
						},						
						Date: { 
							name: "Date of Birth", 
							position: "left", 
							dataType: "Date",  
							translation: { "ar-AE": "السن" } 
						},
						Status: { 
							name: "Marital Status", 
							translation: { "ar-AE": "خد كثير" } 
						},
						Gender: { 
							name: "Gender", 
							position: "right", 
							dataType: "Text", 
							translation: { "ar-AE": "السن" } 
						},
						Description: {
							position: "left",
							style:{
								'grid-column': 'span 3'
							},
							class: 'justify',
							width: '200px',
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
							translation: {
								'ar-AE': 'معلومات أخرى'
							},
							onClick: function(){
								alert('Clicked More Info ...');
							}
						},  	// Default View action Will appear
						"Pay": {
							icon: "pay-icon",
							translation: {
								'ar-AE': 'دفع'
							},
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
							translation: {
								'ar-AE': 'تعديل'
							},
							onClick: function(){
								alert('Clicked Edit');
							}
						},
						"Cancel": {
							icon: 'cancel-icon',
							translation: {
								'ar-AE': 'إلغاء'
							},
							onClick: function(){
								alert('Clicked Cancel');
							}
						}
					}
				}
			},
			'Payment Receipts': {
				icon: "fas fa-receipt",
				description: 'Payment Receipts',
				viewMode: 'list',
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
						Date: { 
							name: "Date of Payment", 
							position: "left", 
							dataType: "Date",  
							translation: { "ar-AE": "السن" } 
						},
						Status: { 
							name: "Marital Status", 
							position: "right", 
							dataType: "Number", 
							translation: { "ar-AE": "خد كثير" } 
						},
						Name: {
							name: "Name", 
							position: "left", 
							translation: { "ar-AE": "الإسم" },
							onClick: function (element, record) {
								console.log("Field Clicked: element, data:", element, record);
							}
						},
						Payment: { 
							name: "Payment", 
							position: "right", 
							dataType: "Number", 
							translation: { "ar-AE": "الدفع" } 
						}
					}
				}
			}
		}
	},
	data: data
});
console.log("Dashboard: ", dashboard);