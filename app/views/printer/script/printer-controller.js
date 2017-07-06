//打印机设置
app.controller('printerCtrl', ['$scope', '$rootScope', 'gridService', 'printerService', '$window', 'toaster',
    function($scope, $rootScope, gridService, printerService, $window, toaster) {

        $scope.service = printerService;
        gridService.gridInit($scope);

        $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "{{ 'printer.number' | translate }}",
            /*打印机编号*/
            checked: true,
            field: "printerName",
            width: 200,
            filter: 'string'
        }, {
            headerName: "{{ 'printer.billType' | translate }}",
            /*打印单据类型*/
            checked: true,
            field: "printType",
            width: 200,
        }, {
            headerName: "{{ 'printer.trafficUnit' | translate }}",
            /*运输单位*/
            checked: true,
            field: "transporterUnitId",
            width: 150,
            cellRenderer: function(params) {
                sArray = params.data.transporterUnitId.split(',');
                names = [];
                for (i = 0; i < sArray.length; i++) {
                switch (sArray[i]) {
                    case "1":
                        name = "申通";
                        break;
                    case "2":
                        name = "圆通";
                        break;
                    case "3":
                        name = "顺丰";
                        break;
                    case "4":
                        name = "天天";
                        break;
                    case "5":
                        name = "韵达";
                        break;
                };
                names.push(name);
            }
                return '<span >' + names + '</span>';

            }
        }, {
            headerName: "{{ 'printer.operationArea' | translate }}",
            /*作业区*/
            checked: true,
            field: "workspace",
            width: 100
        }, {
            headerName: "{{ 'printer.ip' | translate }}",
            /*IP*/
            checked: true,
            field: "bindIp",
            width: 180
        }, {
            headerName: "{{ 'printer.port' | translate }}",
            /*端口*/
            checked: true,
            field: "bindPort",
            width: 80
        }, {
            headerName: "{{ 'printer.printType' | translate }}",
            /*前后置打印*/
            checked: true,
            field: "frontBackPrinting",
            width: 140
        }, {
            headerName: "{{ 'printer.startOrStop' | translate }}",
            /*启用/停用*/
            checked: true,
            field: "isUse",
            width: 90,
            cellRenderer: function(params) {
                params.$scope.isUseClick = isUseClick;
                return '<label  class="switch switch-sm"><input type="checkbox" ng-model="data.isUse" >' +
                    '<span ng-click="isUseClick(data)" ></span></label>';
            }
        }]);
        //表配置
         $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            showToolPanel: false,
            headerCellRenderer: $scope.headerCellRenderer,
            onSelectionChanged: function() {}
        };
        //启用或停用模板
        function isUseClick(data) {
            //调用后端接口更新模板isUse状态
            console.log(data);
        }

        $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
        var consMethods = gridService.construtor($scope);
        $scope.event = $.extend(consMethods, {
            add: function() {
                $scope.dialog.show('views/printer/edit.html', 'printerEditCtrl', 'sm', {
                    alldata: function() {
                        return null;
                    }
                }, function(result) {
                    if (result == 'save') {
                        toaster.pop('success', '', '添加成功！');
                        $scope.event.refresh();
                    }
                });
            },
            edit: function() {
                var datas = $scope.gridOptions.api.getSelectedRows();
                if (datas.length == 1) {
                    $scope.data = datas[0];
                    if ($scope.data) {
                        $scope.dialog.show('views/printer/edit.html', 'printerEditCtrl', 'sm', {
                            alldata: function() {
                                return $scope.data;
                            }
                        }, function(result) {
                            if (result == 'save') {
                                toaster.pop('success', '', '编辑成功！');
                                $scope.event.refresh();
                            }
                        });
                    } else {
                        toaster.pop('warning', '', '请选择要编辑的内容');
                    };

                } else {
                    toaster.pop('warning', '', '只能选一条编辑');
                };
            },
            delete:function(){
                var selectedRows = $scope.gridOptions.api.getSelectedRows();
                if (selectedRows.length <= 0) {
                    toaster.pop('warning', '', '请先选择需要删除的内容');
                    return;
                }
                var deleteData = {};
                selectedRows.forEach(function(selectedRow, index) {
                    deleteData.deviceUkid = selectedRow.deviceUkid;
                });
                //去后台请求
                printerService.deleted(deleteData, function(response) {
                    if (response.errorCode == '0') {
                        toaster.pop('success', '', '删除成功！');
                        $scope.event.refresh();
                    } else {
                        toaster.pop('error', '', '删除出错,错误信息:' + response.errorMsg);
                    }
                });
            },
            refresh: function() {
                $scope.event.loadData();
            }
        });

    }
]);

//编辑-新增
app.controller('printerEditCtrl', ['$scope', '$uibModalInstance', 'alldata', 'printerService', 'printerServiceRefund',
    function($scope, $uibModalInstance, alldata, printerService, printerServiceRefund) {
        $scope.query = {};
        $scope.alldata = alldata;
        //打印机编号
        $scope.query.printerName = {};
        $scope.printerId = printerServiceRefund.getprinterId();

        //打印机类型
        $scope.query.printType = {};
        $scope.printType = printerServiceRefund.getprintType();

        //运输单位
        $scope.transporterUnitId = {};
        $scope.transporter = printerServiceRefund.gettransporter();

        //作业区
        $scope.query.workspace = {};
        $scope.workspace = printerServiceRefund.getworkspace();

        //前/后置打印
        $scope.query.frontBackPrinting = {};
        $scope.frontBack = printerServiceRefund.getfrontBack();

        if (alldata) { /*编辑打印机配置*/
            sArray = alldata.transporterUnitId.split(',');
            aArray = [];
            for (i = 0; i < sArray.length; i++) {
                aArray.push(parseInt(sArray[i]));
            }
            $scope.query.printerName.selected = alldata.printerName;
            $scope.query.printType.selected = alldata.printType;
            $scope.query.transporterUnitId = aArray;
            $scope.query.workspace.selected = alldata.workspace;
            $scope.query.frontBackPrinting.selected = alldata.frontBackPrinting;
            $scope.query.deviceUkid = alldata.deviceUkid;
        }
        $scope.event = {
            save: function() {
                $scope.alldata = {
                    "deviceUkid": $scope.query.deviceUkid,
                    "printerName": $scope.query.printerName.selected,
                    "stockId": "",
                    "printType": $scope.query.printType.selected,
                    "transporterUnitId": $scope.query.transporterUnitId.toString(),
                    "workspace": $scope.query.workspace.selected,
                    "isEnabled": "0",
                    "printerStatus": "",
                    "frontBackPrinting": $scope.query.frontBackPrinting.selected,
                    "createDate": "",
                    "dateUpdated":  new Date().Format("yyyy-MM-dd hh:mm:ss"),
                    "createUserId": "",
                    "shopIds": "",
                    "shopNames": ""
                };
                printerService.edit(angular.toJson($scope.alldata), function(data) {
                    $uibModalInstance.close('save');
                });
            },
            close: function() {
                $uibModalInstance.close('cancel');
            }
        };

    }
]);