/**
 * 平台退款单控制器
 * 
 */
app.controller('refundOrderCtrl', ['$rootScope', '$scope', 'refundOrderService', 'gridService', 'toaster', '$translate', 'dataExchange', '$window',
    function($rootScope, $scope, refundOrderService, gridService, toaster, $translate, dataExchange, $window) {
        var that = this;
        /*构造业务按钮*/
        $scope.businessBtns = [{ //由于右浮动原因，现排序大号在前
            "code": "toAlloction",
            "name": "order.assign.waiter",//分配给客服
            "index": 1002,
            "icon": "",
            "group": false
        }, {
            "code": "createReturnOrder",
            "name": "order.newReturn",//生成退货换单
            "index": 1003,
            "icon": "",
            "group": false
        }, {
            "code": "syncPlatformStatus",
            "name": "order.fromPlatformSync",//从平台同步
            "index": 1004,
            "icon": "",
            "group": false
        }, {
            "code": "detail",
            "name": "order.refundReturn",//退款退货
            "index": 1005,
            "icon": "",
            "group": false
        }, {
            "code": "assignCSRules", //CS:Customer service
            "name": "order.assign.waiterRules",//分配客服规则
            "index": 3001,
            "icon": "",
            "group": true
        }, {
            "code": "generatePBORules", //PBO:PinBackOrder
            "name": "order.newWithdrawal",//生成销退单规则
            "index": 3002,
            "icon": "",
            "group": true
        }];
        $scope.service = refundOrderService;
        gridService.gridInit($scope);

        $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "{{ 'order.goodPicture' | translate }}",
            checked: true,
            /*商品图片*/
            field: "goodPicture",
            width: 94,
            cellRenderer: function(params) {
                return "<img src='https://img.alicdn.com/bao/uploaded/i3/TB1736kHFXXXXb5apXXXXXXXXXX_!!0-item_pic.jpg_60x60q90.jpg' width='50' height='50'>";
            }
        }, {
            headerName: "{{ 'order.information.specifications' | translate }}",
            checked: true,
            /*规格*/
            field: "skuNumId",
            width: 70,
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'order.name.buyersNickname' | translate }}",
            checked: true,
            /*买家昵称*/
            field: "buyerNick",
            width: 110
        }, {
            headerName: "{{ 'order.type.afferSales' | translate }}",
            checked: true,
            /*售后类型*/
            field: "refundType",
            width: 80
        }, {
            headerName: "{{ 'order.amount.refundAmount' | translate }}",
            checked: true,
            /*退款金额*/
            field: "refundFee",
            width: 112,
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'order.refundReason' | translate }}",
            checked: true,
            /*退款原因*/
            field: "returnReason",
            width: 100
        }, {
            headerName: "{{ 'order.time.applyRefund' | translate }}",
            checked: true,
            /*申请时间*/
            field: "refundCreateTime",
            width: 125,
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'base.shop' | translate }}",
            checked: true,
            /*店铺*/
            field: "shopName",
            width: 130
        }, {
            headerName: "{{ 'order.number.platformRefund' | translate }}",
            checked: true,
            /*平台退款单号*/
            field: "refundId",
            width: 165,
            cellRenderer: function(params) {
                return "<span>" +
                    params.data.orderId +
                    "</span><br/>" + refundIdFormatter(params) +
                    "<span class='iscs-table-details' ng-click='showRefundDetail(data, $event)'>详</span><span class='iscs-table-details'>退</span>";
            }
        }, {
            headerName: "{{ 'order.number.platformTransaction' | translate }}",
            checked: true,
            /*平台交易单号*/
            field: "orderId",
            cellRenderer: function(params) {

                return "<span>" +
                    params.data.orderId +
                    "</span><br/>" + orderIdFormatter(params) +
                    "<span class='iscs-table-details' ng-click = 'showOriginOrderDetail(data,$event)'>详</span>";
            }
        }]);

        //列格式化函数
        function refundIdFormatter(params) {

            var status = "";
            var statusClass = "";
            switch (params.data.orderStatus) {
                case 100:
                    status = "待处理";
                    statusClass = "list-state iscs-blue";
                    break;
                case 200:
                    status = "处理完成";
                    statusClass = "list-state iscs-green";
                    break;
                case 300:
                    status = "已关闭";
                    statusClass = "list-state";
                default:
                    status = "待处理";
                    statusClass = "list-state iscs-blue";
                    break;
            }
            return '<span class="' + statusClass + '">' + status + '</span>';
        };

        function orderIdFormatter(params) {
            var status = "";
            var statusClass = "";
            switch (params.data.orderStatus) {
                case 100:
                    status = "未付款";
                    statusClass = "list-state";
                    break;
                case 110:
                    status = "未铺货";
                    statusClass = "list-state iscs-red";
                    break;
                case 120:
                    status = "已转正";
                    statusClass = "list-state iscs-green";
                    break;
                case 130:
                    status = "已作废";
                    statusClass = "list-state iscs-ash";
                    break;
                case 140:
                    status = "库存不足";
                    statusClass = "list-state iscs-yellow";
                    break;
                case 160:
                    status = "暂存";
                    statusClass = "list-state";
                    break;
                default:
                    status = "未付款";
                    statusClass = "list-state iscs-red";
            }

            return '<span class="' + statusClass + '">' + status + '</span>';
        };

        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            showToolPanel: false,
            headerCellRenderer: $scope.headerCellRenderer,
            onSelectionChanged: function() {},
            rowHeight: 60
        };
        $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);

        /************控制器私有方法开始********/
        /**
         * 从平台同步
         */
        that.syncPlatformStatus = function() {

            var selectedRows = $scope.gridOptions.api.getSelectedRows();

            if (selectedRows.length <= 0) {
                toaster.pop('warning', '', '请先选择需要同步的退款单');
                return;
            }

            var syncData = [];
            var syncModel = {};
            selectedRows.forEach(function(selectedRow, index) {
                syncModel.refundUkid = selectedRow.refundUkid;
                syncModel.platformId = selectedRow.platformId;
                syncData.push(syncModel);
            });

            refundOrderService.syncPlatformStatus(syncData, function(data) {
                toaster.pop('success', '', '执行成功3条，失败0条！');
            });
        }

        /**
         * 生成退换货单
         */
        that.createReturnOrder = function() {
            var selectedRows = $scope.gridOptions.api.getSelectedRows();
            if (selectedRows.length <= 0) {
                toaster.pop('warning', '', '请先选择需要生成退换货单的退款单');
                return;
            }

            refundOrderService.createReturnOrder(selectedRows, function(data) {
                toaster.pop('success', '', '执行成功3条，失败0条！');
            });
        }

        /************控制器私有方法结束********/

        var consMethods = gridService.construtor($scope);
        $scope.event = $.extend(consMethods, {
            getFilters: function() {

                var query = that.query;
                $scope.filter = [];

                var filterTemp = [{
                    field: "buyerNick",
                    compare: "equal",
                    value: query.buyerNick ?
                        query.buyerNick : "",
                    datatype: "string"
                }, {
                    field: "shopId",
                    compare: "equal",
                    value: query.shopList.selected ?
                        query.shopList.selected.id : "",
                    datatype: "num"
                }, {
                    field: "orderStatus",
                    compare: "equal",
                    value: query.orderStatusSelected.selected ?
                        query.orderStatusSelected.selected.id : "",
                    datatype: "num"
                }, {
                    field: "goodStatus",
                    compare: "equal",
                    value: query.goodStatusSelected.selected ?
                        query.goodStatusSelected.selected.id : "",
                    datatype: "num"
                }, {
                    field: "iscsReceiptStatus",
                    compare: "",
                    value: query.iscsReceiptStatusSelected.selected ?
                        query.iscsReceiptStatusSelected.selected.id : "",
                    datatype: "num"
                }, {
                    field: "refundCreateTime",
                    compare: "between",
                    value: query.refundCreateTimeSelected.selected ?
                        query.refundCreateTimeSelected.selected.minValue + "," +
                        query.refundCreateTimeSelected.selected.maxValue : "",
                    datatype: "datetime"
                }, {
                    field: "buyerReturnTime",
                    compare: "between",
                    value: query.buyerReturnTimeSelected.selected ?
                        query.buyerReturnTimeSelected.selected.minValue + "," +
                        query.buyerReturnTimeSelected.selected.maxValue : "",
                    datatype: "datetime"

                }, {
                    field: "modifyTime",
                    compare: "between",
                    value: query.modifyTimeSelected.selected ?
                        query.modifyTimeSelected.selected.minValue + "," +
                        query.modifyTimeSelected.selected.maxValue : "",
                    datatype: "datetime"
                }, {
                    field: "downTime",
                    compare: "between",
                    value: query.downTimeSelected.selected ?
                        query.downTimeSelected.selected.minValue + "," +
                        query.downTimeSelected.selected.maxValue : "",
                    datatype: "datetime"
                }];

                angular.forEach(filterTemp, function(obj, index, arr) {
                    if (obj.value && obj.value != "" && obj.value != ",") {
                        $scope.filter.push(obj)
                    }
                });
            },
            search: function() {
                console.log(angular.toJson(that.query));
                $scope.event.getFilters();
                $scope.event.loadData();
            },
            //刷新 
            refresh: function() {
                $scope.event.loadData();
            },
            detail: function() {},
            //生成退换货单
            createReturnOrder: that.createReturnOrder,
            //从平台同步
            syncPlatformStatus: that.syncPlatformStatus,
            //分配给客服
            toAlloction: function() {},
            //分配客服规则
            assignCSRules: function() {},
            //生成销退单规则
            generatePBORules: function() {}
        });

        /************开始处理查询模块********/

        //页面搜索条件对象
        that.query = {};

        //店铺数据
        that.query.shopList = {};
        $scope.shopList = {};
        $scope.shopData = [{
            id: 1,
            name: '海边的小贝壳'
        }, {
            id: 2,
            name: '数码专营店'
        }, {
            id: 3,
            name: '天猫旗舰店'
        }, {
            id: 4,
            name: '苏宁专营店'
        }, {
            id: 5,
            name: '一号店'
        }];

        //订单状态
        that.query.orderStatusSelected = {};
        $scope.orderStatusData = refundOrderService.getOrderStatusData();

        //货物状态
        that.query.goodStatusSelected = {};
        $scope.goodStatusData = refundOrderService.getGoodStatusData();

        //网仓入库状态
        that.query.iscsReceiptStatusSelected = {};
        $scope.iscsReceiptStatusData = refundOrderService.getIscsReceiptStatusData();

        //客服处理状态
        that.query.serviceStatusSelected = {};
        $scope.serviceStatusData = refundOrderService.getServiceStatusData();

        //查询时间段选择
        $scope.queryByTimeData = refundOrderService.getQueryByTimeData();
        var defaultTimeSelected = $scope.queryByTimeData[0];
        that.query.refundCreateTimeSelected = {}; //退款申请时间
        that.query.refundCreateTimeSelected.selected = defaultTimeSelected;
        that.query.buyerReturnTimeSelected = {}; //买家寄回时间
        that.query.buyerReturnTimeSelected.selected = defaultTimeSelected;
        that.query.modifyTimeSelected = {}; //修改时间
        that.query.modifyTimeSelected.selected = defaultTimeSelected;
        that.query.downTimeSelected = {}; //下载时间
        that.query.downTimeSelected.selected = defaultTimeSelected;
        that.query.modifyTimeSelected = {}; //更新时间
        that.query.modifyTimeSelected.selected = defaultTimeSelected;

        /************查询模块处理完毕********/

        /**
         * 退款详情页面
         **/
        $scope.showRefundDetail = function(data, evt) {
            $scope.dialog.show('views/refund-order/refund-order-detail.html',
                'refundOrderDetailCtrl',
                '', {
                    refundOrderDetailRowData: function() {
                        return data;
                    }
                },
                function() {})
        };

        /**
         * 订单详情页面
         */
        $scope.showOriginOrderDetail = function(data, evt) {
            $scope.dialog.show('views/origin-order/order-detail.html', 'orderDetailCtrl', 'lg', {
                rowId: function() {
                    return data.orderId;
                }
            }, function() {})
        };
    }
]);

/**
 * 平台退款单详情控制器
 * */
app.controller('refundOrderDetailCtrl', ['$scope',
    'refundOrderDetailService',
    'gridService',
    '$uibModalInstance',
    'refundOrderDetailRowData',

    function($scope,
        refundOrderDetailService,
        gridService,
        $uibModalInstance,
        refundOrderDetailRowData) {

        $scope.refundOrderDetail = refundOrderDetailRowData;
        $scope.service = refundOrderDetailService;
        gridService.gridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "{{ 'order.time.operation' | translate }}",
            /*操作时间*/
            field: "operateTime",
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'order.operator' | translate }}",
            /*操作人*/
            field: "operateUserName"
        }, {
            headerName: "{{ 'order.operationType' | translate }}",
            /*操作类型*/
            field: "operatioType",
            sort: "desc",
            unSortIcon: true
        }, {
            headerName: "{{ 'order.operationDetail' | translate }}",
            /*操作详情*/
            field: "operateInfo",
        }]);

        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            showToolPanel: false,
            headerCellRenderer: $scope.headerCellRenderer
        };

        $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
        var consMethods = gridService.construtor($scope);
        $scope.event = $.extend(consMethods, {

            close: function() {
                $uibModalInstance.close();
            }
        });
    }
]);
