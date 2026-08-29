# Component.js

`Component` is the base class every other class inherits from — `Dashboard`, `Tab`, `Recordset`, `Record`, `Field`, `Action` and the tools. Anything documented here is available on all of them.

You get a component in three ways: from a [callback](../configuration-options/callbacks.md) context, from `dashboard.getChild(...)`, or as the value returned by `new FutureLabs.Dashboard(...)`.

## Properties

| Property | Type | What it is |
| --- | --- | --- |
| `data` | any | The component's own data. On a Field this is the field's value; on an Action or Record it is the row. Prefer `value` and `record`. |
| `value` | any | The field's value. Fields only. |
| `record` | object | The whole row, as a plain data object. Set on every component. |
| `el` | Element | The rendered DOM node. Alias of `object`. |
| `component` | Component | The component itself. Present so `({ component })` reads naturally in callbacks. |
| `dashboard` | Dashboard | The Dashboard this component belongs to. |
| `children` | object | Child components, keyed by container name. |
| `name` | string | The component's configured name. |
| `translatedName` | string | `name` resolved for the active language. |
| `language` | string | The active language code, e.g. `'en-US'`. |
| `id` | string | Readable id, generated from the name unless you set one. |
| `uid` | string | Unique id — `id` plus a random suffix. |
| `config` | object | A clone of the config this component was built from. |
| `visibility` | string | Resolved visibility: `'show'`, `'enable'`, `'disable'` or `'hide'`. |
| `template` | Template | The template backing this component. |
| `objects` | object | Named DOM nodes inside the template (`item`, `itemText`, `itemIcon`, `itemLink`, `container`…). |

## Content

<details>

<summary><code>setText(value, selectorKey)</code></summary>

Sets the text of the component, or of a named node inside it. HTML is accepted.

```javascript
field.setText('Overdue');
field.setText('Balance', 'itemTitle');   // the field's label
```

</details>

<details>

<summary><code>setIcon(value, selectorKey)</code> · <code>removeIcon(selectorKey)</code></summary>

Applies or clears an icon class on the component's icon node.

```javascript
action.setIcon('fas fa-check');
action.removeIcon();
```

</details>

<details>

<summary><code>setImage(value, selectorKey)</code> · <code>setBackgroundImage(value, selectorKey, height)</code></summary>

`setImage` points an `<img>` at a URL. `setBackgroundImage` sets a CSS background and accepts a height, which is how a record's `image` config is applied.

```javascript
record.setBackgroundImage('/img/avatar.jpg', null, { height: '200px' });
```

</details>

<details>

<summary><code>setLink(value, selectorKey, target)</code></summary>

Wraps the component in an anchor pointing at `value`. Creating the anchor may replace the component's own node, which the component tracks for you.

Prefer the [`url`](../configuration-options/fields.md#linking) config property — it handles conditional links and cleanup.

</details>

## Classes

<details>

<summary><code>addClass(value, selectorKey)</code> · <code>removeClass(value, selectorKey)</code></summary>

```javascript
Status: {
  onRender: ({ component, record }) => {
    if (record.Balance > 0) component.addClass('is-overdue');
  }
}
```

Pass a `selectorKey` to target a named node rather than the component root.

</details>

## Tree

<details>

<summary><code>getChild(name, containerKey)</code></summary>

Finds a direct child by its `name`. Pass `containerKey` to search a single container.

```javascript
const tab = dashboard.getChild('User Profiles');
const recordset = tab.getChild('Recordset');
```

</details>

<details>

<summary><code>getChildById(id)</code></summary>

Finds a descendant by `id` or `uid`, searching every container.

</details>

<details>

<summary><code>append(child, containerSelector)</code> · <code>prepend(child, containerSelector)</code></summary>

Adds a child component into a named container. This is what fires the child's [`onMount`](../configuration-options/callbacks.md).

</details>

<details>

<summary><code>appendTo(parent)</code></summary>

Appends this component into another component or DOM node.

</details>

## Removal

<details>

<summary><code>remove()</code></summary>

Removes the component, **after** consulting [`onBeforeRemove`](../configuration-options/callbacks.md). If that hook returns `false` nothing happens; if it returns a promise, removal waits for it.

```javascript
const action = record.getChild('Delete');
action.remove();       // may prompt, may be cancelled
```

</details>

<details>

<summary><code>removeChildren(selectorKey)</code></summary>

Removes every child, or only those in one container. Also guarded by `onBeforeRemove`.

</details>

<details>

<summary><code>delete()</code></summary>

Removes the component immediately, with no guard. `remove()` calls this once the guard allows it.

</details>

## Loading and animation

<details>

<summary><code>showLoader()</code> · <code>hideLoader()</code></summary>

Shows or hides the component's loading spinner. Tabs use these around a fetch.

</details>

<details>

<summary><code>fadeOut()</code> · <code>fadeInLeft()</code> · <code>fadeLeft()</code> · <code>fadeRight()</code></summary>

Applies the built-in transition classes, used when moving between pages and tabs.

</details>

## Callback plumbing

These back the [callback contract](../configuration-options/callbacks.md). You rarely call them directly, but they are what makes any config value able to be a function.

<details>

<summary><code>resolve(name, fallback)</code></summary>

Resolves a noun property. If it was configured as a function, calls it with the context object and returns the result; `undefined` returns `fallback`. If it was a static value, returns that. A callback that throws is contained and `fallback` is used.

```javascript
const icon = field.resolve('icon', null);
```

</details>

<details>

<summary><code>trigger(name, extra)</code></summary>

Invokes a verb hook with the same context convention, returning whatever the hook returned.

```javascript
const outcome = component.trigger('onBeforeRemove');
```

</details>

## Statics

| Static | What it does |
| --- | --- |
| `Component.COMPUTED_PROPS` | The noun properties that may be functions: `value`, `icon`, `url`, `visibility`, `class`, `style`, `width`. |
| `Component.RENAMED_PROPS` | Deprecated config keys mapped to their replacements. |
| `Component.NON_CASCADING_PROPS` | Hooks stripped from derived components such as field headers and sorting items. |
| `Component.stripHooks(config)` | Removes those hooks from a config object. |
| `Component.normalizeContract(config, where)` | Rewrites deprecated keys onto their replacements and warns once per key. |
| `Component.generateRandomId(name)` | Builds a `uid` from a readable id. |
