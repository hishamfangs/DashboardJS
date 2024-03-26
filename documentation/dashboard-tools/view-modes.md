# View Modes

The viewMode property decides the default view mode for each Tab. The view can be changed by the user from the view mode button in the dashboard.

## Config Property

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    tabs: {
      "User Profiles": {
        // Sets the default view mode for this tab: Cards view or List view
        viewMode: "Cards", // 'Cards' or 'List'
      }
    }
  }
```

<details>

<summary>viewMode <mark style="color:blue;">property&#x3C;String></mark></summary>

* Cards
* List

</details>
