# View Modes

Every recordset renders as **Cards** or as a **List**. Each tab sets its own default, and the user can switch at any time from the view button in the toolbar.

## Config

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    tabs: {
      'User Profiles': {
        viewMode: 'Cards'      // 'Cards' or 'List'
      }
    }
  }
});
```

<details>

<summary><code>viewMode</code> <mark style="color:blue;">string</mark></summary>

* `'Cards'` — a grid of cards, laid out by `recordsGrid`. The default.
* `'List'` — one row per record, with a header row of column names.

Anything other than `'Cards'` (case-insensitive) is treated as List.

</details>

## What differs between them

| | Cards | List |
| --- | --- | --- |
| Layout | `recordsGrid` grid of cards | One row per record |
| Column headers | None | A header row, from the field names |
| Field width | `fieldsGrid` within the card | The field's `width` |
| Record image | Shown, at `image.height` | Hidden |
| Field alignment | `position` | `position` |

Two properties only take effect in one mode: `width` sizes a column in List view, and `image.height` sizes the picture in Card view.

```javascript
fields: {
  Date: {
    name: 'Date of Birth',
    width: '100px',        // List view column width
    position: 'left'       // alignment in both
  }
}
```

## Switching from code

Whole dashboard:

```javascript
dashboard.switchView('List');
dashboard.switchView('Cards');
```

A single tab:

```javascript
dashboard.getChild('Invoices').setView('List');
```

The mode is applied as a `.cards` or `.list` class on the dashboard root, which is what the stylesheet keys off:

```css
.dashboard-component.list .record-component { display: flex; }
```

## Column headers

List view adds a header row built from the same field configuration as the columns — but the per-field hooks are stripped first, because a header renders a label rather than a row's data. `visibility`, `onClick`, `icon`, `url`, `value`, `onRender`, `onMount` and `onBeforeRemove` never cascade into it.

To change a header, set the field's [`name`](../configuration-options/fields.md) or `translation`.

## Choosing a default

Cards suit records with an image or a handful of prominent values. List suits dense, comparable rows — invoices, transactions, logs — where scanning down a column matters more than the individual record.

```javascript
tabs: {
  'User Profiles': { viewMode: 'Cards', recordSettings: { image: { url: 'imageURL', height: '200px' } } },
  'Invoices':      { viewMode: 'List' }
}
```
