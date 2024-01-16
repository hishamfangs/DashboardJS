# Tabs

#### Full Example

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

#### Properties/Methods

<details>

<summary>viewMode <mark style="background-color:purple;">&#x3C;String></mark></summary>

Sets the default view mode for this tab.

#### Values

* "Cards"\
  <mark style="color:blue;">View this tab in Cards Mode</mark>
* "List"\
  <mark style="color:blue;">View this tab in List Mode</mark>&#x20;

</details>

<details>

<summary>description <mark style="background-color:purple;">&#x3C;String></mark> or <mark style="background-color:purple;">&#x3C;Object></mark></summary>

Description text to be displayed on top of the current Tab

#### Values

* \<String>\
  <mark style="color:blue;">Description text to be displayed on top of the current Tab, in all languages</mark>

<!---->

*   \<Object>

    <mark style="color:blue;">An Object containing key/value pairs, with the description for each language.</mark>\ <mark style="color:blue;">Example:</mark>\


    ```
    description: {
      'en-US': 'A list of all approved users',			
      'ar-AE': 'قائمة بجميع المستخدمين المعتمدين'
    }
    ```

</details>

<details>

<summary>icon <mark style="background-color:purple;">&#x3C;String></mark></summary>

Shows an Icon for this Tab to appear above the Tab Name

#### Values

* \<String>\
  <mark style="color:blue;">Classname of the icon. If you include fontawesome, you can add the classname in this property and the icon will appear formatted appropriatley</mark>

</details>

<details>

<summary>recordsGrid <mark style="background-color:purple;">&#x3C;Object></mark></summary>

An Object Literal of CSS GRID properties to arrange the records.



#### Values

*   \<Object>

    <mark style="color:blue;">An Object containing key/value pairs of any valid CSS properties inside a CSS GRID container</mark>\ <mark style="color:blue;">Default (if ommitted):</mark>\


    ```json
    recordsGrid:{				
    	'grid-template-columns': '1fr 1fr 1fr',
    	'gap': '20px',
    	'justify-items': 'stretch'					
    }
    ```

</details>
