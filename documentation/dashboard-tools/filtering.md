# Filtering

Filtering is enabled by default. The keyword box above the records narrows the current recordset as you type.

## Filtering from code

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;

dm.filter({ keywords: ['Married'] });   // replace the active keywords
dm.addKeyword('Female');                // add one more
dm.reset();                             // clear filtering, search and sorting
```

`filtering` is `{ keywords: [...] }`. Every keyword must match for a row to survive.

## Search vs filter

Two mechanisms, deliberately separate:

| | Filtering | Search |
| --- | --- | --- |
| Driven by | The keyword box | `doSearch()` |
| Shape | `{ keywords: [] }` | `{ parameters: [], options: {} }` |
| For | Quick narrowing across all fields | Structured, per-field queries |

```javascript
dm.doSearch({
  parameters: [{ field: 'Status', value: 'Married' }],
  options: { wholeWordSearch: true, enableSpecialCharacters: false }
});
```

| Option | Default | What it does |
| --- | --- | --- |
| `wholeWordSearch` | `false` | Match whole words only. |
| `enableSpecialCharacters` | `false` | Treat special characters literally rather than stripping them. |

## The pipeline

Both feed the same chain, in this order:

```
raw  →  searched  →  filtered  →  sorted  →  paged
```

Each stage is available on `dm.data`, which is useful when debugging why a row disappeared:

```javascript
console.log(dm.data.raw.length, dm.data.filtered.length, dm.data.paged.length);
```

## Filtering on the server

When a tab fetches its data, filtering happens server-side. The active keywords are sent JSON-encoded with every request:

```
filterBy=["Married","Female"]
```

Rename that parameter with `fetch.dashboardParameters`. See [Fetch API](../configuration-options/data/fetch-api.md).
