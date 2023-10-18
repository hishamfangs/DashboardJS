# DashboardJS
![dashboard-full](https://github.com/hishamfangs/DashboardJS/assets/48479688/8100695e-95aa-4078-a742-8c914b7ebbd1)

DashboardJS is a free, modular, responsive, open source dashboard component to display records in a sleek and modern way, built entirely in vanilla Js, with zero dependancies. 
You can have different tabs that show different recordsets complete with pagination, sorting, filtering, and you can switch views for each recordset between Card view, and List view.

DashboardJS is fully themeable, all you need is knowledge of HTML & CSS.

DashboardJS works either Synchronously (full data loaded and fed into the Dashboard component before initiation), or Asnychronously (Dashboard loads page by page through Fetch API).

Simplest Example:
----------
```javascript
var dashboard = new FutureLabs.Dashboard({
  data: [{
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
  }]
});
```
![dashboard-simple](https://github.com/hishamfangs/DashboardJS/assets/48479688/0a0c84fc-979f-45a2-a83c-2e8113826586)

Note: The HTML template with the appropriate CSS files and assets need to be present on the loading html page for the code above to run, which can be found here: [dist/Simplest Example - No Configuration - Uses Current HTML file/index.html]()

Example with customization options for the tabs, fields & actions:
----------
```javascript
var dashboard = new FutureLabs.Dashboard({
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
            },  	
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
    "User Profiles": [{
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
    }]
  }
});
```
![dashboard-with-actions](https://github.com/hishamfangs/DashboardJS/assets/48479688/f944e6d9-9b91-4db8-86d1-ef7cbc364268)
