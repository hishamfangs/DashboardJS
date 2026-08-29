---
description: What changed in the callback contract, and what you need to do
---

# Migrating to 1.2

**Existing dashboards keep working.** Every renamed hook still accepts its old name, and handlers written in the older positional or `this`-based styles still run. Each deprecated key logs one warning naming its replacement, so the console tells you what to change.

Two behaviours did change, and both are covered below.

## Renamed hooks

| Old | New |
| --- | --- |
| `onGetValue` | `value` |
| `onLoop` | `onRender` |
| `onAdd` | `onMount` |
| `onRemove` | `onBeforeRemove` |

```javascript
// Before
Status: { onGetValue: function (field) { return field.data.toUpperCase(); } }

// After
Status: { value: ({ value }) => value.toUpperCase() }
```

## One context object

Every callback now receives a single context object. See [Callbacks](configuration-options/callbacks.md).

```javascript
Status: {
  value:      ({ value, record }) => record.Gender === 'Female' ? value.toUpperCase() : value,
  visibility: ({ record })        => record.Status ? 'show' : 'hide',
  onClick:    ({ record, event }) => { event.stopPropagation(); open(record.Id); }
}
```

| Key | What it is |
| --- | --- |
| `value` | The field's own value. Fields only. |
| `record` | The whole row. The same on every component. |
| `component` | The Field, Action or Record itself. |
| `el` | The rendered DOM node. |
| `dashboard` | The Dashboard instance. |
| `event` | The DOM event. `onClick` only. |

## Breaking: a field's onClick

A field's second argument used to be the field's **value**, despite being named `record` in the old examples. It is now the row, on every component.

```javascript
// Before - `record` was actually the string "Jessie Bambergans"
onClick: function (field, record) { console.log(record); }

// After
onClick: ({ value, record }) => console.log(value, record)
```

If you relied on that argument being the value, read `value` from the context.

## Breaking: onRemove

`onRemove` received a `DashboardEvent` and you completed it to allow the removal. `onBeforeRemove` uses the return value instead.

```javascript
// Before
onRemove: function (event) {
  if (confirm('Remove?')) event.triggerCompleted();
}

// After
onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
```

Return `false` to cancel, a promise to defer, anything else to proceed:

```javascript
onBeforeRemove: async ({ record }) => {
  const response = await fetch('/api/people/' + record.Id, { method: 'DELETE' });
  return response.ok;
}
```

Configs still using `onRemove` keep the old event behaviour, so nothing breaks until you rename it.

## Fixed behaviours you may have worked around

<details>

<summary><code>value</code> is no longer ignored on Date fields</summary>

The date template used to be built after the callback ran and overwrote whatever it returned, so `onGetValue` silently did nothing on a `dataType: 'Date'` field. Your hook now wins; the date template is the default when it returns `undefined`.

If you avoided `dataType: 'Date'` because of this, you can use both together now.

</details>

<details>

<summary>A falsy return is honoured</summary>

The old assignment was guarded by `if (processedValue)`, so returning `''` left the original value on screen and a field could not be blanked. Only `undefined` now means "use the default".

```javascript
value: ({ value }) => value === 'N/A' ? '' : value    // now actually blanks it
```

If you returned `''` expecting nothing to happen, return `undefined` instead.

</details>

<details>

<summary><code>onRender</code> fires once per component</summary>

`onLoop` ran from two call sites per render pass. It now runs once per component.

A record is still built once for Card view and once for List view, so a field's hook fires for each — keep the body idempotent.

</details>

<details>

<summary>Conditional links no longer leave a broken href</summary>

A function-valued `url` was passed to the link builder before being resolved, so the function object was briefly written into the `href`, and a falsy result left `href="null"` behind. A falsy return now renders no anchor at all.

</details>

<details>

<summary><code>record</code> and <code>dashboard</code> are set everywhere</summary>

`record` was missing on records themselves, and `dashboard` was `null` on every child component. Both are now available on every component and in every context object.

</details>

## New in 1.2

* **`icon`, `class`, `style` and `width` may be functions**, joining `value`, `url` and `visibility`.
* **`onMount`** fires as a component is added to its parent.
* **A callback that throws is contained** — the default is used and the error is logged, instead of the render failing.

## Suggested order

1. Upgrade and load your dashboard. Every deprecated key you use logs a warning naming its replacement.
2. Rename them.
3. Check any field `onClick` that used the second argument.
4. Convert `onRemove` to `onBeforeRemove` and return a boolean instead of completing an event.
5. Move the rest to the destructured form as you touch them — the old styles keep working.
