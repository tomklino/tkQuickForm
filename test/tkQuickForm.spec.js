    describe('tkQuickForm', function () {
        beforeEach(module('tkQuickForm'));

        beforeEach(inject(function ($rootScope, $compile) {
            this.$rootScope = $rootScope;
            this.scope = $rootScope.$new();
            this.$compile = $compile;
        }));

        it('should pass dummy test', function () {
            expect(true).toBe(true);
        });

        it('should link ng-model to formData', function() {
            this.scope.formStructure = [
                {
                    fieldName: 'name',
                    type: 'string'
                }
            ];

            var element = this.$compile(`
                <div tk-quick-form="formStructure" form-data="formData" id="main_form"></div>"
            `)(this.scope);

            this.scope.$digest(); // call digest first

            var input = element.find("input")[0];
            angular.element(input).val('set').triggerHandler('input');

            expect(this.scope.formData.name).toBe("set");
        });
    });
