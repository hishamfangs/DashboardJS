# Data

DashboardJS takes its records either **synchronously** — you hand it everything up front — or **asynchronously**, fetching one page at a time from an API.

## Synchronous

Pass an array and you get a single tab:

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: [
    { Name: 'Jessie Bambergans', Status: 'Married', Date: '1980-08-10', Gender: 'Female' },
    { Name: 'Jerome Berner',     Status: 'Single',  Date: '1980-08-10', Gender: 'Male'   }
  ]
});
```

Pass an object keyed by tab name for several:

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: { tabs: { 'User Profiles': {}, 'Invoices': {} } },
  data: {
    'User Profiles': [ { Name: 'Jessie Bambergans', Status: 'Married' } ],
    'Invoices':      [ { Customer: 'Jessie Bambergans', Balance: 240 } ]
  }
});
```

The keys must match the keys in [`config.tabs`](../tabs.md).

## The shape of a record

A record is a flat object. Its keys are what [`fields`](../fields.md) map onto:

```javascript
{ "Name": "Jessie Bambergans", "Status": "Married", "Date": "1980-08-10" }
```

Nothing is required. With no `fields` config, DashboardJS infers the columns from the first record — so the array above renders on its own.

Values are read straight from the key, so nested data needs flattening first, or a [`value`](../callbacks.md) hook:

```javascript
Country: { value: ({ record }) => record.address && record.address.country }
```

## Images

A record image is a **key in your data** holding the URL, not the URL itself:

```javascript
recordSettings: { image: { url: 'imageURL', height: '200px' } }
```

```javascript
{ "Name": "Jessie Bambergans", "imageURL": "/img/jessie.jpg" }
```

Records with nothing at that key fall back to a placeholder.

## Asynchronous

Give a tab a `fetch` block and it loads a page at a time:

```javascript
tabs: {
  'User Profiles': {
    itemsPerPage: 20,
    fetch: { url: '/api/people' }
  }
}
```

The server receives the page, sort, filter and tab name, and returns that slice plus a total:

```json
{ "data": [ /* one page of rows */ ], "count": 240 }
```

Full details, including renaming parameters and supplying your own loader, on [Fetch API](fetch-api.md).

## Which to choose

| | Synchronous | Asynchronous |
| --- | --- | --- |
| Data | All of it, up front | One page at a time |
| Sorting and filtering | In the browser | On the server |
| `count` | Inferred | You must return it |
| Suits | Hundreds of rows | Thousands, or a live source |

Sorting and filtering move to the server in async mode because only one page is ever in memory — the browser cannot order a set it has not seen.

## Replacing data at runtime

Each tab's [DataManager](../../classes-and-apis/datamanager.js.md) owns its rows:

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;

dm.setData(rows);           // replace the rows
dm.setData(rows, 240);      // ...and set the total, when the server pages for you
dm.refresh();               // re-run the pipeline, re-fetching if async
dm.reset();                 // clear search, filtering and sorting
```

## The pipeline

Whatever the source, rows pass through the same chain, and each stage is inspectable:

```
raw  →  searched  →  filtered  →  sorted  →  paged
```

```javascript
console.log(dm.data.raw.length, dm.data.filtered.length, dm.data.paged.length);
```
