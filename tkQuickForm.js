angular.module('tkQuickForm', [])
    .directive('tkQuickForm', ['$http', '$compile', formDirective]);

function formDirective($http, $compile) {
    var $scope;

    function link(scope, elem, attr, ctrl) {
        $scope = scope;
        $scope.submitUrl = (attr.submitUrl ? attr.submitUrl : "/");
        $scope.formTitle = (attr.formTitle ? attr.formTitle : "");
        $scope.formSubmit = (attr.formSubmit ? attr.formSubmit : "Submit");
        $scope.formData = {};
        $scope.submitButton = angular.element('<input>');
        $scope.formObject = {
            fill: fillData,
            clear: clearData,
            enable: enableForm,
            disable: disableForm
        };
        
        $scope.submitFunction =
            ($scope.submitFunction ? $scope.submitFunction : submitForm);

        var options = {};
        if(attr.clearButton) {
            options.clearButton = attr.clearButton;
        }
        $scope.$watch((scope) => {
            return scope.ds;
        }, (val) => {
            if(typeof val === 'object') {
                $compile(buildForm(val, elem, options).contents())(scope);
                clearData();
            }
        });
    }

    function onClickSubmit() {
        if(validateForm()) {
            $scope.submitButton.attr("disabled", true);
            $scope.$apply($scope.submitFunction(undefined, $scope.formData, releaseButton, clearData));
            $scope.$digest();
        } else {
            var err = new Error("Form invalid");
            $scope.$apply($scope.submitFunction(err));
        }
    }

    function validateForm() {
        var valid = true;
        $scope.inputElements.forEach((elem) => {
            if(!elem.hasClass("ng-valid"))
                valid = false;
        });
        return valid;
    }

    function ResetFunction() {
        this.resetFunctions = new Array();
    }
    ResetFunction.prototype.addFunc = function(func) {
        this.resetFunctions.push(func);
    }
    ResetFunction.prototype.go = function() {
        var i = this.resetFunctions.length;
        while(i--) {
            this.resetFunctions[i]();
        }
    }

    //based on structure - create a form
    function buildForm(mdb, formElement, opt) {
        $scope.reset = new ResetFunction();
        $scope.inputElements = new Array();
        for(var i=0; i < mdb.length; i++) {
            $scope.inputElements.push(createInputElement(mdb[i]))
            formElement.append($scope.inputElements[i]);
            formElement.append("<br>");
        }

        $scope.submitButton
            .attr("type", "button")
            .attr("id", "add_new_movie_button")
            .attr("value", "{{formSubmit}}")
            .on("click", onClickSubmit);
        formElement.append($scope.submitButton);

        if(typeof opt === 'object') {
            if(opt.clearButton) {
                $scope.clearButton = angular.element('<input>');
                $scope.clearButton
                    .attr("type", "button")
                    .attr("value", opt.clearButton)
                    .on("click", clearData);
                formElement.append($scope.clearButton);
            }
        }

        return formElement;
    }

    function createInputElement(data) {
        if(data.type == 'string') {
            if(data.maxLength && data.maxLength > 1024) {
                //if maxLength > 1024 put a text area instead
                var elem = createTextArea({
                    id: data.fieldName,
                    placeholder: data.fieldName,
                    hidden: (data.hidden ? true : false),
                    required: (data.required ? true : false)
                });
            } else {
                //add input field to the form
                var elem = createTextInput({
                    id: data.fieldName,
                    placeholder: data.fieldName,
                    hidden: (data.hidden ? true : false),
                    required: (data.required ? true : false)
                });
            }
        } else if(data.type == 'enum') {
            //add select field to the form
            var elem = createSelect({
                id: data.fieldName,
                defOption: data.fieldName.toLocaleUpperCase(),
                options: data.enum,
                hidden: (data.hidden ? true : false),
                required: (data.required ? true : false)
            });
        } else if(data.type == 'number') {
            //add number field
            var elem = createNumberInput({
                id: data.fieldName,
                placeholder: data.fieldName,
                hidden: (data.hidden ? true : false),
                required: (data.required ? true : false)
            });
        }

        return elem;
    }

    function createBaseElement(elemType, data) {
        var elem = angular.element(elemType)
            .attr("id", data.id)
            .attr("ng-model", "formData." + data.id);

        if(data.hidden) {
            elem.css("display", "none");
        }
        if(data.required) {
            elem.attr("required", "true");
        }

        return elem;
    }

    function createNumberInput(data) {
        var elem = createBaseElement("<input>", data)
            .attr("type", "number")
            .attr("placeholder", data.placeholder);

        $scope.reset.addFunc(() => {
            elem.val("");
        });

        return elem;
    }

    function createSelect(data) {
        var elem = createBaseElement("<select>", data);
        var defOpt = angular.element("<option>")
            .attr("class", "def_op")
            .attr("selected", true)
            .attr("default", true)
            .attr("disabled", true)
            .html(data.defOption);
        elem.append(defOpt);
        for(var i=0; i < data.options.length; i++) {
            var opt = angular.element("<option>");
            opt.attr("value", data.options[i]);
            opt.html(data.options[i]);
            elem.append(opt);
        }

        $scope.reset.addFunc(() => {
            $scope.formData[data.id] = data.defOption;
        });

        return elem;
    }

    function createTextArea(data) {
        var elem = createBaseElement("<textarea>", data)
            .attr("placeholder", data.placeholder)
            .attr("rows", (data.rows ? data.rows : 5))
            .attr("cols", (data.cols ? data.cols : 50));

        $scope.reset.addFunc(() => {
            elem.val("");
        });

        return elem;
    }

    function createTextInput(data) {
        var elem = createBaseElement("<input>", data)
            .attr("type", "text")
            .attr("placeholder", data.placeholder);

        $scope.reset.addFunc(() => {
            elem.val("");
        });

        return elem;
    }

    function clearData() {
//        for(entry in $scope.formData) {
//            $scope.formData[entry] = "";
//        }
        $scope.reset.go();
    }

    function fillData(data) {
        for(entry in data) {
            $scope.formData[entry] = data[entry];
        }
    }

    function releaseButton(buttonText) {
        if(buttonText)
            $scope.formSubmit = buttonText;
        $scope.submitButton.attr("disabled", false);
    }
    
    function disableForm() {
        $scope.inputElements.forEach((elem) => {
            elem.attr("disabled", true);
        })
        $scope.submitButton.attr("disabled", true);
    }
    
    function enableForm() {
        $scope.inputElements.forEach((elem) => {
            elem.attr("disabled", false);
        })
        $scope.submitButton.attr("disabled", false);
    }

    function submitForm() {
        var originalSubmit = $scope.formSubmit;
        $scope.formSubmit =  "Loading...";

        //send request to server
        $http({
            method: "POST",
            url: $scope.submitUrl,
            data: $scope.formData
        }).then((res)  => {
            // if successful: reset form
            clearData();
        }, (res) => {
            // if failed: show error message
            console.log(res);
        }).finally(() => {
            // always: re-enable submit button, remove loading gif
            $scope.submitButton.attr("disabled", false);
            $scope.formSubmit = originalSubmit;
        });
    }

    return {
        restrict: 'E',
        template: "<h1>{{formTitle}}</h1>",
        scope: {
            ds: "=formStructure",
            formObject: "=",
            formData: "=",
            submitFunction: "&?onSubmit"            
        },
        link: link
    }
}