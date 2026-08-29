# templateURL

By default DashboardJS uses the markup already on the page. `templateURL` loads that markup from a separate file instead, which keeps your HTML page down to a single container element.

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: data,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '.dashboard-container'
});
```

<details>

<summary><code>templateURL</code> <mark style="color:blue;">string</mark></summary>

URL path to the dashboard HTML template. Relative paths resolve against the page, not the script.

</details>

## The page

Everything the dashboard needs is fetched, so the host page stays minimal:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="dashboardjs/css/rules.css">
    <link rel="stylesheet" href="dashboardjs/css/theme.css">
    <script src="dashboardjs/js/dashboard-all.js"></script>
  </head>
  <body>
    <div class="dashboard-container"></div>
    <script src="dashboardjs/js/load-dashboard.js"></script>
  </body>
</html>
```

{% hint style="warning" %}
Fetching a template means the page must be served over `http://` or `https://`. Opening it as a `file://` URL is blocked by the browser's origin rules. Use the [Uses Current HTML file](https://github.com/hishamfangs/DashboardJS/tree/main/dist) example if you need it to work from the filesystem.
{% endhint %}

## Waiting for it

Loading is asynchronous. `loadingTemplate` resolves once the template is in place:

```javascript
var dashboard = new FutureLabs.Dashboard({
  data: data,
  templateURL: 'dashboardjs/dashboard.html',
  appendTo: '.dashboard-container'
});

await dashboard.loadingTemplate;
dashboard.switchView('List');
```

## Customising the template

`dashboard.html` is ordinary markup. Copy it, rearrange it, and point `templateURL` at your copy — the classes are what the library binds to, so keep those and change everything else freely. See [Theming](../theming.md).

## Without templateURL

Omit it and DashboardJS uses the markup already in the document, modifying it in place rather than cloning. That is the default, and it works from `file://`.
