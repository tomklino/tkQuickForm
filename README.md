# tkQuickForm
Angularjs directive to create a form quickly and with very little code

## Installation and setup
`bower install tkQuickForm`

After installing, in your html head section, link the script tag

`<script type="text/javascript" src="/path/to/module/tkQuickForm.js"> </script>`

## Usage
In your html file, where you want the form to appear, add the following:

```html
<tk-quick-form form-structure="formStructure" form-data="formData" form-object="mainForm" ></tk-quick-form>
```

The attribute `form-structure="formStructure"` tells tk-quick-form to look in `$scope.formStructure` for a json array describing the form, the attribute `form-data="formData"` will tell it to bind the values inserted to the form by the user to `$scope.formData` and `form-object="mainForm"` will bind functionality to `$scope.mainForm` which will be described later.

Now, in your controller:

```js
//include tkQuickForm as a dependency for your app
var yourApp = angular.module('yourApp', ['tkQuickForm']);

yourApp.controller("yourController", function() {
  $scope.formStructure = [
    {
      fieldName: 'myFirstInput',
      type: 'string'
    },
    {
      fieldName: 'myFirstSelectField',
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

## formObject functionality
In the example above `form-object` is bound to `$scope.mainForm`. The following functions will be available in that object:

* `$scope.mainForm.disable()`
* `$scope.mainForm.enable()`
* `$scope.mainForm.clear()`
* `$scope.mainForm.fill(fillObject)`
`fillObject` is a key value object where the keys are the fieldNames described in the form structure and the values are what will be inserted into the form.

## More useful attributes
* `form-title="Some Title"` - will add a title to the top of the form
* `form-submit="Click Here"` - will change the submit button text to whatever you want
* `submit-url=/add/` - will change the destination of the POST request sent to the server (default is `/`)
* `clear-button="Click to clear"` - will add a button that clears the form

## Running tests

```
npm install
npm run test
```
