# DashboardJS

DashboardJS is a free, modular, open source dashboard component to display records in a sleek and modern way, built entirely in vanilla Js, with zero dependancies. 
You can have different tabs that show different recordsets complete with pagination, sorting, filtering, and you can switch views for each recordset between Card view, List view, and Chart view.

DashboardJS is fully themeable, all you need is knowledge of HTML & CSS.

DashboardJS works either Synchronously (full data loaded and fed into the Dashboard component before initiation), or Asnychronously (Dashboard loads page by page through Fetch API).

Simplest Example:
----------

var dashboard = new Dashboard({
	config: {
  	tabs: {
  		'User Profiles': {
  			recordSettings:{
  				fields: {
  					Date: { name: "Date of Birth" },
  					Status: { name: "Marital Status"},
  					Name: {	name: "Name"},
  					Gender: { name: "Gender" }
  				},
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
  			recordSettings:{
  				fields: {
  					Name: {
  						style:{
  							'grid-column':'span 3'
  						}
  					},						
  					Date: { name: "Date of Birth" },
  					Status: { name: "Marital Status" },
  					Gender: { name: "Gender" },
  					Description: {}
  				},
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
  		Payments: {
  			recordSettings:{
  				fields: {
  					Date: { name: "Date of Birth"  },
  					Status: { name: "Marital Status" },
  					Name: {	},
  					Gender: { }
  				},
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
  },
  data: {
  "User Profiles": [
			{
					"Name": "Jessie Bambergans",
					"Status": "Married",
					"Date": "1980-08-10",
					"Gender": "Female"
			},
			{
					"Name": "Jerome Berner",
					"Status": "Single",
					"Date": "1980-08-10",
					"Gender": "Male"
			},
			{
					"Name": "Ruba Jackman",
					"Status": "Married",
					"Date": "1984-01-05",
					"Gender": "Female"
			}]
   }
});

