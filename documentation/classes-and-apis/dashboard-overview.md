# Dashboard Overview

DashboardJS is a tree of components. Each one owns its own DOM node, its own slice of config, and its own children.

```
Dashboard                     the root, and what you construct
├── UserProfile               the sidebar profile card
├── Tabs                      the tab strip
│   └── Tab                   one per entry in config.tabs
│       ├── DataManager       rows, paging, sorting, filtering, fetching
│       ├── Sorting           the sort control
│       ├── Filtering         the keyword box
│       ├── ViewSwitcher      Cards / List toggle
│       ├── Paging            the pager
│       └── Recordset         the grid or list of records
│           └── Record        one per row
│               ├── Field     one per entry in fields
│               └── Action    one per entry in actions
└── FieldHeaderContainer      column headers, List view only
```

Every box in that tree except `DataManager` inherits from [Component](component.js.md), so `setText`, `addClass`, `getChild`, `remove` and the rest work the same way on all of them.

## The config mirrors the tree

Where a component sits in the tree is where its options sit in the config:

| Component | Configured by |
| --- | --- |
| Dashboard | the top level — `language`, `profile`, `initialActiveTab` |
| Tab | an entry in [`tabs`](../configuration-options/tabs.md) |
| Record | [`recordSettings`](../configuration-options/record-settings.md) |
| Field | an entry in [`fields`](../configuration-options/fields.md) |
| Action | an entry in [`actions`](../configuration-options/actions.md) |

## Walking the tree

```javascript
const tab       = dashboard.getChild('User Profiles');
const recordset = tab.getChild('Recordset');
const record    = recordset.children.records[0];
const field     = record.getChild('Name');
```

Inside a [callback](../configuration-options/callbacks.md) you rarely need to walk anything — the context object hands you `component`, `record`, `el` and `dashboard` directly.

## Lifecycle

1. **init** — config is copied onto the component; deprecated keys are rewritten; computed properties are set aside.
2. **render** — the template is cloned and the DOM node created.
3. **processEvents** — `visibility`, `icon` and `url` are resolved, click handlers are attached, then `onRender` fires.
4. **mount** — the component is appended to its parent, and `onMount` fires.
5. **removal** — `remove()` consults `onBeforeRemove`, then `delete()` detaches the node.

A record is built once for Card view and once for List view, so `onRender` fires for each — keep it idempotent.

## The classes

| Class | Page |
| --- | --- |
| Component | [Component.js](component.js.md) |
| Dashboard | [Dashboard.js](dashboard.js.md) |
| Tabs | [Tabs.js](tabs.js.md) |
| Tab | [Tab.js](tab.js.md) |
| Recordset | [Recordset.js](recordset.js.md) |
| DataManager | [DataManager.js](datamanager.js.md) |
