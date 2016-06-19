# tkQuickForm
Angularjs directive to create a form quickly and with very little code
## Usage
In your html file, where you want the form to appear, add the following:

```html
<div tk-quick-form="formStructure" form-data="formData" id="main_form" ></div>
```

The attribute `tk-quick-form="formStructure"` tells tk-quick-form to look in `$scope.formStructure` for a json array describing the form, and the attribute `form-data="formData"` will tell it to bind the values inserted to the form by the user to `$scope.formData`.

Now, in your controller:

```js
//include tkQuickForm as a dependency for your app
var yourApp = angular.module('yourApp', ['tkQuickForm']);

yourApp.controller("yourController", function() {
  $scope.formStructure = [
    {
      name: 'myFirstInput',
      type: 'string'
    },
    {
      name: 'myFirstSelectField',
      type: 'enum',
      enum: ['option1', 'option2', 'option3']
    }
  ];
})
```

The above form structure will create a form with a single free input field with id of `myFirstInput` and a select field with id of `myFirstSelectField` consisting of the 3 options stated above. If the user has typed in "Hello world" in the first field and chose "option1" in the second, the object `$scope.formData` will look as follows:

```js
{
  myFirstInput: "Hello World",
  myFirstSelectField: "option1"
}
```