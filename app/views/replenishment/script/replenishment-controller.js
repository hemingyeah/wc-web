app.controller('replenishmentListCtrl', ['$scope', 'replenishmentService', 'gridService', '$compile', 'toaster',
    function($scope, replenishmentService, gridService, $compile, toaster) {
        $scope.filter = [];
        $scope.sort = "supply_start_date&asc";
        //默认查询前三天
        $scope.filterTemp = [{
            field: "supplyStartDate",
            compare: "between",
            minvalue: (new Date((new Date()).getTime() + 60 * 60 * 1000)).Format("yyyy-MM-dd"),
            maxvalue: (new Date((new Date()).getTime() + 3 * 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd"),
            datatype: "datetime"
        }];
        angular.forEach($scope.filterTemp, function(obj, index, arr) {
            $scope.filter.push(obj);
        });
        //日期转换方法
        function newDateAndTime(dateStr){
            var dates = dateStr.split(" ")[0].split("-");
            var newdate = new Date();
            newdate.setFullYear(dates[0],dates[1] - 1, dates[2]) ;
            return newdate;
        }
        $scope.service = replenishmentService;
        gridService.gridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "Sku编码",
            checked: true,
            field: "itemCode"
        }, {
            headerName: "商品名称",
            checked: true,
            width: 400,
            field: "itemName",
            cellRenderer: function(params) {
                return "<div ng-model='data' title='" + params.data.itemName + "'>" + params.data.itemName + "</div>";
            }
        }, {
            headerName: "建议补货量",
            checked: true,
            field: "supplyQty"
        }, {
            headerName: "建议补货日期",
            checked: true,
            field: "supplyStartDate",
            cellRenderer: function(params) {
                return newDateAndTime(params.data.supplyStartDate).Format("yyyy-MM-dd");
            }
        }, {
            headerName: "需求到货日期",
            checked: true,
            field: "requireDate",
            cellRenderer: function(params) {
                return newDateAndTime(params.data.requireDate).Format("yyyy-MM-dd");
            }
        }]);
        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            showToolPanel: false,
            headerCellRenderer: $scope.headerCellRenderer,
            onSelectionChanged: function() {},
            localeText: { noRowsToShow: "无补货建议" }
        };
        $scope.query = {};

        //日期增加30天
        // $scope.dateTime = function(){
        //     var unixAdd = Date.parse(new Date($scope.query.orderCreateTimeFrom))/1000 + 60*60*24*30;
        //     $scope.query.orderCreateTimeToMax = (new Date((new Date()).setTime(unixAdd * 1000))).Format('yyyy-MM-dd');
        // }
        //默认当天延后3天
        $scope.query.orderCreateTimeTo = (new Date((new Date()).getTime() + 3 * 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd");
        //最小最大
        $scope.query.orderCreateTimeToMin = (new Date((new Date()).getTime() + 60 * 60 * 1000)).Format("yyyy-MM-dd");
        $scope.query.orderCreateTimeToMax = (new Date((new Date()).getTime() + 30 * 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd");

        $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
        var consMethods = gridService.construtor($scope);
        $scope.event = $.extend(consMethods, {
            getFilters: function() {
                //查询
                $scope.filter = [];
                $scope.filterTemp = [{
                    field: "supplyStartDate",
                    compare: "between",
                    minvalue: $scope.query.orderCreateTimeFrom,
                    maxvalue: $scope.query.orderCreateTimeTo,
                    datatype: "datetime"
                }];
                //后端接口查询
                angular.forEach($scope.filterTemp, function(obj, index, arr) {
                    if (obj.value || obj.minvalue && obj.maxvalue) {
                        $scope.filter.push(obj);
                    }
                });
            },
            save: function() {},
            quickSearch: function() {
                $scope.event.getFilters();
                $scope.event.loadData();
            },
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