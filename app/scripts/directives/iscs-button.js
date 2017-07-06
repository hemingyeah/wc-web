/*
 *按钮权限
 */
app.directive('iscsButton', ['btnGroup', '$templateCache', function(btnGroup, $templateCache) {
    return {
        restrict: "E",
        template: $templateCache.get('tpl/button-group.html'),
        replace: true,
        link: function(scope, e, a, model) {},
        controller: ['$scope', function($scope) {
            $scope.moreBtns = [];
            if ($scope.businessBtns) {
                $scope.btnGroup = btnGroup.baseBtns.concat($scope.businessBtns);
            } else {
                $scope.btnGroup = btnGroup.baseBtns;
            }
            $scope.baseBtns = $scope.btnGroup.filter(function(obj, index) {
                return !obj.group;
            })
            $scope.dropDownBtns = $scope.btnGroup.filter(function(obj, index) {
                return obj.group;
            })
            for (var key in $scope.event) {
                $scope.dropDownBtns.forEach(function(obj, index) {
                    if (obj.code === key) {
                        $scope.moreBtns.push(obj)
                    } else {
                        return;
                    }
                });
            }
        }]
    }
}]);