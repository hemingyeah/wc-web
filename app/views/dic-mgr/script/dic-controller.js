app.controller('dicMgrCtrl', ['$scope', 'dicService', 'dialog', 'gridService', '$compile', function($scope, dicService, dialog, gridService, $compile) {
    $scope.service = dicService;
    $scope.dialog = dialog;
    $scope.query = {};
    gridService.gridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "类型",
        field: "definedCodeType",
        width: 150,
        sort: "desc",
        unSortIcon: true,
        checked:true
    }, {
        headerName: "编码",
        field: "definedCode",
        width: 200,
        sort: "desc",
        unSortIcon: true,
        checked:true
    }, {
        headerName: "名称",
        field: "definedName",
        width: 300,
        filter: 'number', //过滤器
        checked:true
            // cellRenderer: function(params) {
            //         return '<a href="' + params.data.url + '" target="_blank">' + params.data.title + '</a>'
            //     }
            // cellClass: ["iscs-table"] //单元格样式类
    }, {
        headerName: "排序",
        field: "displaySeq",
        width: 100,
        sort: "desc",
        unSortIcon: true,
        checked:true
            // newValueHandler: function(param) {
            //     console.log(param.newValue)
            // },
            // hide: true,
            // cellClass: ["iscs-table"] //单元格样式类
    }, {
        headerName: "描述",
        field: "definedDesc",
        width: 100,
        sort: "desc",
        unSortIcon: true,
        checked:true
            // newValueHandler: function(param) {
            //     console.log(param.newValue)
            // },
            // hide: true,
            // cellClass: ["iscs-table"] //单元格样式类
    }, {
        headerName: "更新时间",
        field: "dateUpdated",
        width: 500,
        checked:true
    }]);

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false
    }
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        add: function() {
            var selectedData = $scope.gridOptions.api.getSelectedRows();
            $scope.dialog.show('views/dic-mgr/dic-edit.html', 'dicMgrEditCtrl', 'md', {
                data: function() {
                    return null
                }
            }, function() {})
        },
        edit: function() {
            var selectedData = $scope.gridOptions.api.getSelectedRows();
            $scope.dialog.show('views/dic-mgr/dic-edit.html', 'dicMgrEditCtrl', 'md', {
                data: selectedData[0]
            }, function(data) {

            })
        },
        delete: function() {
            var selectedData = $scope.gridOptions.api.getSelectedRows();
            dicService.delete($scope, selectedData[0], function(data) {
                $scope.event.loadData();
            })
        },
        getFilters: function() {
            $scope.filter = [];
            var filterTemp = [{
                field: "definedCodeType",
                compare: "equal",
                value: $scope.query.definedCodeType || "",
                datatype: "string"
            }];

            angular.forEach(filterTemp, function(obj, index, arr) {
                if (obj.value && obj != "") {
                    $scope.filter.push(obj)
                }
            });
        },
        quickSearch: function() {
            $scope.event.getFilters();
            $scope.event.loadData();
        },
        search: function() {
            $scope.event.getFilters();
            $scope.event.loadData();
        }
    });
}]);
app.controller('dicMgrEditCtrl', ['$scope', '$uibModalInstance', 'dicService', 'data', function($scope, $uibModalInstance, dicService, data) {
    $scope.model = data;
    $scope.event = {
        save: function() {
            if (data) {
                dicService.edit($scope, $scope.model, function(data) {
                    $uibModalInstance.close(data);
                })
            } else {
                dicService.save($scope, $scope.model, function(data) {
                    $uibModalInstance.close(data);
                })
            }
        },
        close: function() {
            $uibModalInstance.close();
        }
    }
}])