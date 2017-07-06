//打印模板

app.controller('printCtrl', ['$rootScope', '$scope', 'gridService', 'printService', '$window', 'toaster',

    function($rootScope, $scope, gridService, printService, $window, toaster) {

        $scope.service = printService;
        gridService.gridInit($scope);

        $scope.columnDefs = $scope.columnDefs.concat([{
            headerName: "{{ 'print.operation' | translate }}",
            /*操作*/
            checked: true,
            field: "id",
            width: 120,
            headerTooltip: "设计或编辑模板",
            cellRenderer: function(params) {

                params.$scope.designTemplate = designTemplate;
                return '<a ng-click="designTemplate(\'' + params.data.templateId + '\')">设计</a>' +
                    '  <a href="" ng-click="showPrintEditDetail(data,$event)">编辑</a>';
            }
        }, {
            headerName: "{{ 'print.templateId' | translate }}",
            /*模板ID*/
            checked: true,
            field: "templateId",
            width: 200,
            editable: true,
            headerTooltip: "模板ID",
            filter: 'string'
        }, {
            headerName: "{{ 'print.templateName' | translate }}",
            /*模板名称*/
            checked: true,
            field: "templateName",
            width: 200,
            editable: true,
            headerTooltip: "模板名称"
        }, {
            headerName: "{{ 'print.templateType' | translate }}",
            /*模板类型*/
            checked: true,
            field: "templateType",
            width: 100
        }, {
            headerName: "{{ 'print.pageWidth' | translate }}",
            /*纸张宽*/
            checked: true,
            field: "pageWidth",
            width: 90,
            headerTooltip: "打印纸张的宽度"
        }, {
            headerName: "{{ 'print.pageHeight' | translate }}",
            /*纸张高*/
            checked: true,
            field: "pageHeight",
            width: 90,
            headerTooltip: "打印纸张的高度"
        }, {
            headerName: "{{ 'print.pageType' | translate }}",
            /*纸张类型*/
            checked: true,
            field: "pageType",
            width: 100,
            headerTooltip: "纸张类型"
        }, {
            headerName: "{{ 'print.updateDate' | translate }}",
            /*最后修改时间*/
            checked: true,
            field: "updateDate",
            width: 150,
            headerTooltip: "最后修改时间"
        }, {
            headerName: "{{ 'printer.startOrStop' | translate }}",
            /*启用/停用*/
            checked: true,
            field: "isUse",
            width: 90,
            headerTooltip: "启用或停用模板",
            cellRenderer: function(params) {
                params.$scope.isUseClick = isUseClick;
                return '<label  class="switch switch-sm"><input type="checkbox" ng-model="data.isUse" >' +
                    '<span ng-click="isUseClick(data)" ></span></label>';
            }
        }]);

        /**
         * 启用/停用模板
         */
        function isUseClick(data) {

            //调用后端接口更新模板isUse状态
            console.log(data);
        }

        /**
         * 打开模板设计窗口
         */
        function designTemplate(templateId) {
            $window.open('views/print/print-design.html?templateId=' + templateId + '&templateType=orderItems');
        }

        /**
         * 模板编辑页面
         */
        $scope.showPrintEditDetail = function(data, evt) {
            $scope.dialog.show('views/print/print-edit.html', 'printEditCtrl', 'sm', {
                template: function() {
                    return data;
                }
            }, function(result) {
                if (result == "save") {
                    $scope.event.refresh();
                }
            })
        };
        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            showToolPanel: false,
            headerCellRenderer: $scope.headerCellRenderer,
            onSelectionChanged: function() {}
        };
        $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
        var consMethods = gridService.construtor($scope);
        $scope.event = $.extend(consMethods, {
            add: function() { //新增模板
                $scope.dialog.show('views/print/print-edit.html', 'printEditCtrl', 'sm', {
                    template: function() {
                        return {};
                    }
                }, function(result) {
                    if (result == "save") {
                        $scope.event.refresh();
                    }
                })
            },
            delete: function() { //删除模板
                var selectedRows = $scope.gridOptions.api.getSelectedRows();

                if (selectedRows.length <= 0) {
                    toaster.pop('warning', '', '请先选择需要删除的模板');
                    return;
                }

                var deleteData = {};

                selectedRows.forEach(function(selectedRow, index) {
                    deleteData.templateId = selectedRow.templateId;
                    deleteData.stockId = selectedRow.stockId;
                });

                printService.deleteTemplate(deleteData, function(response) {
                    if (response.errorCode == '0') {

                        toaster.pop('success', '', '删除成功！');
                        $scope.event.refresh();
                    } else {

                        toaster.pop('error', '', '删除模板出错,错误信息:' + response.errorMsg);
                    }
                });
            },
            refresh: function() {
                $scope.event.loadData();
            }
        });

    }
]);

//打印模板编辑页面
app.controller('printEditCtrl', ['$scope', '$uibModalInstance', 'template', 'printService', '$filter', 'toaster',

    function($scope, $uibModalInstance, template, printService, $filter, toaster) {

        //处理模板类型
        $scope.templateType = {};
        $scope.templateTypeList = [{
            id: 1,
            name: '电子面单'
        }, {
            id: 2,
            name: '纸质面单'
        }, {
            id: 3,
            name: '商品清单',
        }, {
            id: 4,
            name: '贺卡'
        }, {
            id: 5,
            name: '条形码'
        }];

        $scope.templateType.selected = $filter('filter')($scope.templateTypeList, function(item) {
            return item.name == template.templateType;
        }, true)[0]; //默认选中项

        //处理运输单位
        $scope.transferUnit = {};
        $scope.transferUnitList = [{
            id: 1,
            name: '申通速递'
        }, {
            id: 2,
            name: '圆通速递'
        }, {
            id: 3,
            name: '中通速递'
        }, {
            id: 4,
            name: '顺丰速递'
        }, {
            id: 5,
            name: '汇通速递'
        }]

        $scope.transferUnit.selected = $filter('filter')($scope.transferUnitList, function(item) {
            return item.id == template.transporterId;
        }, true)[0];

        //处理服务产品
        $scope.transporterService = {};
        $scope.transporterServiceList = [{
            id: 1,
            name: "无"
        }, {
            id: 2,
            name: "经济快递"
        }, {
            id: 3,
            name: "标准快递"
        }];

        $scope.title = "编辑模板";
        if (!template.templateName) {
            $scope.title = "新增模板";
            $scope.template = {
                templateId: "0",
                templateType: "",
                templateName: "",
                stockId: "0",
                shopIds: "0",
                isUse: "0",
                pageWidth: 150,
                pageHeight: 250,
                pageTop: 0,
                pageLeft: 0,
                orient: 1
            };
        } else {
            $scope.template = template;
        }

        $scope.closeDialog = function() {

            $uibModalInstance.close('cancel');
        }

        //保存模板按钮
        $scope.saveTemplate = function() {
            delete $scope.template.dmPrinterDetailTemplate;
            delete $scope.template.createDate;
            delete $scope.template.updateDate;
            $scope.template.templateType = $scope.templateType.selected ? $scope.templateType.selected.name : '';
            $scope.template.transporterId = $scope.transferUnit.selected ? $scope.transferUnit.selected.id : 0;
            //$scope.template.serviceId = $scope.transporterService.selected||$scope.transporterService.selected.id;
            printService.editTemplate(angular.toJson($scope.template), function(data) {

                toaster.pop('success', '', '保存成功!');
                $uibModalInstance.close('save');
            });
        };
    }
]);