# Internationalization & Localization

Any label in the config can be translated by adding a `translation` object next to it, keyed by language code.

```javascript
var dashboard = new FutureLabs.Dashboard({
  language: 'ar-AE',          // the active language
  config: { /* ... */ },
  data: data
});
```

`language` sits alongside `config`, not inside it. It defaults to `'en-US'`.

## Where translations go

Wherever there is a name to show — tabs, fields, actions, the profile:

```javascript
config: {
  profile: {
    name: 'John Addams',
    translation: { 'ar-AE': 'عبد الله المستكاوي' }
  },
  tabs: {
    'User Profiles': {
      translation: { 'ar-AE': 'ملفات تعريف المستخدم' },
      description: {
        'en-US': 'A list of all approved users',
        'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
      },
      recordSettings: {
        fields: {
          Date:   { name: 'Date of Birth',   translation: { 'ar-AE': 'تاريخ الميلاد' } },
          Status: { name: 'Marital Status',  translation: { 'ar-AE': 'الحالة الزوجية' } }
        },
        actions: {
          'Edit': { icon: 'edit-icon', translation: { 'ar-AE': 'تعديل' } }
        }
      }
    }
  }
}
```

## Two shapes

`translation` maps a language code to a replacement for `name`:

```javascript
Status: { name: 'Marital Status', translation: { 'ar-AE': 'الحالة الزوجية' } }
```

`description` is a language map in its own right — there is no separate English key to override:

```javascript
description: { 'en-US': 'A list of all approved users', 'ar-AE': 'قائمة بجميع المستخدمين المعتمدين' }
```

A plain string is fine when you only need one language:

```javascript
description: 'A list of all approved users'
```

## Falling back

A missing translation for the active language falls back to `name`, so a partially translated config still renders. Nothing throws and nothing renders blank.

## Translating values, not labels

`translation` covers labels. To localise the **data** — a status, a currency, a date — use the [`value`](callbacks.md) hook, which has the active language on its context:

```javascript
Status: {
  name: 'Marital Status',
  translation: { 'ar-AE': 'الحالة الزوجية' },
  value: ({ value, component }) =>
    component.language === 'ar-AE'
      ? { Married: 'متزوج', Single: 'أعزب' }[value] || value
      : value
}
```

```javascript
Balance: {
  value: ({ value, component }) =>
    new Intl.NumberFormat(component.language, { style: 'currency', currency: 'AED' }).format(value)
}
```

## Right-to-left

Set `dir` on the page and the layout follows, since the grid is built with logical CSS:

```html
<html lang="ar" dir="rtl">
```

## Switching language

`language` is read when the dashboard is built. To change it afterwards, construct a new dashboard with the new code:

```javascript
function render(language) {
  document.querySelector('.dashboard-container').innerHTML = '';
  return new FutureLabs.Dashboard({
    language: language,
    config: config,
    data: data,
    templateURL: 'dashboardjs/dashboard.html',
    appendTo: '.dashboard-container'
  });
}
```
