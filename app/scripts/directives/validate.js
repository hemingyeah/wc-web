//验证控件
app.directive("validateEquals", [function($compile) {
    return {
        restrict: "A",
        replace: true,
        require: 'ngModel',
        transclude: true,
        link: function(scope, element, attr, ngModelCtrl) {
            function validateEqual(myValue) {
                var valid = (myValue === attr.validateEquals);
                ngModelCtrl.$setValidity('equal', valid);
                return valid ? myValue : undefined;
            }
            ngModelCtrl.$parsers.push(validateEqual);
            ngModelCtrl.$formatters.push(validateEqual);
            scope.$watch(attr.validateEquals, function() {
                ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
            });

        }
    }
}]);