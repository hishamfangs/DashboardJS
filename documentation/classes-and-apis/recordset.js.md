# Recordset.js

`Recordset` renders the rows inside a tab — as a grid of cards or as a list. It builds one [Record](../configuration-options/record-settings.md) per row from the tab's `recordSettings`.

Inherits everything on [Component.js](component.js.md).

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `children.records` | Record[] | The rendered records, in display order. |
| `recordSettings` | object | The record configuration for this tab. |
| `recordsGrid` | object | CSS Grid pairs laying out the records in Card view. |
| `dataManager` | DataManager | The tab's data manager. |
| `data` | array | The rows currently rendered — one page's worth. |

## Methods

<details>

<summary><code>switchView(viewMode)</code></summary>

Switches this recordset between `'Cards'` and `'List'`.

</details>

<details>

<summary><code>refresh()</code></summary>

Rebuilds every record from the current page of data.

</details>

<details>

<summary><code>removeChildren()</code></summary>

Removes every record. Guarded by `onBeforeRemove` if one is configured.

</details>

<details>

<summary><code>setActionsListViewWidth()</code></summary>

Sizes the actions column in List view so buttons line up across rows.

</details>

## Reaching a record

```javascript
const recordset = dashboard.getChild('User Profiles').getChild('Recordset');

recordset.children.records.forEach((record) => {
  if (record.record.Balance > 0) record.addClass('is-overdue');
});
```

Inside a callback the same thing is one line, because the context already holds the row and the node:

```javascript
recordSettings: {
  onRender: ({ record, el }) => el.classList.toggle('is-overdue', record.Balance > 0)
}
```

## Layout

`recordsGrid` takes raw CSS Grid property/value pairs and applies them to the records container in Card view:

```javascript
recordsGrid: {
  'grid-template-columns': '1fr 1fr 1fr',
  'gap': '20px',
  'justify-items': 'stretch'
}
```

Field layout *within* a record is `fieldsGrid`, on [Record Settings](../configuration-options/record-settings.md).
