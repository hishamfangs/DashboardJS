# DashboardJS (version 1.2)
![dashboard-full](https://github.com/hishamfangs/DashboardJS/assets/48479688/8100695e-95aa-4078-a742-8c914b7ebbd1)

[DashboardJS](https://www.dashboardjs.net) is a free, modular, responsive, open source dashboard component to display records in a sleek and modern way, built entirely in vanilla Js, with zero dependancies. 
You can have different tabs that show different recordsets complete with pagination, sorting, filtering, and you can switch views for each recordset between Card view, and List view.

DashboardJS is fully themeable, all you need is knowledge of HTML & CSS.

DashboardJS works either Synchronously (full data loaded and fed into the Dashboard component before initiation), or Asnychronously (Dashboard loads page by page through Fetch API).

Note: Starting March 2024, Microsoft Defender updated their virus signatures, and as a result it started flagging the Trojan:Script/Wacatac.H!ml as false positives as on many plugins, programs, apps, Java applications, and even Steam games & update packages accross the internet, and DashboardJS is no different. If you find that DashboardJS is being block by Windows Defender, rest assured this is a false positive and you can feel safe downloading it. I have submitted a report to Microsoft, in the meantime, please disable or add a "allow rule" in Microsoft Defender for DashboardJS.  

Callback Reference
------------------
Every config key is either a **noun** or a **verb**.

**Nouns** — `value`, `icon`, `url`, `visibility`, `class`, `style`, `width` — may be a
plain value *or* a function that returns one.

**Verbs** — `onClick`, `onRender`, `onMount`, `onBeforeRemove` — are side effects.

Both are called the same way: each receives a single **context object**. Destructure
the keys you need.

```javascript
Status: {
  value:      ({ value, record }) => record.Gender === 'Female' ? value.toUpperCase() : value,
  visibility: ({ record })        => record.Status ? 'show' : 'hide',
  onClick:    ({ value, record }) => console.log(value, record)
}
```

### The context object

| Key | What it is |
| --- | --- |
| `value` | The field's own value. Fields only. |
| `record` | The whole row, as a plain data object. |
| `component` | The Field / Action / Record itself. |
| `el` | The rendered DOM node. |
| `dashboard` | The Dashboard instance. |
| `event` | The DOM event. `onClick` only. |

`value` and `record` are deliberately separate names — `data` used to mean the value on
a Field but the whole row on an Action, and that overload caused most of the confusion
this contract replaces.

### Return values

| Hook | Returns |
| --- | --- |
| `value` | The value to display. `undefined` means "no opinion" — the default is used. Any other value is used verbatim, **including `''`**, which blanks the field. |
| `visibility` | `'show'`, `'enable'`, `'disable'` or `'hide'`. `false` and `0` also mean hide. |
| `url` | The href. A falsy return renders no `<a>` at all, which is how you make a link conditional. |
| `icon` | A CSS or FontAwesome class name. |
| `onBeforeRemove` | Return `false` to cancel the removal, or a promise to defer it. Anything else proceeds. |

```javascript
actions: {
  "Delete": {
    // Nothing is removed unless this resolves to something other than false.
    onBeforeRemove: ({ record }) => confirm('Remove ' + record.Name + '?')
  }
}
```

### Renamed in 1.2

The old names still work and will keep working until 2.0, but each logs a
deprecation warning naming its replacement.

| Old | New |
| --- | --- |
| `onGetValue` | `value` |
| `onLoop` | `onRender` |
| `onAdd` | `onMount` |
| `onRemove` | `onBeforeRemove` (return `false` to cancel instead of completing an event) |

Simplest Example:
----------
```javascript
var dashboard = new FutureLabs.Dashboard({
  data: [{
      "Name": "Jessie Bambergans",
      "Status": "Married",
      "Date": "1980-08-10",
      "Gender": "Female"
    },{
      "Name": "Jerome Berner",
      "Status": "Single",
      "Date": "1980-08-10",
      "Gender": "Male"
    },{
      "Name": "Ruba Jackman",
      "Status": "Married",
      "Date": "1984-01-05",
      "Gender": "Female"
  }]
});
```
![dashboard-simple](https://github.com/hishamfangs/DashboardJS/assets/48479688/0a0c84fc-979f-45a2-a83c-2e8113826586)

Note: The HTML template with the appropriate CSS files and assets need to be present on the loading html page for the code above to run, which can be found here: [index.html](https://github.com/hishamfangs/DashboardJS/blob/main/dist/Simplest%20Example%20-%20No%20Configuration%20-%20Uses%20Current%20HTML%20file/index.html)

Example with basic customization options for the tabs, fields & actions:
----------
```javascript
var dashboard = new FutureLabs.Dashboard({
  config: {
    tabs: {
      'User Profiles': {
        recordSettings:{
          fields: {
            Date: {
              name: "Date of Birth",
              width: "100px",		// Width of the field in List View
              dataType: "Date"		// This treats the field like a date, and formats the date graphically
            },
            Status: {
              name: "Marital Status",
              position: "right"		// Alignment Position in the Card View (text-align)
            },
            Name: {
              name: "Name"
            },
            Gender: {
              name: "Gender",
              position: "right",	// Alignment Position in the Card View (text-align)
              icon: "fas fa-venus-mars"	// class name for the icon. If you include fontawesome, you can use the classname for your icon here, or you can create your own custom icon classes in CSS	
            }
          },
          actions: {
            "More details...": {
              icon: 'info-icon',
              onClick: ({ record }) => showDetails(record)
            },
            "Pay": {
              icon: "pay-icon",
              // return 'show', 'enable', 'disable' or 'hide'
              visibility: ({ record }) => record.Balance > 0 ? 'show' : 'disable',
              onClick: ({ record }) => startPayment(record.InvoiceId)
            },
            "Edit": {
              icon: 'edit-icon',
              onClick: ({ record }) => edit(record)
            },
            "Cancel": {
              icon: 'cancel-icon',
              onClick: ({ record }) => cancel(record)
            }
          }
        }
      }
    }
  },
  data: {
    "User Profiles": [{
      "Name": "Jessie Bambergans",
      "Status": "Married",
      "Date": "1980-08-10",
      "Gender": "Female"
    },{
      "Name": "Jerome Berner",
      "Status": "Single",
      "Date": "1980-08-10",
      "Gender": "Male"
    },{
      "Name": "Ruba Jackman",
      "Status": "Married",
      "Date": "1984-01-05",
      "Gender": "Female"
    }]
  }
});
```

Card View:
![dashboard-some-options](https://github.com/hishamfangs/DashboardJS/assets/48479688/1a8cc65b-5b57-4d52-95a2-f21aa8b0356f)

List View:
![dashboard-some-options-list](https://github.com/hishamfangs/DashboardJS/assets/48479688/080049a0-fdf6-4149-bda0-d9f97a57a522)


Example with FULL customization options for the Dashboard:
----------
Two tabs, showing most of what the config object can do. Every callback below
follows the one convention described in [Callback Reference](#callback-reference).

```javascript
var dashboard = new FutureLabs.Dashboard({
  // Drives every `translation` object in the config. Defaults to 'en-US'.
  language: 'en-US',
  config: {
    profile: {
      name: 'John Addams',
      image: 'assets/jadams.jpg',
      url: 'https://www.example.com',
      urlTarget: '_blank',
      translation: { 'ar-AE': 'عبد الله المستكاوي' }
    },
    initialActiveTab: 'User Profiles',

    tabs: {
      'User Profiles': {
        icon: 'far fa-user',                     // supports FontAwesome or your own classes
        translation: { 'ar-AE': 'ملفات تعريف المستخدم' },
        description: {
          'en-US': 'A list of all approved users',
          'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
        },
        viewMode: 'Cards',                       // 'Cards' or 'List'
        itemsPerPage: 12,                        // defaults to 12
        recordsGrid: {                           // raw CSS Grid pairs
          'grid-template-columns': '1fr 1fr 1fr',
          'gap': '20px'
        },

        recordSettings: {
          image: { url: 'imageURL', height: '200px' },   // 'imageURL' is a KEY in your data
          fieldsGrid: { 'grid-template-columns': '1fr 1fr', 'gap': '15px' },
          onClick: ({ record }) => openProfile(record.Id),

          fields: {
            Date: {
              name: 'Date of Birth',
              dataType: 'Date',                  // renders a graphical day/month/year block
              width: '100px',                    // column width in List view
              translation: { 'ar-AE': 'تاريخ الميلاد' }
            },
            Name: {
              name: 'Name',
              position: 'left',
              // A falsy return renders no <a> at all
              url: ({ record }) => record.ProfileId ? '/profile/' + record.ProfileId : null,
              // 'disable' greys the field out and drops its click handlers
              visibility: ({ value }) => value.includes('(disabled)') ? 'disable' : 'show',
              translation: { 'ar-AE': 'الإسم' }
            },
            Status: {
              name: 'Marital Status',
              position: 'right',
              // Returned value is displayed verbatim; HTML is allowed
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
            },
            Description: {
              position: 'left',
              class: 'justify',
              style: { 'grid-column': 'span 2' },
              // '' blanks the field; undefined would fall through to the raw value
              value: ({ value }) => value || '<span style="color:#c3c3c3">N/A</span>',
              translation: { 'ar-AE': 'الوصف' }
            }
          },

          actionsType: 'menu',                   // 'buttons' (default) or 'menu'
          actions: {
            'More details...': {
              icon: 'info-icon',
              translation: { 'ar-AE': 'معلومات أخرى' },
              onClick: ({ record }) => showDetails(record)
            },
            'Edit': {
              icon: 'edit-icon',
              translation: { 'ar-AE': 'تعديل' },
              onClick: ({ record }) => edit(record)
            },
            'Delete': {
              icon: 'cancel-icon',
              translation: { 'ar-AE': 'حذف' },
              // Nothing is removed unless this resolves to something other than false
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

![full-dashboard-preview](https://github.com/hishamfangs/DashboardJS/assets/48479688/d052e066-9a48-47d9-a18f-7d992ab80b6d)

List View:

![dashboard-listview](https://github.com/hishamfangs/DashboardJS/assets/48479688/a37d089c-b10f-4292-93bf-b4c517e09b62)

Documentation
----------
Full reference at [docs.dashboardjs.net](https://docs.dashboardjs.net):
[Config](https://docs.dashboardjs.net) · Tabs · Record Settings · Fields · Actions · Callbacks

Ver 1.2 Release Notes:
-----------------------
Every callback now works the same way — see [Callback Reference](#callback-reference)
above, or the [full changelog](CHANGELOG.md).

- **One convention for every hook.** Each callback receives a single context object —
  `{ value, record, component, el, dashboard, event }` — so you destructure what you
  need and nothing else.
- **`value`, `icon`, `url`, `visibility`, `class`, `style` and `width` may each be a
  function** instead of a static value.
- **Renamed** (old names still work, with a deprecation warning): `onGetValue` → `value`,
  `onLoop` → `onRender`, `onAdd` → `onMount`, `onRemove` → `onBeforeRemove`.
- **`onBeforeRemove` replaces the `DashboardEvent` dance** — return `false` to cancel a
  removal, or a promise to defer it.
- **Fixed:** `value` was ignored on `dataType: "Date"` fields; a falsy return was
  ignored so a field could not be blanked; `onRender` fired twice per render pass;
  a function-valued `url` was briefly written into the href; `record` was missing on
  records; `dashboard` was `null` on every child component.

Ver 1.1 Release Notes:
-----------------------
- Fixed Badge CSS, & set the default state to be box-sizing: border-box;
- Design is more uniformly Rounded Edges.
- Fixed bug where Some sorting items & Field Headers generated errors because they inherited the events from the fields.
- Fixed Unique ID Generator functions so the name of the component is attached to it
