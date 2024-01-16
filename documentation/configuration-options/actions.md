# Actions



#### Full Config Object Example

```javascript
config: {
  tabs: {
    "User Profiles": {
      recordSettings: {
        actionsType: "menu",
        actions: {
          "More details...": {
            icon: "info-icon",
            translation: {
              "ar-AE": "معلومات أخرى",
            },
            onClick: function (action) {
              alert(
                "Clicked More Info ... on record " +
                JSON.stringify(action.record)
              );
            },
          },
          Pay: {
            icon: "pay-icon",
            translation: {
              "ar-AE": "دفع",
            },
            visibility: function (actionObj) {
              // returns a string representing the visibility
              return "disable";
            },
            onClick: function () {
              alert("Clicked Pay!");
            },
          },
          Edit: {
            icon: "edit-icon",
            translation: {
              "ar-AE": "تعديل",
            },
            onClick: function () {
              alert("Clicked Edit");
            },
          },
          Cancel: {
            icon: "cancel-icon",
            translation: {
              "ar-AE": "إلغاء",
            },
            onClick: function () {
              alert("Clicked Cancel");
            },
          },
        },
      }
    }
  }
}
```
