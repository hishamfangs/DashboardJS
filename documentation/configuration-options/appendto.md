# appendTo

Where the dashboard mounts in your page.

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: data,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '.dashboard-container'
});
```

<details>

<summary><code>appendTo</code> <mark style="color:blue;">string | Element</mark></summary>

A CSS selector or a DOM element. The dashboard is appended inside it.

</details>

Both forms work:

```javascript
appendTo: '.dashboard-container'
appendTo: document.querySelector('#reports')
```

## What it changes

Passing `appendTo` switches the dashboard from modifying markup already on the page to **appending a fresh copy** into your container. That is `useExistingElement: false`, and `appendTo` sets it for you.

| | Without `appendTo` | With `appendTo` |
| --- | --- | --- |
| Markup | Already in the page | Cloned from the template |
| Container | The existing `.dashboard-component` | Whatever you name |
| Pairs with | Inline markup | [`templateURL`](templateurl.md) |

## More than one dashboard

Because each mount gets its own copy, two dashboards can live on one page:

```javascript
var people = new FutureLabs.Dashboard({
  data: peopleData,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '#people'
});

var invoices = new FutureLabs.Dashboard({
  data: invoiceData,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '#invoices'
});
```

## The container must exist first

`appendTo` runs when the dashboard is constructed, so the element has to be in the document by then — put the script after the container, or wait for `DOMContentLoaded`.

```html
<div class="dashboard-container"></div>
<script src="dashboardjs/js/load-dashboard.js"></script>
```
