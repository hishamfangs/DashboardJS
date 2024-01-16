# Data

You can either supply the data synchronously to populate the dashboard when initiating the dashboard, or you can configure a fetch call to get the data asnychronously from an API.

## &#x20;Synchronous Data

Set the data on the data property when initiating the dashboard:

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: {
    'User Profiles': [{
      'Name': 'Jessica Bambergans',
      'Status': 'Married',
      'Date': '2000-05-11',
      'Gender': 'Female'
    },{
      'Name': 'Jerome Berner',
      'Status': 'Single',
      'Date': '1980-08-10',
      'Gender': 'Male'
    },{
      'Name': 'Ruba Jackman',
      'Status': 'Married',
      'Date': '1984-01-05',
      'Gender': 'Female'
    },{
      'Name': 'Michael Chadwick',
      'Status': 'Single',
      'Date': '1970-01-15',
      'Gender': 'Male'
    },{
      'Name': 'Luis Jacob',
      'Status': 'Married',
      'Date': '1994-12-05',
      'Gender': 'Male'
    },{
      'Name': 'Jennifer Hubert',
      'Status': 'Married',
      'Date': '1969-03-27',
      'Gender': 'Female'
    }]
  },
  config: {
    tabs: {
      'User Profiles': {
        recordSettings:{
          fields: {
            Date: { name: 'Date of Birth' },
            Status: { name: 'Marital Status'},
            Name: {	name: 'Name'},
            Gender: { name: 'Gender' }
          }
        }
      }
    }
  },
  templateURL: './dashboardjs/dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```

## Asynchronous Data through fetch API

Configure the fetch property in the [config object here ->](fetch-api.md)



