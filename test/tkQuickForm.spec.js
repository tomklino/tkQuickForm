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
            <tk-quick-form form-structure="formStructure" form-data="formData" form-object="mainForm" ></tk-quick-form>
        `)(this.scope);

        this.scope.$digest(); // call digest first

        var input = $(element).find("input#name")[0];
        angular.element(input).val('set').triggerHandler('input');
        expect(element).toContainElement('input#name');
        expect(element).not.toContainElement('input#other');

        expect(this.scope.formData.name).toBe("set");
    });
    
    it('should create and link select objects', function() {
        this.scope.formStructure = [
            {
                fieldName: 'selectField',
                type: 'enum',
                enum: ['option1', 'option2', 'option3', 'option4']
            }
        ];
        
        var element = this.$compile(`
            <tk-quick-form form-structure="formStructure" form-data="formData" form-object="mainForm" ></tk-quick-form>
        `)(this.scope);

        this.scope.$digest(); // call digest first
        
        //expect select element to be created
        expect(element).toContainElement("select#selectField");
        //expect the first option to be the name and to be disabled
        expect($(element).find("select#selectField > option")[0]).toHaveValue("SELECTFIELD");
        expect($(element).find("select#selectField > option")[0]).toHaveAttr("disabled", "disabled");
        expect($(element).find("select#selectField > option")[0]).toHaveAttr("selected", "selected");
        //expect element to have 4 options plus the disabled title (4+1=5)
        expect($(element).find("select#selectField > option")).toHaveLength(5);
    })
});
