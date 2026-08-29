# Actions

`actions` adds buttons to every record. Each key is the button's label; its value describes the icon and behaviour.

```javascript
recordSettings: {
  actionsType: 'buttons',        // 'buttons' (default) or 'menu'
  actions: {
    'Edit':   { icon: 'edit-icon',   onClick: ({ record }) => edit(record) },
    'Cancel': { icon: 'cancel-icon', onClick: ({ record }) => cancel(record) }
  }
}
```

Set `actionsType: 'menu'` to collapse them into a dropdown instead of a row of buttons.

## Properties

| Property | Type | What it does |
| --- | --- | --- |
| `icon` | string | A CSS or FontAwesome class name for the button icon. |
| `translation` | object | Language-code map for the action's label. |
| `width` | number | Button width. Defaults to `60`. |
| `visibility` | function | Shows, hides or disables the action per row. |
| `onClick` | function | Fires when the action is clicked. |
| `onBeforeRemove` | function | Guards removal of the record. |
| `onRender` | function | Fires as the action renders. |

`icon`, `visibility`, `url`, `class`, `style` and `width` may each be a function. See [Callbacks](callbacks.md).

## Reading the row

An action's context carries the row it belongs to as `record`.

```javascript
actions: {
  'Pay': {
    icon: 'pay-icon',
    onClick: ({ record }) => startPayment(record.InvoiceId)
  },
  'Email': {
    icon: 'mail-icon',
    onClick: ({ record }) => window.open('mailto:' + record.Email)
  }
}
```

## Enabling per row

Returning `'disable'` greys the button out and removes its click handler — usually better feedback than making the button vanish.

```javascript
'Pay': {
  icon: 'pay-icon',
  visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable'
}
```

Return `'hide'` to remove it entirely, `'show'` to display it.

## Per-row icons

```javascript
'Flag': {
  icon: ({ record }) => record.Flagged ? 'fas fa-flag' : 'far fa-flag'
}
```

## Confirming a removal

`onBeforeRemove` holds the removal open. Return `false` to cancel it, or a promise to defer it — nothing is removed until it resolves to something other than `false`.

```javascript
'Delete': {
  icon: 'cancel-icon',
  onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
}
```

```javascript
'Delete': {
  icon: 'cancel-icon',
  onBeforeRemove: async ({ record }) => {
    const response = await fetch('/api/people/' + record.Id, { method: 'DELETE' });
    return response.ok;                    // false leaves the row in place
  }
}
```

## A worked example

```javascript
recordSettings: {
  actionsType: 'menu',
  actions: {
    'More details...': {
      icon: 'info-icon',
      translation: { 'ar-AE': 'معلومات أخرى' },
      onClick: ({ record }) => showDetails(record)
    },
    'Pay': {
      icon: 'pay-icon',
      translation: { 'ar-AE': 'دفع' },
      visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable',
      onClick: ({ record }) => startPayment(record.InvoiceId)
    },
    'Edit': {
      icon: 'edit-icon',
      translation: { 'ar-AE': 'تعديل' },
      onClick: ({ record }) => edit(record)
    },
    'Delete': {
      icon: 'cancel-icon',
      translation: { 'ar-AE': 'حذف' },
      onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
    }
  }
}
```
