# Internationalization & Localization

You can translate any names, labels, fields, actions ....etc simply by adding a translation property to it's enclosing brace in the config object

```javascript
const config = {
  tabs: {
    'User Profiles': {
      translation: {
        'ar-AE':'ملفات تعريف المستخدم'
      },
      recordSettings:{
        fields: {
          Date: { 
            name: "Date of Birth", 
            translation: { 
              "ar-AE": "السن" 
            }
          }
        }
        actions: {
          'More details...': {
            icon: 'info-icon',
            translation: {
              'ar-AE': 'معلومات أخرى'
            },
            onClick: function(){
              alert('Clicked More Info ...');
            }
          }
        }
      }
    }
  }
};


```
