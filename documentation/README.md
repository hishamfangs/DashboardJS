# Getting Started

## DashboardJS

DashboardJS is a free, modular, responsive, open source dashboard component to display records in a sleek and modern way, built entirely in vanilla Js, with zero dependancies. You can have different tabs that show different recordsets complete with pagination, sorting, filtering, and you can switch views for each recordset between Card view, and List view.

DashboardJS is fully themeable, all you need is knowledge of HTML & CSS.

DashboardJS works either Synchronously (full data loaded and fed into the Dashboard component before initiation), or Asnychronously (Dashboard loads page by page through Fetch API).



### Setting up

This is the basic HTML to load the dashboard

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>My Dashboard</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<link rel="stylesheet" href="https://github.com/hishamfangs/DashboardJS/dist/css/rules.css">		
		<link rel="stylesheet" href="https://github.com/hishamfangs/DashboardJS/dist/css/theme.css">		
		<script src="https://github.com/hishamfangs/DashboardJS/dist/dashboard-all.js"></script>	
		<script>	
		</script> 
	</head>
	<body>	
		<div class="dashboard-container">
			
		</div>
		<script src="https://github.com/hishamfangs/DashboardJS/dist/load-dashboard.js"></script>	
	</body>	
</html>
```

### Simplest Example:

```
load-dashboard.js:
```

```javascript
var dashboard = new Dashboard({
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
  }],
  templateURL: 'https://github.com/hishamfangs/DashboardJS/dist/dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```

### Example with customization options for the tabs, fields & actions:

```javascript
var dashboard = new Dashboard({
  config: {
    tabs: {
      'User Profiles': {
        recordSettings:{
          fields: {
            Date: { name: "Date of Birth" },
            Status: { name: "Marital Status"},
            Name: { name: "Name"},
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
  },
  templateURL: 'https://github.com/hishamfangs/DashboardJS/dist/dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```
