---
description: How every function in the config object is called
---

# Callbacks

Every key in the config object is either a **noun** or a **verb**.

* **Nouns** — `value`, `icon`, `url`, `visibility`, `class`, `style`, `width` — describe what something *is*. Each may be a plain value **or** a function that returns one.
* **Verbs** — `onClick`, `onRender`, `onMount`, `onBeforeRemove` — are things that *happen*.

Both are called the same way, so there is only one convention to learn.

## One context object

Every callback receives a single context object. Destructure the keys you need:

```javascript
Status: {
  value:      ({ value, record }) => record.Gender === 'Female' ? value.toUpperCase() : value,
  visibility: ({ record })        => record.Status ? 'show' : 'hide',
  onClick:    ({ value, record }) => console.log(value, record)
}
```

| Key | What it is |
| --- | --- |
| `value` | The field's own value. Fields only. |
| `record` | The whole row, as a plain data object. The same on every component. |
| `component` | The Field, Action or Record itself. |
| `el` | The rendered DOM node. |
| `dashboard` | The Dashboard instance. |
| `event` | The DOM event. `onClick` only. |

`value` and `record` are deliberately separate names. `data` used to mean the field's value on a Field but the whole row on an Action, and that one overload caused most of the confusion this contract replaces.

## What each one returns

| Hook | Returns |
| --- | --- |
| `value` | The value to display. `undefined` means "no opinion" and the default is used. Anything else is used verbatim — **including `''`**, which blanks the field. |
| `icon` | A CSS or FontAwesome class name. |
| `url` | The href. A falsy return renders no `<a>` at all. |
| `visibility` | `'show'`, `'enable'`, `'disable'` or `'hide'`. `false` and `0` also mean hide. |
| `onClick` | Ignored. |
| `onRender` | Ignored. Fires once per component as it renders. |
| `onMount` | Ignored. Fires as the component is added to its parent. |
| `onBeforeRemove` | `false` cancels the removal, a promise defers it, anything else lets it proceed. |

## Examples

**Highlight a value based on another column**

```javascript
Status: {
  value: ({ value, record }) =>
    record.Gender === 'Female' && value === 'Married'
      ? '<b style="color:#72de72">' + value + '</b>'
      : value
}
```

**Blank a field** — returning `''` works; returning `undefined` would fall through to the raw value.

```javascript
Notes: { value: ({ value }) => value === 'N/A' ? '' : value }
```

**Format a number**

```javascript
Balance: { value: ({ value }) => value ? '$' + Number(value).toFixed(2) : '—' }
```

**Pick an icon per row**

```javascript
Gender: { icon: ({ value }) => value === 'Female' ? 'fas fa-venus' : 'fas fa-mars' }
```

**Make a link conditional** — a falsy return means no anchor is rendered at all.

```javascript
Name: {
  url: ({ record }) => record.ProfileId ? '/profile/' + record.ProfileId : null,
  urlTarget: '_blank'
}
```

**Grey out an action instead of hiding it**

```javascript
Pay: { visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable' }
```

**Disable a field on its own value**

```javascript
Name: { visibility: ({ value }) => value.includes('(disabled)') ? 'disable' : 'show' }
```

**Stop a field click from also triggering the record click**

```javascript
Name: { onClick: ({ event }) => event.stopPropagation() }
```

**Confirm before removing** — nothing is removed unless this resolves to something other than `false`.

```javascript
Delete: { onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?') }
```

**Defer removal on a server call**

```javascript
Delete: {
  onBeforeRemove: async ({ record }) => {
    const response = await fetch('/api/people/' + record.Id, { method: 'DELETE' });
    return response.ok;                 // false leaves the row on screen
  }
}
```

**Tag a node as it renders** — `onRender` may run more than once for the same row, because a record is built for both Card and List view. Keep it idempotent.

```javascript
Status: {
  onRender: ({ record, el }) => el.classList.toggle('is-overdue', record.Balance > 0)
}
```

**Reach the dashboard from a handler**

```javascript
Refresh: { onClick: ({ dashboard }) => dashboard.refresh() }
```

## Renamed in 1.2

The old names still work and will keep working until 2.0. Each logs a deprecation warning naming its replacement.

| Old | New | Note |
| --- | --- | --- |
| `onGetValue` | `value` | |
| `onLoop` | `onRender` | Used to fire twice per pass. |
| `onAdd` | `onMount` | No longer receives an unused `DashboardEvent`. |
| `onRemove` | `onBeforeRemove` | Return `false` instead of calling `event.triggerCompleted()`. |

Two long-standing surprises were fixed at the same time:

* `value` is no longer ignored on `dataType: "Date"` fields. The date template used to overwrite whatever the callback returned.
* A falsy return is now honoured, so a field can actually be blanked. Only `undefined` means "use the default".
