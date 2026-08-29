# Tabs.js

`Tabs` is the strip that holds every [Tab](tab.js.md). One is created for you from `config.tabs`; you rarely construct it yourself.

```javascript
const tabs = dashboard.tabs;
```

Inherits everything on [Component.js](component.js.md).

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `children.tabs` | Tab[] | Every tab, in config order. |
| `dashboard` | Dashboard | The dashboard this strip belongs to. |

## Methods

<details>

<summary><code>getChild(name)</code></summary>

Returns a tab by name. `dashboard.getChild(name)` is the shorter route to the same object.

</details>

<details>

<summary><code>setActive(tab)</code></summary>

Opens one tab and closes the rest. Prefer `tab.setActive(true)`.

</details>

## Which tab opens first

`initialActiveTab` names it. Without it, the first entry in `config.tabs` opens.

```javascript
config: {
  initialActiveTab: 'Invoices',
  tabs: { 'User Profiles': { /* ... */ }, 'Invoices': { /* ... */ } }
}
```

## The overflow menu

When tabs do not fit, the strip collapses into a dropdown. That is handled by the template and CSS — there is nothing to configure.

## Iterating

```javascript
dashboard.tabs.children.tabs.forEach((tab) => {
  console.log(tab.name, tab.dataManager.count);
});
```
