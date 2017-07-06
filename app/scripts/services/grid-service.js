app.factory('gridService', ['$compile', function($compile) {
    return {
        gridInit: function($scope) {
            //列头
            $scope.columnDefs = [{
                headerName: "#",
                field: "no",
                checked: true,
                width: 30,
                // suppressSorting: true,
                suppressMenu: true, //关闭菜单
                suppressSizeToFit: true,
                suppressSorting: true, //关闭排序
                pinned: true,
                ifShowInPanel: false,
                cellRenderer: function(params) {
                    return params.rowIndex + 1;
                }
            }, {
                headerName: '<label class="display-block c-checkbox header-checkbox"><input type="checkbox" ng-click="headClick($event,acheckBox)" ng-model="acheckBox" /><span  class="fa fa-check"></span></label>',
                checked: true,
                field: "checkBox",
                width: 46,
                ifShowInPanel: false,
                checkboxSelection: true, //单选框
                suppressSorting: true, //关闭排序
                suppressMenu: true //关闭菜单
            }];
            //默认配置
            $scope.options = {
                suppressMenuColumnPanel: true,
                suppressMenuFilterPanel: true,
                suppressMenuMainPanel: true,
                angularCompileRows: true,
                angularCompileHeaders: true,
                enableSorting: true, //开启排序
                // sortingOrder: ['desc', 'asc', null], //排序次序
                enableFilter: true, //过滤器
                enableColResize: true,
                suppressRowClickSelection: true,
                rowSelection: 'multiple', //默认多选
                headerCellRenderer: $scope.headerCellRenderer,
                //showToolPanel: true,
                headerHeight: 36,
                rowClicked: $scope.rowClicked,
                cellClicked: $scope.cellClicked,
                suppressLoadingOverlay: true, //去掉表格自带的loading
                getRowHeight: function(params) {
                    if (params.node.footer) {
                        return 36;
                    } else {
                        return 36;
                    }
                },
                rowSelected: function() {},
                getMainMenuItems: function(params) { //
                    switch (params.column.getId()) {

                        // return the defaults, put add some extra items at the end
                        case 'no':
                            var athleteMenuItems = params.defaultItems.slice(0);
                            athleteMenuItems.push({
                                name: 'ag-Grid Is Great',
                                action: function() { console.log('ag-Grid is great was selected'); }
                            });
                            athleteMenuItems.push({
                                name: 'Casio Watch',
                                action: function() { console.log('People who wear casio watches are cool'); }
                            });
                            return athleteMenuItems;

                            // return some dummy items
                        case 'checkBox':
                            return [{ // our own item with an icon
                                    name: 'Joe Abercrombie',
                                    action: function() { console.log('He wrote a book'); },
                                    icon: '<img src="../images/lab.png" style="width: 14px;"/>'
                                }, { // our own icon with a check box
                                    name: 'Larsson',
                                    action: function() { console.log('He also wrote a book'); },
                                    checked: true
                                },
                                'resetColumns' // a built in item
                            ];

                        default:
                            // make no changes, just accept the defaults
                            return params.defaultItems;
                    }

                },
                // rowGroupPanelShow: 'always',
                // virtualPaging: true,
                // rowModelType: 'virtual',
                rowModelType: 'pagination',
                debug: false,
                localeText: {
                    page: 'daPage',
                    more: 'daMore',
                    to: 'daTo',
                    of: 'daOf',
                    next: 'daNexten',
                    last: 'daLasten',
                    first: 'daFirsten',
                    previous: 'daPreviousen',
                    noRowsToShow: '没有数据',
                    loadingOoo: '正在加载...',
                    // for set filter
                    selectAll: '选择所有',
                    searchOoo: '选择...',
                    blanks: '空',
                    // for number filter
                    equals: '等于',
                    lessThan: 'daLessThan',
                    greaterThan: 'daGreaterThan',
                    applyFilter: '<a class="btn btnlink" style="padding:0px 8px;">筛选</a>',
                    filterOoo: '请输入...',
                    // for text filter
                    contains: '包含',
                    startsWith: '从..开始',
                    endsWith: '以..结束',
                    // the header of the default group column
                    group: 'laGroup',
                    // tool panel
                    columns: '列名称',
                    pivotedColumns: 'laPivot Cols',
                    pivotedColumnsEmptyMessage: 'la please drag cols to here',
                    valueColumns: 'laValue Cols',
                    valueColumnsEmptyMessage: 'la please drag cols to here'
                }
            };
            $scope.rowClicked = function(params) {}
            $scope.setRowSelected = function(evt, data) {
                    $scope.gridOptions.api.selectData.push(data)
                }
                /*表格扩展方法*/
                //复选框全选功能
            $scope.headClick = function(evt, check) {
                if (check) {
                    $scope.gridOptions.api.selectAll();
                } else {
                    $scope.gridOptions.api.deselectAll();
                }
            };
            $scope.checkboxSelected = function(selected, data) {};
            $scope.cellClicked = function(params) {};
            //渲染表格头
            $scope.headerCellRenderer = function(params) {
                if (params.colDef.field === "checkBox") {
                    params.colDef.cellStyle = {
                        'text-align': 'center'
                    };
                    params.colDef.checkboxSelection = true;
                    return params.colDef.headerName;
                } else {
                    return params.colDef.headerName;
                }
            };
        },
        construtor: function($scope) {
            var obj = {};
            obj.$scope = $scope;
            obj.service = $scope.service;
            obj.dataSource = function() {
                var cacheThis = this;
                return {
                    rowCount: null,
                    pageSize: cacheThis.$scope.page.selectedPageSize.name,
                    getRows: function(params) {
                        cacheThis.service.loadData($scope, {
                            currentPage: $scope.pageIndex,
                            sort: $scope.sort || "",
                            pageSize: cacheThis.$scope.page.selectedPageSize.name,
                            filter: $scope.filter || []
                        }, function(data) {
                            $scope.totalItems = data.data.allNum;
                            params.successCallback(data.data.contentList);
                        })
                    }
                };
            };
            obj.loadData = function() {
                var cacheThis = this;
                $scope.gridOptions.api.setDatasource(cacheThis.dataSource());
            };
            return obj;
        }
    };
}])
