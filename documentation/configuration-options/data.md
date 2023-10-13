# Data

You can either supply the data synchronously to populate the dashboard when initiating the dashboard, or you can configure a fetch call to get the data asnychronously from an API.

## &#x20;Synchronous Data

Set the data on the data property when initiating the dashboard:

&#x20;

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
  templateURL: 'dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```

## Asynchronous Data through fetch API

Configure the fetch property in the config object

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    fetch: {
      url: 'http://localhost:3010/getData'
    },
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
  templateURL: 'dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```

#### Optional Fetch parameters

You can pass an options object to the fetch parameter

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    fetch: {
      url: 'http://localhost:3010/getData',
      options: { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ed2ffbf5-6312-4ce3-900a-b31f6ec068f4'
        },
        method: 'GET',
        mode: "cors",
        cache: "no-cache"
      }
    },
    ....
});

```

You can also redefine the pagination, sorting, and filtering parameters send by the fetch API

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    fetch: {
      url: 'http://localhost:3010/getData',
      dashboardParameters: {
        page : 'page',
        itemsPerPage: 'itemsPerPage',
        count: 'count',
        getCount: 'getCount',
        filterBy: 'filterBy',
        sortBy: 'sortBy'
      },
      options: { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ed2ffbf5-6312-4ce3-900a-b31f6ec068f4'
        },
        method: 'GET',
        mode: "cors",
        cache: "no-cache"
      }
    },
    ....
});


```

