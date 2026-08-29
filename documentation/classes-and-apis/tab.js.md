# Tab.js

One `Tab` per entry in [`config.tabs`](../configuration-options/tabs.md). A tab owns the recordset for its data plus the tools around it — sorting, filtering, paging and the view switcher — and holds the [DataManager](datamanager.js.md) those tools drive.

```javascript
const tab = dashboard.getChild('User Profiles');
```

Inherits everything on [Component.js](component.js.md).

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `dataManager` | DataManager | Rows, paging, sorting, filtering and fetching for this tab. |
| `recordSettings` | object | The record configuration for this tab. |
| `fields` | object | Field configuration, resolved for the active language. |
| `icon` | string | The tab's icon class. |
| `description` | string \| object | Blurb shown above the records. Translatable. |
| `active` | boolean | Whether this is the open tab. |
| `pagination` | Paging | The pager component. |
| `name` | string | The tab's key in `config.tabs`. |
| `translatedName` | string | That name in the active language. |

## Methods

<details>

<summary><code>setActive(active)</code></summary>

Opens this tab and closes the others.

```javascript
dashboard.getChild('Invoices').setActive(true);
```

</details>

<details>

<summary><code>refresh()</code></summary>

Re-renders the recordset from the DataManager, re-fetching first when the tab is asynchronous.

</details>

<details>

<summary><code>refreshCount()</code></summary>

Updates the tab's badge without reloading the rows — a count-only load.

</details>

<details>

<summary><code>setView(viewMode)</code></summary>

Switches this tab between `'Cards'` and `'List'`. See [View Modes](../dashboard-tools/view-modes.md).

</details>

<details>

<summary><code>setSorting(sorting)</code> · <code>setFiltering(filtering)</code> · <code>setPagination()</code></summary>

Push state into the tab's tools and re-render. These are what the sort control, keyword box and pager call.

</details>

<details>

<summary><code>setRecordset(data)</code></summary>

Replaces the rendered records with a new set of rows.

</details>

<details>

<summary><code>getDescription()</code></summary>

Returns the description resolved for the active language.

</details>

<details>

<summary><code>showLoader()</code> · <code>hideLoader()</code></summary>

Shows or hides this tab's spinner. Called around every fetch.

</details>

## Example

```javascript
const tab = dashboard.getChild('Invoices');

tab.setActive(true);
tab.setView('List');
tab.dataManager.sort({ sortBy: 'Balance', sortDirection: 'desc' });
tab.refresh();
```
