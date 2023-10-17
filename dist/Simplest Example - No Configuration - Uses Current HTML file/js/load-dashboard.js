/************************************	Load Dashboard	*************************************/
/******************************************************************************************
|* 	Date: March 10th, 2018
|* 	Author: Hisham El Fangary
|* 	Description: Load the Dashboard, attach it to a container.
|* 	
*******************************************************************************************/
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

console.log("Dashboard: ", dashboard);