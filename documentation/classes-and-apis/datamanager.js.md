# DataManager.js

Every tab owns a `DataManager`. It holds the rows and everything that changes which rows are visible: paging, sorting, filtering, keyword search, and fetching from a server.

```javascript
const dm = dashboard.getChild('User Profiles').dataManager;
```

Unlike the rest of the library it is **not** a Component — it has no DOM of its own.

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `data` | object | The pipeline: `raw`, `searched`, `filtered`, `sorted`, `paged`. |
| `count` | number | Total number of records. From the server when fetching. |
| `page` | number | Current page. 1-based. |
| `pages` | number | Total pages, derived from `count` and `itemsPerPage`. |
| `itemsPerPage` | number | Records per page. Defaults to `12`. |
| `sorting` | object | `{ sortBy, sortDirection, sortFieldText }`. |
| `filtering` | object | `{ keywords: [] }`. |
| `search` | object | `{ parameters: [], options: { enableSpecialCharacters, wholeWordSearch } }`. |
| `fetch` | object | Fetch configuration. See [Fetch API](../configuration-options/data/fetch-api.md). |
| `fetchFunction` | function | Supply your own loader instead of `fetch`. |
| `tabName` | string | Sent with every request so the server knows which tab is asking. |

The pipeline runs in that order — search, then filter, then sort, then page — so `data.paged` is what ends up on screen.

## Reading data

<details>

<summary><code>getData()</code></summary>

Returns the rows for the current page, after search, filtering and sorting.

</details>

<details>

<summary><code>getFieldsFromData()</code></summary>

Infers field keys from the first record. This is how a dashboard with no `fields` config still renders columns.

</details>

## Paging

<details>

<summary><code>goToPage(page)</code></summary>

Moves to a page, fetching it if the tab loads asynchronously. Pages are 1-based.

```javascript
dm.goToPage(3);
```

</details>

## Sorting

<details>

<summary><code>sort(sorting)</code> · <code>setSorting(sorting)</code></summary>

`sort()` applies a sort and re-renders. `setSorting()` records it without re-running the pipeline.

```javascript
dm.sort({ sortBy: 'Age', sortDirection: 'asc' });
```

| Key | What it is |
| --- | --- |
| `sortBy` | The data key to sort on. |
| `sortDirection` | `DataManager.SORTING.ASC` (`'asc'`) or `DataManager.SORTING.DESC` (`'desc'`). |
| `sortFieldText` | The label shown in the sort control. |

</details>

<details>

<summary><code>toggleSorting()</code></summary>

Flips the current direction between ascending and descending.

</details>

## Filtering and search

<details>

<summary><code>filter(filtering)</code> · <code>setFiltering(filtering)</code></summary>

Applies a keyword filter. `filtering` is `{ keywords: [...] }`.

```javascript
dm.filter({ keywords: ['Married'] });
```

</details>

<details>

<summary><code>addKeyword(keyword)</code> · <code>addFilterKeyword(keyword)</code></summary>

Adds a single keyword to the active filter.

</details>

<details>

<summary><code>doSearch(searchParameters)</code> · <code>setSearch(searchParameters)</code></summary>

Runs a structured search. Options are `enableSpecialCharacters` and `wholeWordSearch`.

</details>

## Refreshing

<details>

<summary><code>refresh()</code></summary>

Re-runs the pipeline, re-fetching first if the tab is asynchronous.

</details>

<details>

<summary><code>reset()</code></summary>

Clears search, filtering and sorting and returns to page 1.

</details>

<details>

<summary><code>setData(data, count)</code></summary>

Replaces the rows. Pass `count` when the total differs from the array's length, which it does whenever the server pages for you.

```javascript
dm.setData(rows, 240);
```

</details>

<details>

<summary><code>setCount(count)</code></summary>

Updates the total **without** touching the rows on screen. Used by count-only loads — routing those through `setData()` would blank a populated tab with the empty list such a response carries.

</details>

<details>

<summary><code>load(countOnly)</code></summary>

Performs the fetch. With `countOnly` it asks only for a total.

</details>

## Concurrency

Overlapping refreshes used to interleave and land out of order. Two guards prevent that, and they are worth knowing about if you drive the manager yourself:

* **`runExclusive`** — only one refresh or page change runs at a time. A request arriving mid-flight is queued as `refreshAgain` and runs the moment the active one finishes; further requests replace that queued one rather than stacking up.
* **`runFetchExclusive`** — chains fetches so only one is ever in flight, with `fetchQueue` holding the tail of the chain.

The practical consequence: rapid clicks on pagination or sorting settle on the last request rather than racing.

## Statics

| Static | Value |
| --- | --- |
| `DataManager.SORTING.ASC` | `'asc'` |
| `DataManager.SORTING.DESC` | `'desc'` |
| `DataManager.normaliseResponse(res, countOnly)` | Coerces a response into `{ data, count }`. Accepts a bare array and counts it; reports anything unusable by name instead of failing silently. |
