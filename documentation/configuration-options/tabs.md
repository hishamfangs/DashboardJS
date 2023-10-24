# Tabs

```javascript
tabs: {
	'User Profiles': {	// Configure a tab
		// translations for multilingual support
		// This works for all config objects: tabs, fields, actions, ...etc
		// Simply add the translations and pair them up to the language code that is passed to the dashboard in the config object
		translation: {
			'ar-AE':'ملفات تعريف المستخدم'
		},
		// The class name for the tab icon. You can use custom class names (add them to theme.css), or if you include the fontawesome library
		// you can just use the icon classname from fontawesome (Supports fontawesome)
		icon: "far fa-user",
		// A brief description that will appear on top of each tab
		// Can be just a string when multilanguage support is not needed
		// Alternatively, can be an object with language keys as below for multilingual support
		description: {
			'en-US': 'A list of all approved users',
			'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
		},	
		// Sets the default view mode for this tab: Cards view or List view
		viewMode: 'Cards',	// 'Cards' or 'List'
		// CSS GRID property/value pairs to format the records in Cards view.
		// Below is the default css properties, can be changed to any valid CSS proeprty/value pairs
		recordsGrid:{				
			'grid-template-columns': '1fr 1fr 1fr',
			'gap': '20px',
			'justify-items': 'stretch'					
		},
		// Pagination. Define how many records per page.
		// Defaults to 12!
		itemsPerPage: 12,
		// This property object configures the settings for the records,
		// including the fields, actions, the grid ...etc
		recordSettings:{
			...
		}
	}
}
```
