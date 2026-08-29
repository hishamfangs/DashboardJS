# Pagination

Pagination is enabled by default and shows 12 records per page.

## Config

```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    tabs: {
      'User Profiles': {
        itemsPerPage: 12,   // defaults to 12
        page: 1             // the page to open on, 1-based
      }
    }
  }
});
```

<details>

<summary><code>itemsPerPage</code> <mark style="color:blue;">number</mark></summary>

Records per page. Defaults to `12`. Set per tab.

</details>

<details>

<summary><code>page</code> <mark style="color:blue;">number</mark></summary>

The page to start on. 1-based. Defaults to `1`.

</details>

## Paging from code

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;

dm.goToPage(3);
console.log(dm.page, 'of', dm.pages, '—', dm.count, 'records');
```

| Property | What it is |
| --- | --- |
| `page` | Current page, 1-based. |
| `pages` | Total pages, derived from `count` and `itemsPerPage`. |
| `count` | Total records. From the server when fetching. |

## Paging on the server

When a tab fetches, only one page is ever in memory. `page` and `itemsPerPage` are sent with every request and the server returns that slice plus a total:

```json
{ "data": [ /* one page of rows */ ], "count": 240 }
```

`count` is what drives the pager — without it DashboardJS cannot know how many pages exist. See [Fetch API](../configuration-options/data/fetch-api.md).

### Updating the total without reloading

`setCount()` updates the total and the pager while leaving the rows on screen alone:

```javascript
dm.setCount(240);
```

This is what a count-only load uses. Passing such a response through `setData()` would blank a populated tab, because a count-only response carries an empty list.

## Rapid clicks

Only one page change runs at a time. A click arriving mid-flight is queued and runs when the active one finishes, and further clicks replace that queued one rather than stacking — so a burst of clicks settles on the last page you asked for instead of racing.
