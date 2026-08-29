# Dashboard.js

`Dashboard` is the entry point and the root of the component tree. It inherits everything on [Component.js](component.js.md).

```javascript
var dashboard = new FutureLabs.Dashboard({
  language: 'en-US',
  config: { /* ... */ },
  data: { /* ... */ },
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '.dashboard-container'
});
```

## Constructor settings

| Setting | Type | What it does |
| --- | --- | --- |
| `config` | object | The dashboard definition. Optional — omit it and one tab named `All Records` is created. See [Config](../configuration-options/config/README.md). |
| `data` | array \| object | The records. An array for a single tab, or an object keyed by tab name. See [Data](../configuration-options/data/README.md). |
| `language` | string | Active language code. Defaults to `'en-US'`. |
| `templateURL` | string | Loads the HTML template from a URL instead of using the markup already on the page. See [templateURL](../configuration-options/templateurl.md). |
| `appendTo` | string \| Element | Where to mount. See [appendTo](../configuration-options/appendto.md). |
| `useExistingElement` | boolean | Defaults to `true` on the Dashboard — it modifies the template already in the document rather than cloning it. Passing `appendTo` overrides this to `false`. |
| `templateManager` | TemplateManager | Supply your own template manager. One is created if omitted. |
| `selectors` | object | Override the default template selectors. |

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `tabs` | Tabs | The tab strip. See [Tabs.js](tabs.js.md). |
| `children` | object | Child components by container. |
| `language` | string | Active language code. |
| `config` | object | A clone of the config passed in. |
| `loadingTemplate` | Promise | Resolves once the template has loaded. `await` it when using `templateURL`. |

## Methods

<details>

<summary><code>switchView(viewMode)</code></summary>

Switches every recordset between Card and List view. Anything other than `'cards'` (case-insensitive) is treated as list.

```javascript
dashboard.switchView('List');
dashboard.switchView('Cards');
```

Per-tab defaults are set with the tab's [`viewMode`](../dashboard-tools/view-modes.md).

</details>

<details>

<summary><code>getChild(name)</code></summary>

Returns a tab by name.

```javascript
const invoices = dashboard.getChild('Invoices');
```

</details>

<details>

<summary><code>loadDashboard()</code></summary>

Builds the tab strip and recordsets from `config.tabs`. Called for you by the constructor.

</details>

<details>

<summary><code>loadHTML(templateURL, appendTo)</code></summary>

Fetches an HTML template and mounts it. Called for you when `templateURL` is set.

</details>

## Waiting for the dashboard

The constructor returns immediately; rendering is asynchronous. When you pass `templateURL`, await `loadingTemplate` before touching the tree.

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: data,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '.dashboard-container'
});

await dashboard.loadingTemplate;
dashboard.switchView('List');
```

## Reaching a tab's data

Each tab owns a [DataManager](datamanager.js.md), which is where paging, sorting, filtering and fetching live.

```javascript
const tab = dashboard.getChild('User Profiles');
tab.dataManager.goToPage(2);
tab.dataManager.sort({ sortBy: 'Name', sortDirection: 'asc' });
tab.dataManager.refresh();
```
