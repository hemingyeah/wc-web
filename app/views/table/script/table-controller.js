app.controller('tableCtrl', ['$scope', 'tableService', 'gridService', '$compile', function($scope, tableService, gridService, $compile) {
    $scope.service = tableService;
    gridService.gridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "姓名",
        field: "athlete",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "国籍",
        field: "country"
    }, {
        headerName: "运动",
        field: "sport",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "金牌",
        field: "gold",
        suppressSorting: true
    }, {
        headerName: "日期",
        field: "date",
        sort: "desc",
        unSortIcon: true
    }]);
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        enableSorting: true,
        headerHeight: 40,
        headerCellRenderer: $scope.headerCellRenderer,
        // floatingBottomRowData: true,
    };
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        save: function () {
            $scope.gridOptions.getSelectedNodes();
        }
    });
}]);
