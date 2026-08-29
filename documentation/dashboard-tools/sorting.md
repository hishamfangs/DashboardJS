# Sorting

Sorting is enabled by default. The control lists every field and sorts the current recordset when one is picked.

## Sorting from code

Each tab's [DataManager](../classes-and-apis/datamanager.js.md) owns the sort state.

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;

dm.sort({ sortBy: 'Name', sortDirection: 'asc' });
dm.toggleSorting();          // flip the current direction
```

| Key | Type | What it is |
| --- | --- | --- |
| `sortBy` | string | The data key to sort on. |
| `sortDirection` | string | `'asc'` or `'desc'`. Also `DataManager.SORTING.ASC` / `.DESC`. |
| `sortFieldText` | string | The label shown in the sort control. |

## A default sort

Sorting config is read by the DataManager when the tab is built:

```javascript
tabs: {
  'Invoices': {
    sorting: { sortBy: 'Date', sortDirection: 'desc' },
    recordSettings: { /* ... */ }
  }
}
```

## Sorting on the server

When a tab fetches its data, sorting is not applied in the browser — the current sort is sent with every request and the server is expected to return rows already ordered.

It arrives JSON-encoded under the `sortBy` parameter:

```
sortBy={"sortBy":"Date","sortDirection":"desc","sortFieldText":"Issued"}
```

Rename that parameter with `fetch.dashboardParameters`. See [Fetch API](../configuration-options/data/fetch-api.md).

## What the control shows

Sorting items are built from the same field configuration as the columns, but the per-field hooks are stripped first — a sort entry renders a label, not a row's data. `visibility`, `onClick`, `icon`, `url`, `value`, `onRender`, `onMount` and `onBeforeRemove` never cascade into it.

To change how a field appears in the sort list, set its [`name`](../configuration-options/fields.md) or `translation`.
