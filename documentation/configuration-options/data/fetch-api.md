# Fetch API

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

You can also pass an optional options object to the fetch parameter

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

You can also redefine the default pagination, sorting, and filtering parameters sent by the fetch API:

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
