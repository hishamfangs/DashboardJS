# Config

`config` describes the dashboard. It is optional — pass only `data` and you get a working dashboard with sensible defaults.

```javascript
var dashboard = new FutureLabs.Dashboard({
  language: 'en-US',
  config: { /* ... */ },
  data: { /* ... */ }
});
```

## Top-level properties

| Property | Type | What it does |
| --- | --- | --- |
| `language` | string | Active language code. Defaults to `'en-US'`. Drives every `translation` object in the config. |
| `profile` | object | The user card in the sidebar. |
| `initialActiveTab` | string | Which tab opens first. Defaults to the first one. |
| `tabs` | object | One entry per recordset. See [Tabs](../tabs.md). |

`language` sits **outside** `config`, alongside it — everything else lives inside.

## Profile

```javascript
profile: {
  name: 'John Addams',
  image: 'dashboardjs/assets/jadams.jpg',
  url: 'https://www.example.com',
  urlTarget: '_blank',
  translation: { 'ar-AE': 'عبد الله المستكاوي' }
}
```

## The shape

Config nests the same way the UI does — dashboard, then tabs, then the record inside a tab, then that record's fields and actions:

```
config
└── tabs
    └── 'User Profiles'          → Tabs
        ├── icon, description, viewMode, itemsPerPage, recordsGrid
        └── recordSettings        → Record Settings
            ├── image, fieldsGrid, onClick
            ├── fields            → Fields
            └── actions           → Actions
```

Each level is documented on its own page: [Tabs](../tabs.md), [Record Settings](../record-settings.md), [Fields](../fields.md), [Actions](../actions.md).

## Functions anywhere

Any of `value`, `icon`, `url`, `visibility`, `class`, `style` and `width` may be a function instead of a static value, and every component accepts `onClick`, `onRender`, `onMount` and `onBeforeRemove`. They all share one calling convention — see [Callbacks](../callbacks.md).

## A complete example

Two tabs, showing most of what config can do without repeating itself.

```javascript
var dashboard = new FutureLabs.Dashboard({
  language: 'en-US',
  config: {
    profile: {
      name: 'John Addams',
      image: 'dashboardjs/assets/jadams.jpg',
      translation: { 'ar-AE': 'عبد الله المستكاوي' }
    },
    initialActiveTab: 'User Profiles',
    tabs: {
      'User Profiles': {
        icon: 'far fa-user',
        description: {
          'en-US': 'A list of all approved users',
          'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
        },
        translation: { 'ar-AE': 'ملفات تعريف المستخدم' },
        viewMode: 'Cards',
        itemsPerPage: 12,
        recordsGrid: { 'grid-template-columns': '1fr 1fr 1fr', 'gap': '20px' },

        recordSettings: {
          image: { url: 'imageURL', height: '200px' },
          fieldsGrid: { 'grid-template-columns': '1fr 1fr', 'gap': '15px' },
          onClick: ({ record }) => openProfile(record.Id),

          fields: {
            Date:   { name: 'Date of Birth', dataType: 'Date', width: '100px' },
            Name:   {
              name: 'Name',
              position: 'left',
              url: ({ record }) => record.ProfileId ? '/profile/' + record.ProfileId : null,
              visibility: ({ value }) => value.includes('(disabled)') ? 'disable' : 'show'
            },
            Status: {
              name: 'Marital Status',
              position: 'right',
              value: ({ value, record }) =>
                record.Gender === 'Female' && value === 'Married'
                  ? '<b style="color:#72de72">' + value + '</b>'
                  : value
            },
            Gender: {
              name: 'Gender',
              position: 'right',
              icon: ({ value }) => value === 'Female' ? 'fas fa-venus' : 'fas fa-mars'
            }
          },

          actionsType: 'menu',
          actions: {
            'More details...': { icon: 'info-icon', onClick: ({ record }) => showDetails(record) },
            'Edit':            { icon: 'edit-icon', onClick: ({ record }) => edit(record) },
            'Delete':          {
              icon: 'cancel-icon',
              onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
            }
          }
        }
      },

      'Invoices': {
        icon: 'fas fa-file-invoice',
        description: 'Outstanding and settled invoices',
        viewMode: 'List',
        itemsPerPage: 20,

        recordSettings: {
          fields: {
            Name:    { name: 'Customer', position: 'left', style: { 'grid-column': 'span 2' } },
            Balance: {
              name: 'Balance',
              position: 'right',
              icon: 'fas fa-money-bill-wave',
              value: ({ value }) => value ? '$' + Number(value).toFixed(2) : '—'
            },
            Date:    { name: 'Issued', dataType: 'Date' }
          },
          actions: {
            'Pay': {
              icon: 'pay-icon',
              visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable',
              onClick: ({ record }) => startPayment(record.InvoiceId)
            }
          }
        }
      }
    }
  },
  data: data
});
```
