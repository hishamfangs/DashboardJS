# Tabs

Each key in `tabs` becomes a tab, and the key is the tab's name. A tab holds one recordset plus the tools around it.

```javascript
config: {
  tabs: {
    'User Profiles': { /* ... */ },
    'Invoices':      { /* ... */ }
  }
}
```

Your `data` is keyed by the same names. See [Data](data/README.md).

## Properties

| Property | Type | What it does |
| --- | --- | --- |
| `icon` | string | Class name for the tab icon. FontAwesome classes work, or your own from `theme.css`. |
| `description` | string \| object | Blurb shown above the records. Pass an object keyed by language to translate it. |
| `translation` | object | Language-code map for the tab's own name. |
| `viewMode` | `'Cards'` \| `'List'` | The tab's default view. See [View Modes](../dashboard-tools/view-modes.md). |
| `itemsPerPage` | number | Records per page. Defaults to `12`. See [Pagination](../dashboard-tools/pagination.md). |
| `page` | number | The page to open on. 1-based. |
| `recordsGrid` | object | CSS Grid pairs laying out the records in Card view. |
| `sorting` | object | Default sort. See [Sorting](../dashboard-tools/sorting.md). |
| `fetch` | object | Load this tab's data from a server. See [Fetch API](data/fetch-api.md). |
| `fetchFunction` | function | Supply your own loader instead of `fetch`. |
| `recordSettings` | object | Everything about a record in this tab. See [Record Settings](record-settings.md). |

## Which tab opens first

`initialActiveTab` names it; otherwise the first entry wins.

```javascript
config: {
  initialActiveTab: 'Invoices',
  tabs: { 'User Profiles': { /* ... */ }, 'Invoices': { /* ... */ } }
}
```

## Card layout

`recordsGrid` takes raw CSS Grid property/value pairs, so the arrangement is entirely yours:

```javascript
recordsGrid: {
  'grid-template-columns': '1fr 1fr 1fr',
  'gap': '20px',
  'justify-items': 'stretch'
}
```

That lays out the records. Field layout *inside* a record is `fieldsGrid` on [Record Settings](record-settings.md).

## Translating a tab

`translation` covers the tab name; `description` takes a language map of its own.

```javascript
'User Profiles': {
  translation: { 'ar-AE': 'ملفات تعريف المستخدم' },
  description: {
    'en-US': 'A list of all approved users',
    'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
  }
}
```

See [Internationalization & Localization](internationalization-and-localization.md).

## A tab per source

Tabs are independent — one can hold data you passed in, another can fetch from an API:

```javascript
tabs: {
  'User Profiles': {
    viewMode: 'Cards',
    recordSettings: { fields: { Name: { name: 'Name' } } }
  },
  'Invoices': {
    viewMode: 'List',
    itemsPerPage: 20,
    fetch: { url: '/api/invoices' },
    sorting: { sortBy: 'Date', sortDirection: 'desc' },
    recordSettings: { fields: { Balance: { name: 'Balance', position: 'right' } } }
  }
}
```

## Reaching a tab at runtime

```javascript
const tab = dashboard.getChild('Invoices');
tab.setActive(true);
tab.setView('Cards');
tab.refresh();
```

See [Tab.js](../classes-and-apis/tab.js.md).
