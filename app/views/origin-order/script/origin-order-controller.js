app.controller('originOrderCtrl', ['$scope', 'originOrderService', 'gridService', '$compile', 'toaster','showDetailService',
    function($scope, originOrderService, gridService, $compile, toaster, showDetailService) {
    $scope.showDetailService = showDetailService;
    $scope.service = originOrderService;
    gridService.gridInit($scope);
    $scope.showDetail = function(data, evt) {
        $scope.dialog.show('views/origin-order/order-detail.html', 'orderDetailCtrl', 'lg', {
            rowId: function() {
                return data.tradeUkid;
            }
        }, function() {})
    };
    //收货人信息
    $scope.showReceiverDetail = function(data, evt) {
        $scope.dialog.show('views/origin-order/order-receiver.html', 'orderReceiverCtrl', '500', {
            rowId: function() {
                return data.tradeUkid;
            }
        }, function() {})
    };
    //付款时间信息
    $scope.showPaytimeDetail = function(data, evt) {
        $scope.dialog.show('views/origin-order/order-paytime.html', 'orderPaytimeCtrl', '300', {
            rowId: function() {
                return data.tradeUkid;
            }
        }, function() {})
    };
    //买家昵称信息
    $scope.showBuyerDetail = function(data, evt) {
        $scope.dialog.show('views/origin-order/order-buyer.html', 'orderBuyerCtrl', '300', {
            rowId: function() {
                return data.buyerNick || {};
            }
        }, function() {})
    };
    $scope.listState = function(params) {
        var status;
        var klass;
        switch (params.data.originTradeStatus) {
            case "49":
                status = "未付款";
                klass = "list-state";
                break;
            case "130":
                status = "未铺货";
                klass = "list-state iscs-red";
                break;
            case "200":
                status = "已转正";
                klass = "list-state iscs-green";
                break;
            case "410":
                status = "已作废";
                klass = "list-state iscs-ash";
                break;
            case "110":
                status = "库存不足";
                klass = "list-state iscs-yellow";
                break;
            case "100":
                status = "暂存";
                klass = "list-state";
                break;
            default:
                status = "未知状态";
                klass = "list-state iscs-red";
        }
        return '<span class="' + klass + '">' + status + '</span>';
    };
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "{{ 'order.number.platformOrder' | translate }}",/*平台订单号*/
        checked: true,
        field: "orderId",
        cellRenderer: function(params) {
            return "<span ng-model='data'>" + params.data.orderId + "</span><span class='iscs-table-details'  ng-click='showDetail(data, $event)'>详</span>";
        }
        }, {
            headerName: "{{ 'order.platformSource' | translate }}",/*平台来源*/
            checked: true,
            field: "pageUrl",
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'base.shop' | translate }}",/*店铺*/
            checked: true,
            field: "shopId",
        }, {
            headerName: "{{ 'state.iscsOrder' | translate }}",/*网仓订单状态*/
            checked: true,
            field: "originTradeStatus",
            sort: "desc",
            unSortIcon: true,
            cellRenderer: $scope.listState
        }, {
            headerName: "{{ 'state.platformOrder' | translate }}",/*平台订单状态*/
            checked: true,
            field: "placeOrderStatus",
        }, {
            headerName: "{{ 'order.name.buyersNickname' | translate }}",/*买家昵称*/
            checked: true,
            field: "buyerNick",
            sort: "desc",
            unSortIcon: true,
            cellRenderer: function(params) {
                return "<span ng-model='data'>" + params.data.buyerNick + "</span><span class='iscs-table-details' ng-click='showBuyerDetail(data, $event)'>查</span>";
            }
        }, {
            headerName: "{{ 'order.name.consignee' | translate }}",/*收货人*/
            checked: true,
            field: "receiverName",
            cellRenderer: function(params) {
                return "<span ng-model='data'>" + params.data.receiverName + "</span><span class='iscs-table-details'  ng-click='showReceiverDetail(data, $event)'>查</span>";
            }
        }, {
            headerName: "{{ 'order.amout.payment' | translate }}",/*付款金额*/
            checked: true,
            field: "orderPayment",
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'order.time.payment' | translate }}",/*付款时间*/
            checked: true,
            field: "orderPayTime",
            cellRenderer: function(params) {
                return "<span ng-model='data'>" + params.data.orderPayTime + "</span><span class='iscs-table-details'  ng-click='showPaytimeDetail(data, $event)'>查</span>";
            }
        }, {
            headerName: "{{ 'order.note.buyers' | translate }}",/*买家留言*/
            checked: true,
            field: "buyerMessage"
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
                    $scope.filter.push(obj)
                }
            });
            if ($scope.query.mix) {
                if ($scope.query.mix.match(/\d+/g)) {
                    $scope.filter.push({
                        field: "orderId",
                        compare: "equal",
                        value: $scope.query.mix,
                        datatype: "string"
                    });
                } else {
                    $scope.filter.push({
                        field: "receiverName",
                        compare: "equal",
                        value: $scope.query.mix,
                        datatype: "string"
                    });
                }
            } else return;
        },
        setExpress: function() {
            var datas = $scope.gridOptions.api.getSelectedRows();
            if (datas.length > 0) {
                var data =[];
                for(i=0; datas.length>i; i++){
                    data.push(datas[i].tradeUkid);
                }
                console.log(data + '平台订单号打印');
                $scope.dialog.show('views/origin-order/order-express.html', 'orderExpress', 'lg', {
                    rowId: function() {
                        return data;
                    },
                    buyerNick: function() {
                        return datas[0].buyerNick;
                    }
                }, function() {})
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
            $scope.gridOptions.api.sizeColumnsToFit();
        }
    });
}]);
//原始订单详情
app.controller('orderDetailCtrl', ['$scope', 'orderDetailService', 'gridService', '$compile', '$uibModalInstance', 'rowId', 'showDetailService', 
function($scope, orderDetailService, gridService, $compile, $uibModalInstance, rowId, showDetailService) {
    $scope.service = orderDetailService;
    $scope.showDetailService = showDetailService;
    gridService.gridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "{{'order.relatedId' | translate }}",/*关联ID*/
        checked: true,
        field: "relatedOrderUkid",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "{{ 'order.relatedBillType' | translate }}",/*关联单据类型*/
        checked: true,
        field: "relatedType"
    }, {
        headerName: "{{ 'order.controlName' | translate }}",/*控件名称*/
        checked: true,
        field: "operationName",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "{{ 'order.operator' | translate }}",/*操作人*/
        checked: true,
        field: "logUserId",
    }, {
        headerName: "{{ 'order.note' | translate }}",/*备注*/
        checked: true,
        field: "logRemark",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "{{ 'order.operationDate' | translate }}",/*操作日期*/
        checked: true,
        field: "logDate"
    }]);
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false,
        headerCellRenderer: $scope.headerCellRenderer
    };
    $scope.service.loadBaseInfo($scope, rowId, function(data) {
        $scope.model = data.data;
    })
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        add: function() {
            var data1 = $scope.gridOptions.api.getSelectedRows();
            $scope.dialog.show('views/or-manage/staff-edit.html', 'staffManageEditCtrl', 'md', {
                data: function() {
                    return [1]
                }
            }, function() {})
        },
        close: function() {
            $uibModalInstance.close();
        }
    });
}]);
//收货人信息
app.controller('orderReceiverCtrl', ['$scope', 'showDetailService', 'gridService', '$compile', '$uibModalInstance', 'rowId', function($scope, showDetailService, gridService, $compile, $uibModalInstance, rowId) {
    $scope.event = {
        close: function() {
            $uibModalInstance.close();
        }
    }
    showDetailService.loadReceiverData($scope, rowId, function(data) {
        $scope.model = data.data;
    });
}]);
//买家昵称信息
app.controller('orderBuyerCtrl', ['$scope', 'showDetailService', 'gridService', '$compile', '$uibModalInstance', 'rowId', function($scope, showDetailService, gridService, $compile, $uibModalInstance, rowId) {
    $scope.event = {
        close: function() {
            $uibModalInstance.close();
        }
    }
    showDetailService.loadBuyerData($scope, rowId, function(data) {
        $scope.model = data.data;
    });
}]);
//付款时间信息
app.controller('orderPaytimeCtrl', ['$scope', 'showDetailService', 'gridService', '$compile', '$uibModalInstance', 'rowId', function($scope, showDetailService, gridService, $compile, $uibModalInstance, rowId) {
    $scope.event = {
        close: function() {
            $uibModalInstance.close();
        }
    }
    showDetailService.loadPaytimeData($scope, rowId, function(data) {
        $scope.model = data.data;
    });
}]);
//选择快递弹框
app.controller('orderExpress', ['$scope', '$compile', 'showDetailService','$uibModalInstance', 'rowId', 'buyerNick','toaster', 
    function($scope, $compile, showDetailService, $uibModalInstance, rowId, buyerNick, toaster) {
    $scope.model=[];
    $scope.selectedUnit = {};
    $scope.event = {
        close: function() {
            $uibModalInstance.close();
        },
        save: function() {
            $scope.expressModels;
            $scope.sle;
            $scope.uit;
            if($scope.sle==undefined){
                toaster.pop('warning', '', '请选择配送分部');
                return false;
            }
            if($scope.uit==undefined){
                if($scope.sle.typename.length > 1){
                    toaster.pop('warning', '', '请选择快递套餐');
                    return false;
                } else {
                    $scope.uit = $scope.sle.typename[0];
                }
            }
            toaster.pop('success', '', '保存成功');
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
    showDetailService.loadExpressData($scope, rowId, function(data) {
        $scope.expressModel = data.data;
        //默认勾选
        if (rowId.length == 1) {
            angular.forEach($scope.expressModel, function(obj, index) {
                if (obj.buyerNick == buyerNick) {
                    obj.class = 'express-active';
                    //选中对应分部
                    //选中对应套餐
                    debugger
                }
            });
        }
        //对应分部显示
        angular.forEach($scope.expressModel, function(obj, index) {
           obj.Unit = false;
           if(obj.data.length == 1){
               obj.selectedUnit = obj.data[0];
               obj.Unit = true;
           }
        });
    });
}]);
