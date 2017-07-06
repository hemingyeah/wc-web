app.controller('orderListCtrl', ['$scope', 'orderListService', 'gridService', '$compile', 'toaster',
    function($scope, orderListService, gridService, $compile, toaster) {

    $scope.service = orderListService;
    gridService.gridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "合同Ukid",/*合同Ukid*/
            checked: true,
            field: "contractUkid"
        }, {
            headerName: "合同类型",/*合同类型*/
            checked: true,
            field: "contractType",
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "快递",/*快递*/
            checked: true,
            field: "brand"
        }, {
            headerName: "套餐",/*买家留言*/
            checked: true,
            field: "serviceName"
        }, {
            headerName: "套餐ID",/*买家留言*/
            checked: true,
            field: "serviceUkid"
        }]);
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false,
        headerCellRenderer: $scope.headerCellRenderer,
        onSelectionChanged: function() {}
    };
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        getFilters: function() {
            //查询
            $scope.filter = [];
            $scope.filterTemp = [{
                field: "shopId",
                compare: "equal",
                value: $scope.query.shopId,
                datatype: "number"
            }, {
                field: "receiverName",
                compare: "equal",
                value: $scope.query.receiverName,
                datatype: "string"
            }, {
                field: "receiverMobile",
                compare: "equal",
                value: $scope.query.receiverMobile,
                datatype: "number"
            }, {
                field: "orderCreateTime",
                compare: "between",
                minvalue: $scope.query.orderCreateTimeFrom,
                maxvalue: $scope.query.orderCreateTimeTo,
                datatype: "datetime"
            }, {
                field: "orderPayTime",
                compare: "between",
                minvalue: $scope.query.orderPayTimeFrom,
                maxvalue: $scope.query.orderPayTimeTo,
                datatype: "datetime"
            }];

            angular.forEach($scope.filterTemp, function(obj, index, arr) {
                if (obj.value || obj.minvalue && obj.maxvalue) {
                    $scope.filter.push(obj);
                }
            });
            if ($scope.query.mix) {
                if ($scope.query.mix.match(/\d+/g)) {
                    $scope.filter.push({
                        field: "contractUkid",
                        compare: "equal",
                        value: $scope.query.mix,
                        datatype: "string"
                    });
                } else {
                    $scope.filter.push({
                        field: "contractType",
                        compare: "equal",
                        value: $scope.query.mix,
                        datatype: "string"
                    });
                }
            } else return;
        },
        setExpress: function() {
            //快递选择
            var datas = $scope.gridOptions.api.getSelectedRows();
            if (datas.length > 0) {
                var data =[];
                for(i=0; datas.length>i; i++){
                    data.push(datas[i].contractUkid);
                }
                data = data.join(",");
                //弹出编辑界面
                $scope.dialog.show('views/order/order-express.html', 'orderListExpress', 'lg', {
                    rowId: function() {
                        return data;
                    },
                    brand: function() {
                        return datas[0].brand;
                    },
                    ukid : function() {
                        return datas[0].serviceUkid;
                    }
                }, function(data) {
                    if (data == "success") {
                        $scope.event.loadData();
                    }
                    return false;
                })
            } else {
                toaster.pop('warning', '', '请选择要编辑的内容');
            }
        },
        save: function() {},
        quickSearch: function() {
            $scope.event.getFilters();
            $scope.event.loadData();
        },
        search: function() {
            $scope.event.getFilters();
            $scope.event.loadData();
        },
        refresh: function() {
            $scope.event.loadData();
        }
    });
}]);

//选择快递弹框
app.controller('orderListExpress', ['$scope', '$compile', 'showOrderDetailService','$uibModalInstance', 'rowId', 'brand','ukid','toaster', 
    function($scope, $compile, showOrderDetailService, $uibModalInstance, rowId, brand,ukid, toaster) {
    $scope.model=[];
    $scope.selectedUnit = {};
    $scope.event = {
        close: function(col) {
            $uibModalInstance.close(col);
            return false;
        },
        save: function(sty) {
            if($scope.sle==undefined){
                toaster.pop('warning', '', '请选择配送分部');
                return false;
            }
            if($scope.uit==undefined){
                if($scope.sle.service.length > 1){
                    toaster.pop('warning', '', '请选择快递套餐');
                    return false;
                } else {
                    $scope.uit = $scope.sle.service[0];
                }
            }
            var datas = {}
            datas.contractUkid = rowId;
            datas.serviceUkid = $scope.uit.serviceUkid;
            //保存快递修改
            showOrderDetailService.updataExpress($scope, datas, function(data) {
                if (data.code == "0") {
                    toaster.pop('success', '', '保存成功');
                    $uibModalInstance.close(sty);
                } else {
                    toaster.pop('warning', '', '保存失败');
                }
            });
        },
        selectValue: function(data,sle,uit,evt) {
            //增加点击效果+获取值
            $(".express-set label").click(function(){
                $(".express-set label").removeClass('express-active');
                $(this).addClass('express-active');
            });
            $scope.expressModels = data;
            $scope.sle = sle;
            $scope.uit = uit;
        }
    };
    showOrderDetailService.loadExpressData($scope, rowId, function(data) {
        $scope.expressModel = data.data;
        //默认勾选
        var rowIds = rowId.split(',');
        //对应分部显示
        angular.forEach($scope.expressModel, function(obj, index) {
           obj.Unit = false;
           //if只有一个快递
           if(data.data.length == 1){
               obj.class = 'express-active';
           }
           //if分部1个以文字形式显示
           if(obj.bus.length == 1){
               obj.selectedUnit = obj.bus[0];
               obj.Unit = true;
           }
           //勾选1个默认选中状态
           if (rowIds.length == 1) {
                var uname = brand+"快递";
                if (obj.rsName == uname) {
                    obj.class = 'express-active';
                    angular.forEach(obj.bus, function(data, i) {
                        angular.forEach(data.service, function(datas, n) {
                            var id = data.service[n].serviceUkid;
                            if(id == ukid) {
                                //选中对应分部
                                obj.selectedUnit = data;
                                $scope.sle = data;
                                //选中对应套餐
                                obj.selectedPosition = datas;
                                $scope.uit = datas;
                            }
                        }); 
                        
                    }); 
                    
                }
            }
        });
    });
}]);
