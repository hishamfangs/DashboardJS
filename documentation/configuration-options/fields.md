# Fields

`fields` describes the columns of a record. Each key maps to a key in your data, and its value is an object describing how that column looks and behaves.

```javascript
fields: {
  Name:   { name: 'Full Name' },
  Status: { name: 'Marital Status', position: 'right' },
  Date:   { name: 'Date of Birth', dataType: 'Date' }
}
```

Omit the object entirely and the field is rendered with its data key as the label.

## Properties

| Property | Type | What it does |
| --- | --- | --- |
| `name` | string | The label shown for the field. Defaults to the data key. |
| `position` | `'left'` \| `'right'` \| `'center'` | Text alignment inside the card. Defaults to `center`. |
| `dataType` | `'Date'` | Renders the value as a graphical day / month / year block. Only `'Date'` changes anything; other values are accepted and ignored. |
| `width` | string | Column width in List view. |
| `class` | string | Extra CSS class on the field. |
| `style` | object | CSS property/value pairs applied to the field, e.g. `{ 'grid-column': 'span 2' }`. |
| `icon` | string | A CSS or FontAwesome class name shown beside the value. |
| `url` | string | Wraps the value in a link. Pair with `urlTarget: '_blank'`. |
| `translation` | object | Language-code map for the field's label. See [Internationalization](internationalization-and-localization.md). |
| `value` | function | Computes the displayed value. |
| `visibility` | function | Shows, hides or disables the field. |
| `onClick` | function | Fires when the field is clicked. |
| `onRender` | function | Fires as the field renders. |

`value`, `icon`, `url`, `visibility`, `class`, `style` and `width` may each be given as a **function** instead of a static value. Each receives a single context object — see [Callbacks](callbacks.md) for every key it carries.

## Formatting a value

Whatever `value` returns is displayed. HTML is allowed.

```javascript
Balance: {
  name: 'Balance',
  position: 'right',
  value: ({ value }) => value ? '$' + Number(value).toFixed(2) : '—'
}
```

Return `undefined` to fall through to the default rendering. Return `''` to blank the field.

```javascript
Description: {
  // Show a muted placeholder rather than an empty cell
  value: ({ value }) => value || '<span style="color:#c3c3c3">N/A</span>'
}
```

{% hint style="info" %}
`value` also wins over `dataType: 'Date'`. If you set both, your value is displayed and the date template is skipped.
{% endhint %}

## Showing, hiding and disabling

```javascript
Name: {
  // 'disable' greys the field out and removes its click handlers.
  visibility: ({ value }) => value.includes('(disabled)') ? 'disable' : 'show'
}
```

`'hide'` removes the field, `'show'` and `'enable'` display it, and `false` or `0` are accepted as shorthand for hide.

## Linking

`url` may be a string or a function. A function returning a falsy value renders no anchor at all, which is the clean way to make a link conditional.

```javascript
Name: {
  url: ({ record }) => record.ProfileId ? '/profile/' + record.ProfileId : null,
  urlTarget: '_blank'
}
```

## Reacting to a click

The field's value, its row and the DOM event all arrive on the context.

```javascript
Name: {
  onClick: ({ value, record, event }) => {
    event.stopPropagation();          // don't also fire the record's onClick
    console.log(value, 'on', record);
  }
}
```

## Layout

`style` takes raw CSS property/value pairs, so a field can span columns in the card grid.

```javascript
Description: {
  position: 'left',
  width: '400px',                      // List view column width
  class: 'justify',
  style: { 'grid-column': 'span 2' }   // Card view span
}
```

## A worked example

```javascript
fields: {
  Date: {
    name: 'Date of Birth',
    dataType: 'Date',
    width: '100px',
    translation: { 'ar-AE': 'تاريخ الميلاد' }
  },
  Name: {
    name: 'Name',
    position: 'left',
    url: ({ record }) => record.ProfileId ? '/profile/' + record.ProfileId : null,
    visibility: ({ value }) => value.includes('(disabled)') ? 'disable' : 'show',
    translation: { 'ar-AE': 'الإسم' }
  },
  Status: {
    name: 'Marital Status',
    position: 'right',
    value: ({ value, record }) =>
      record.Gender === 'Female' && value === 'Married'
        ? '<b style="color:#72de72">' + value + '</b>'
        : value,
    translation: { 'ar-AE': 'الحالة الزوجية' }
  },
  Gender: {
    name: 'Gender',
    position: 'right',
    icon: ({ value }) => value === 'Female' ? 'fas fa-venus' : 'fas fa-mars',
    translation: { 'ar-AE': 'الجنس' }
  }
}
```
