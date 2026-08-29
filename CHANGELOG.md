# Changelog

## 1.2 — Unified callback contract

Every hook now works the same way. Previously each one had its own calling
convention: some bound `this`, some didn't, and the second argument meant
different things depending on which component it came from.

### The contract

Every callback receives a single context object. Destructure the keys you need:

```javascript
value:      ({ value, record }) => record.Gender === 'Female' ? value.toUpperCase() : value,
visibility: ({ record })        => record.Status ? 'show' : 'hide',
onClick:    ({ record, event }) => { event.stopPropagation(); open(record.Id); }
```

| Key | What it is |
| --- | --- |
| `value` | The field's own value. Fields only. |
| `record` | The whole row. The same on every component. |
| `component` | The Field, Action or Record itself. |
| `el` | The rendered DOM node. |
| `dashboard` | The Dashboard instance. |
| `event` | The DOM event. `onClick` only. |

Handlers written against the older positional and `this`-based styles continue to
work unchanged — they are covered by the test suite — but the context object is
the documented contract.

### Renamed — old names still work, with a deprecation warning

| Old | New |
| --- | --- |
| `onGetValue` | `value` |
| `onLoop` | `onRender` |
| `onAdd` | `onMount` |
| `onRemove` | `onBeforeRemove` |

### Breaking

- **`onClick`'s second argument is now the record on every component.** It used
  to be the component's own `data`, which on a *field* is the field's value, not
  the row — so `onClick: function (field, record)` on a field received a string
  where the name promised an object. Use `record` for the row and `value` (or
  `component.value`) for the field's own value. `onClick` is now
  `(component, record, event)`, with `event` being the DOM click event.
- **`onRemove` → `onBeforeRemove` changes how removal is completed.** The old
  hook received a `DashboardEvent` and you called `event.triggerCompleted()`. The
  new one uses the return value: `false` cancels, a promise defers, anything else
  proceeds. Configs still using `onRemove` keep the old event behaviour.
- **`onMount` no longer receives a `DashboardEvent`.** The event it used to be
  passed was never wired to anything.

### Fixed

- **`value` (was `onGetValue`) is no longer ignored on `dataType: "Date"` fields.**
  The date template used to be built *after* the callback ran and overwrote
  whatever it returned.
- **A falsy return from `value` is now honoured.** The assignment was guarded by
  `if (processedValue)`, so returning `''` left the original value on screen and a
  field could not be blanked. Only `undefined` now means "no opinion".
- **`onRender` (was `onLoop`) fired twice per render pass**, from two call sites —
  one of which invoked it unbound, so `this` was the global object on half the
  firings. The duplicate call has been removed.
- **A function-valued `url` was briefly written into the `href`.** `setLink()` was
  called with the raw property before the function was resolved. A falsy `url` no
  longer produces an `href="null"` attribute either.
- **`urlTarget` and `target` were read in different places** and disagreed. Both
  are now accepted.
- **`record` is now set on every component.** Actions had it, records did not, so
  `this.record` was undefined inside a record's own handlers while meaning the row
  everywhere else.
- **`dashboard` is now propagated** to records, fields and actions instead of
  being `null` on everything except the Dashboard itself.

### Added

- `icon`, `url`, `visibility`, `class`, `style` and `width` may all be functions,
  resolved through the same contract as `value`.
- A callback that throws is contained and falls back to the default instead of
  taking the render down with it.
- `test/contract.test.js` covers the contract end to end by booting a real
  dashboard, including every legacy call style that must keep working.

## 1.1

- Fixed Badge CSS, & set the default state to be `box-sizing: border-box;`
- Design is more uniformly Rounded Edges.
- Fixed bug where some sorting items & field headers generated errors because
  they inherited the events from the fields.
- Fixed Unique ID Generator functions so the name of the component is attached
  to it.
