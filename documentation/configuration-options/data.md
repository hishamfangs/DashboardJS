# Data

You can either supply the data synchronously to populate the dashboard when initiating the dashboard, or you can configure a fetch call to get the data asnychronously from an API.

## &#x20;Synchronous Data

Set the data on the data property when initiating the dashboard:

&#x20;

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
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
  tabs: {
      'User Profiles': {
        recordSettings:{
          fields: {
            Date: { name: 'Date of Birth' },
            Status: { name: 'Marital Status'},
            Name: {	name: 'Name'},
            Gender: { name: 'Gender' }
          },
          actions: {
            'More details...': {
              icon: 'info-icon',
              onClick: function(actionObj){
                alert('Clicked More Info ...');
              }
            }, 
            'Pay': {
              icon: 'pay-icon',
              visibility: function (actionObj) {
                // returns a string representing the visibility
                return 'disable';
              },
              onClick: function(actionObj){
                alert('Clicked Pay!');
              }
            },
            'Edit': {
              icon: 'edit-icon',
              onClick: function(actionObj){
                alert('Clicked Edit');
              }
            },
            'Cancel': {
              icon: 'cancel-icon',
              onClick: function(actionObj){
                alert('Clicked Cancel');
              }
            }
          }
        }
      }
    }
  },
  templateURL: 'dashboard.html',
  appendTo: document.querySelector(".dashboard-container")
});
```
