app.controller('taskListCtrl', ['$scope', '$compile', 'toaster',
    function($scope,$compile, toaster) {
        $scope.event = $.extend({
            search: function() {
                 //日期非空
                if ($scope.query.orderCreateTimeFrom == "" || $scope.query.orderCreateTimeTo == "") {
                    toaster.pop('warning', '', '请填写查询日期');
                    return false;
                }
                $scope.event.getFilters();
                $scope.event.loadData();
            },
            refresh: function() {
                $scope.event.loadData();
                $scope.gridOptions.api.sizeColumnsToFit();
            }
        });
    }
]);