# Fetch API

Point a tab at a URL and DashboardJS loads one page at a time, sending the current page, sort, filter and tab name with every request.

```javascript
tabs: {
  'User Profiles': {
    itemsPerPage: 20,
    fetch: {
      url: '/api/people',
      options: { method: 'GET' }
    }
  }
}
```

## Config

| Property | Type | What it does |
| --- | --- | --- |
| `url` | string | The endpoint. |
| `options` | object | Passed straight to `fetch()` — `method`, `headers`, `credentials`, and so on. Defaults to `{ method: 'GET' }`. |
| `dashboardParameters` | object | Renames the parameters DashboardJS sends. |

## What gets sent

Every request carries six parameters:

| Parameter | Value |
| --- | --- |
| `page` | Current page, 1-based. |
| `itemsPerPage` | Records per page. |
| `getCount` | `true` when asking only for a total, otherwise `false`. |
| `filterBy` | The active keywords, JSON-encoded: `["Married","Female"]`. |
| `sortBy` | The sort state, JSON-encoded: `{"sortBy":"Date","sortDirection":"desc","sortFieldText":"Issued"}`. |
| `tabName` | Which tab is asking. |

On `GET` they are appended as a query string. On `POST` they are sent as the body, as `URLSearchParams`.

```
GET /api/people?page=2&itemsPerPage=20&getCount=false&filterBy=%5B%5D&sortBy=%7B%7D&tabName=User+Profiles
```

### Renaming them

If your API expects different names, map them:

```javascript
fetch: {
  url: '/api/people',
  dashboardParameters: {
    page: 'pageNumber',
    itemsPerPage: 'limit',
    sortBy: 'order',
    filterBy: 'q'
  }
}
```

Only the keys you list are renamed; the rest keep their defaults.

## What to return

```json
{
  "data": [
    { "Name": "Jessie Bambergans", "Status": "Married" },
    { "Name": "Jerome Berner", "Status": "Single" }
  ],
  "count": 240
}
```

| Key | Required | What it is |
| --- | --- | --- |
| `data` | yes | One page of rows. |
| `count` | yes for paging | The **total** across all pages, not the length of `data`. Without it the pager cannot know how many pages exist. |

{% hint style="info" %}
A bare array is also accepted and counted as the total — fine for a single-page endpoint, but it cannot support paging, because every response would claim the total equals the page size.
{% endhint %}

A response that is neither of those is reported by name rather than failing silently. That failure used to be badly disguised: reading `.data` off `undefined` threw, the throw was swallowed, and the tab rendered empty with a count of 0 — indistinguishable from a query that legitimately matched nothing.

## Sorting and filtering move to the server

When a tab fetches, only one page is ever in memory, so the browser cannot sort or filter the full set. Both are sent with the request and the server is expected to honour them. See [Sorting](../../dashboard-tools/sorting.md) and [Filtering](../../dashboard-tools/filtering.md).

## Headers and authentication

`options` is passed to `fetch()` untouched:

```javascript
fetch: {
  url: '/api/people',
  options: {
    method: 'POST',
    credentials: 'include',
    headers: { 'Authorization': 'Bearer ' + token }
  }
}
```

## fetchFunction

When the request does not fit a plain `fetch` — a GraphQL client, an SDK, a signed request — supply a function instead. It receives the same parameters and returns the same shape.

```javascript
tabs: {
  'User Profiles': {
    fetchFunction: async (params) => {
      const result = await api.people.list({
        page: params.page,
        perPage: params.itemsPerPage,
        sort: JSON.parse(params.sortBy || '{}')
      });
      return { data: result.rows, count: result.total };
    }
  }
}
```

`fetchFunction` takes precedence over `fetch.url`.

## One request at a time

Fetches are chained so only one is ever in flight, and a refresh arriving mid-flight is queued rather than racing the active one. Typing quickly in the keyword box or clicking through pages settles on the last request instead of whichever response happens to land last.

## Driving it yourself

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;

dm.refresh();          // re-fetch the current page
dm.goToPage(2);        // fetch page 2
dm.load(true);         // count only — updates the badge, leaves rows alone
```

See [DataManager.js](../../classes-and-apis/datamanager.js.md).
