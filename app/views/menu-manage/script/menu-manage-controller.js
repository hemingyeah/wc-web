//菜单管理控制器
app.controller('menuManageCtrl', ['$scope', '$state', '$http', '$compile', 'dialog', 'gridService', function($scope, $state, $http, $compile, dialog, grid
) {
    $scope.dialog = dialog;
    $scope.pageSize = 30;
    $scope.headClick = function(evt) {
       evt.stopPropagation();
       scope = angular.element($(evt.target)).scope();
       // scope.toggle = !scope.toggle;
       if (scope.toggle) {
           scope.gridOptions.api.selectAll();
       }else {
           scope.gridOptions.api.deselectAll();
       }
    }
    $scope.headerCellRendererFunc = function(params) {
        if (params.colDef.field === "checkBox") {
            params.colDef.cellStyle = {
                'text-align': 'center'
            };
            params.colDef.width = 40;
            params.colDef.maxWidth = 40;
            params.colDef.suppressSorting = true;
            params.colDef.suppressMenu = true;
            params.colDef.checkboxSelection = true;
            params.colDef.headerName = "选择";
            params.colDef.suppressMenu = true;

            var input = '<label class="display-block c-checkbox header-checkbox"><input type="checkbox" ng-model="toggle" ng-click="headClick($event)" ng-model="acheckBox" /><span  class="fa fa-check"></span></label>';
            var content = $compile(input)($scope);
            return content[0];
        } else {
            return params.colDef.headerName;
        }
    }
    var columnDefs = [{
        headerName: "选择",
        field: "checkBox",
        width: 40,
        checkboxSelection: true, //单选框
        suppressSorting: true,
        suppressMenu: true,
        cellStyle: { 'text-align': 'center' }
        // pinned: true
    }, {
        headerName: "菜单名称",
        field: "menuName",
        width: 400,
        rowGroupIndex: 0,
        // use font awesome for first col, with numbers for sort
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        },
        cellRenderer: {
            renderer: 'group',
            innerRenderer: function(params) {
                return '<span style="padding-left: 10px;">' + params.data.menuName + '</span>';
            }
        }
    }, {
        headerName: "显示序号",
        field: "orderSeq",
        width: 200,
        icons: {
            // not very useful, but demonstrates you can just have strings
            sortAscending: 'U',
            sortDescending: 'D'
        }
    }, {
        headerName: "页面名称",
        field: "pageName",
        width: 200,
        // rowGroupIndex: 0,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    }, {
        headerName: "页面地址",
        field: "pageUrl",
        width: 400,
        // mix it up a bit, use a function to return back the icon
        icons: {
            sortAscending: function() {
                return 'ASC';
            },
            sortDescending: function() {
                return 'DESC';
            }
        }
    }];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        groupSuppressAutoColumn: true,
        rowSelection: 'multiple',
        headerHeight:36,
        getRowHeight: function(params) {
            if (params.node.footer) {
                return 36;
            } else {
                return 40;
            }
        },
        // override all the defaults with font awesome
        icons: {
            // use font awesome for menu icons
            menu: '<i class="fa fa-bars"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
            // use some strings from group
            groupExpanded: '<img src="images/icon/minus.png" style="width: 15px;"/>',
            groupContracted: '<img src="images/icon/plus.png" style="width: 15px;"/>'
        },
        headerCellRenderer: $scope.headerCellRendererFunc,
        getNodeChildDetails: function(file) {
            if (file.__children) {
                return {
                    group: true,
                    children: file.__children,
                    expanded: file.open
                };
            } else {
                return null;
            }
        },

    };
    $http.get("local_api/tree-data.json")
        .then(function(res) {
            $scope.gridOptions.api.setRowData(res.data.grid.list.rows);
        });
    $scope.event = {
        add: function() {
            var data = $scope.gridOptions.api.getSelectedRows();
            $scope.dialog.show('views/menu-manage/menu-add.html', 'menuManageEditCtrl', 'md', null, function() {

            })
        }
    }
}]);
//菜单编辑控制器
app.controller('menuManageEditCtrl', ['$scope', '$state', '$http', '$uibModalInstance', function($scope, $state, $http, $uibModalInstance) {
    $scope.event = {
        close: function() {
            $uibModalInstance.close(true);

        }
    }
}])
