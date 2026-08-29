---
description: Restyling DashboardJS with nothing but HTML and CSS
---

# Theming

DashboardJS ships two stylesheets, and the split is the whole theming story:

| File | What it does | Edit it? |
| --- | --- | --- |
| `css/rules.css` | Structural rules the component needs to function — grid behaviour, show/hide, view switching. | No. |
| `css/theme.css` | Everything you can see: colours, spacing, radii, fonts, icons. | Yes. This is your theme. |

```html
<link rel="stylesheet" href="dashboardjs/css/rules.css">
<link rel="stylesheet" href="dashboardjs/css/theme.css">
```

Keep them in that order — `theme.css` is meant to win.

## Class names

Every component renders a predictable class, so you can style any part without touching JavaScript.

| Class | The component |
| --- | --- |
| `.dashboard-component` | The dashboard root. |
| `.tabs-component` · `.tab-component` | The tab strip and each tab. |
| `.recordset-component` | The records container. |
| `.record-component` | One record. |
| `.record-image` | A record's image. |
| `.fields-wrapper` · `.field-component` | The fields container and each field. |
| `.field-title` · `.field-text` · `.field-icon` | A field's label, value and icon. |
| `.actions-wrapper` · `.action-component` | The actions container and each action. |
| `.action-text` · `.action-icon` · `.action-link` | Parts of an action. |
| `.actionsmenu-component` | The dropdown when `actionsType: 'menu'`. |
| `.fieldheadercontainer-component` · `.fieldheader-component` | Column headers, List view only. |
| `.filtering-component` · `.filteringkeyword-component` | The keyword box and each keyword chip. |
| `.sorting-component` · `.sortingitem-component` | The sort control and its entries. |
| `.paging-component` · `.pagebutton-component` | The pager and its buttons. |
| `.viewswitcher-component` | The Cards / List toggle. |
| `.userprofile-component` | The sidebar profile card. |
| `.badge` | A tab's record count. |
| `.dashboard-tools` | The row holding sort, filter and view controls. |
| `.breadcrumbs-wrapper` | The tab description area. |

## State classes

Applied by [`visibility`](configuration-options/callbacks.md) and the view switcher:

| Class | Meaning |
| --- | --- |
| `.hide` | Hidden. |
| `.disable` | Greyed out, click handlers removed. |
| `.cards` · `.list` | The active view mode, set on the dashboard root. |
| `.active` | The open tab. |
| `.cursor-pointer` | Something clickable. |

```css
.field-component.disable { opacity: .45; pointer-events: none; }
.dashboard-component.list .record-component { display: flex; }
```

## Your own classes

Any component takes a `class`, and it may be computed:

```javascript
Balance: {
  class: ({ record }) => record.Balance > 0 ? 'is-overdue' : 'is-settled'
}
```

```css
.is-overdue .field-text { color: #c0392b; font-weight: 600; }
```

For a class that depends on something outside the row, use `onRender`:

```javascript
recordSettings: {
  onRender: ({ record, el }) => el.classList.toggle('is-mine', record.OwnerId === currentUserId)
}
```

## Inline styles

`style` takes CSS property/value pairs and may also be a function:

```javascript
Description: { style: { 'grid-column': 'span 2' } }
Balance:     { style: ({ record }) => ({ color: record.Balance > 0 ? '#c0392b' : 'inherit' }) }
```

## Layout

Two grids, set with real CSS Grid pairs:

```javascript
'User Profiles': {
  recordsGrid: { 'grid-template-columns': '1fr 1fr 1fr', 'gap': '20px' },   // records
  recordSettings: {
    fieldsGrid: { 'grid-template-columns': '1fr 1fr', 'gap': '15px' }       // fields within a record
  }
}
```

Because they are plain CSS, media queries work as usual:

```css
@media (max-width: 720px) {
  .records-container { grid-template-columns: 1fr !important; }
}
```

## Icons

Any `icon` is a class name, so bring your own or use a library:

```javascript
Gender: { icon: 'fas fa-venus-mars' }                                    // FontAwesome
Status: { icon: ({ value }) => value === 'Married' ? 'ring-icon' : '' }  // your own
```

```css
.ring-icon { background: url('assets/ring.svg') no-repeat center / contain; width: 1em; height: 1em; }
```

The built-in icons — `info-icon`, `pay-icon`, `edit-icon`, `cancel-icon` — live in `assets/` and are wired up in `theme.css`.

## The markup

`dashboard.html` is ordinary HTML. Copy it, restructure it, and load your copy with [`templateURL`](configuration-options/templateurl.md). The library binds to the class names in the table above, so keep those and change everything else.

## Building the CSS

`theme.css` is compiled from Sass:

```bash
npm run build      # sass + scripts + examples
npx gulp sass      # stylesheet only
```

Edit the `.scss` source rather than the compiled `theme.css`, or your next build will overwrite it.
