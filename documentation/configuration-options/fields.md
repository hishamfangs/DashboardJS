# Fields

Example Config Object

```javascript
config: {
  tabs: {
    "User Profiles": {
      recordSettings: {
        fields: {
          // This is a collection of value/key pair of objects describing the record fields
          // Each key maps to the key of the supplied data to retrieve the value of each field
          Date: {
            // This key name maps to the data
            name: "Date of Birth", // Displayed Name of the field int he dashboard
            position: "left", // Position in the Card View
            dataType: "Date", // This just formats and renders the date in a graphical way
            translation: { "ar-AE": "السن" },
          },
          Status: {
            name: "Marital Status",
            position: "right",
            dataType: "String", // Does nothing at the moment
            // Can use this to modify the data value before displaying it to the dashboard
            onGetValue: function (field) {
              if (
                field.data == "Married" &&
                field.record["Gender"] == "Female"
              ) {
                return (
                '<span style="font-weight: bold;color: #72de72">' +
                field.data +
                "</span>"
                );
              } else {
                return field.data;
              }
            },
            translation: { "ar-AE": "الحالة الزوجية" },
          },
          Name: {
            name: "Name",
            position: "left", // Position in the Card View
            // This controls the visibility of the field.
            // Accepts 3 values: show, hide, disable
            visibility: function (field) {
              // Checks to see if the name of this person contains the phrase (disabled) in the name, then disable this field
              // disable greys out the field and removes all actions on the field (including onClick)
              if (field.data.indexOf("(disabled)") > -1) {
                return "disable";
              } else {
                return "show";
              }
            },
            onClick: function (element, record) {
              console.log("Field Clicked: element, data:", element, record);
            },
            translation: { "ar-AE": "الإسم" },
          },
          Gender: {
            name: "Gender",
            position: "right", // Position in the Card View
            dataType: "String",
            translation: { "ar-AE": "الجنس" },
          },
          Description: {
            position: "left",
            width: "400px",
            style: {
              "grid-column": "span 2",
            },
            class: "justify",
            onGetValue: function (item) {
              // If there is no value
              if (!item.data) {
                return '<span style="color: #c3c3c3">N/A</span>';
              }
            },
            translation: { "ar-AE": "الوصف" },
          },
        },
      }
    }
  }
}

```
