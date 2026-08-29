# Record Settings

`recordSettings` describes a single record inside a tab — its image, its layout, its fields, its actions, and the events for the record as a whole.

```javascript
tabs: {
  'User Profiles': {
    recordSettings: {
      fields:  { Name: { name: 'Name' } },
      actions: { 'Edit': { icon: 'edit-icon', onClick: ({ record }) => edit(record) } }
    }
  }
}
```

## Properties

| Property | Type | What it does |
| --- | --- | --- |
| `fields` | object | The record's columns. See [Fields](fields.md). |
| `actions` | object | The record's buttons. See [Actions](actions.md). |
| `actionsType` | `'buttons'` \| `'menu'` | How actions are presented. Defaults to `buttons`. |
| `image` | object | Renders an image on the record. See below. |
| `fieldsGrid` | object | CSS Grid property/value pairs laying out the fields inside a record. |
| `class` | string | Extra CSS class on the record. |
| `style` | object | CSS property/value pairs applied to the record. |
| `onClick` | function | Fires when anywhere on the record is clicked. |
| `onRender` | function | Fires as the record renders. |
| `onMount` | function | Fires as the record is added to the recordset. |
| `onBeforeRemove` | function | Guards removal of the record. |

## Images

`image.url` is the **key in your data** that holds the image URL, not the URL itself.

```javascript
image: {
  url: 'imageURL',      // data key, e.g. record.imageURL
  height: '200px'       // height in Card view
}
```

Records with no value at that key fall back to a placeholder image.

## Laying out fields

`fieldsGrid` takes raw CSS Grid pairs, so the arrangement of fields within a card is entirely yours.

```javascript
fieldsGrid: {
  'grid-template-columns': '1fr 1fr',
  'gap': '15px',
  'justify-items': 'stretch'
}
```

Individual fields can span columns with their own `style: { 'grid-column': 'span 2' }`.

## Record events

A record's context carries its row as `record`. See [Callbacks](callbacks.md) for the full list of context keys.

```javascript
recordSettings: {
  onClick: ({ record }) => openDetails(record.Id),

  // Nothing is removed until this resolves to something other than false.
  onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
}
```

{% hint style="info" %}
A field's `onClick` fires before the record's. Call `event.stopPropagation()` in the field handler if you don't want both to run.
{% endhint %}

## A worked example

```javascript
recordSettings: {
  image: { url: 'imageURL', height: '200px' },

  fieldsGrid: {
    'grid-template-columns': '1fr 1fr',
    'gap': '15px'
  },

  onClick: ({ record }) => openDetails(record.Id),

  fields: {
    Date:   { name: 'Date of Birth', dataType: 'Date', width: '100px' },
    Name:   { name: 'Name', position: 'left' },
    Status: {
      name: 'Marital Status',
      position: 'right',
      value: ({ value, record }) =>
        record.Gender === 'Female' && value === 'Married'
          ? '<b style="color:#72de72">' + value + '</b>'
          : value
    },
    Description: {
      position: 'left',
      class: 'justify',
      style: { 'grid-column': 'span 2' },
      value: ({ value }) => value || '<span style="color:#c3c3c3">N/A</span>'
    }
  },

  actionsType: 'menu',
  actions: {
    'Edit':   { icon: 'edit-icon',   onClick: ({ record }) => edit(record) },
    'Pay':    { icon: 'pay-icon',    visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable' },
    'Delete': { icon: 'cancel-icon', onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?') }
  }
}
```
