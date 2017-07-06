/**
 * 仓库需求预测
 */
app.controller('demandForecastCtrl', ['$scope', 'demandForecastService', 'toaster',
    function($scope, demandForecastService, toaster) {

        var vm = $scope.vm = {};
        $scope.sort = "createTime&asc";
        //需方选择
        vm.choose = {};
        vm.choose.demandSideSelected = {};
        vm.choose.statusSelected = {}; //状态选择
        vm.dropListData = {};
        vm.dropListData.status = [{
            'code': '30',
            'name': '所有'
        }, {
            'code': '10',
            'name': '未审核'
        }, {
            'code': '20',
            'name': '已审核'
        }];

        //设置默认选择状态
        vm.choose.statusSelected.selected = {
            'code': '30',
            'name': '所有'
        };

        //分页设置
        $scope.totalItems = 7;
        $scope.currentPage = 1;
        $scope.maxSize = 10; //分页条最大显示分页数

        //查询对象 默认不显示过期需求
        $scope.filter = [{
            field: "endTime",
            compare: "greater",
            value: new Date().Format('yyyy-MM-dd hh:mm:ss'),
            datatype: "datetime"
        }];

        //覆盖分页全局配置
        $scope.page = {
            pageSize: [{
                name: '7',
                id: 1
            }, {
                name: '15',
                id: 2
            }, {
                name: '23',
                id: 3
            }],
            selectedPageSize: {
                name: 7,
                id: 1
            }
        };

        $scope.onPageSizeChanged = function(data) {
            $scope.currentPage = 1;
            vm.search();
        };
        $scope.pageChanged = function() {
            //$scope.currentPage;
            vm.search();
        };



        //处理查询条件
        vm.getFilters = function() {

            $scope.filter = [];

            var filterTemp = [{
                field: "endTime",
                compare: vm.isExpire ? '' : 'greater',
                value: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                datatype: "datetime"
            }, {
                field: "statusCode",
                compare: vm.choose.statusSelected.selected && vm.choose.statusSelected.selected.code == '30' ? "unequal" : "equal",
                value: vm.choose.statusSelected.selected ?
                    vm.choose.statusSelected.selected.code : "",
                datatype: "string"
            }, {
                field: "pptUkid",
                compare: "equal",
                value: vm.choose.demandSideSelected.selected ?
                    vm.choose.demandSideSelected.selected.code : "",
                datatype: "string"
            }];

            angular.forEach(filterTemp, function(obj, index, arr) {
                if (obj.compare != "" && obj.value && obj.value != "" && obj.value != ",") {
                    $scope.filter.push(obj)
                }
            });
        }

        //获取列表页数据
        vm.search = function() {
            
            vm.getFilters();
            demandForecastService.getListData($scope, {
                currentPage: $scope.currentPage,
                sort: 'createTime&desc',
                pageSize: $scope.page.selectedPageSize.name,
                filter: $scope.filter
            }, function(data) {
                vm.items = data.data.contentList;
                $scope.totalItems = data.data.allNum;
                angular.forEach(vm.items, function(item, index, arr) {
                    item.isExpire = false; //需求是否过期
                    item.showClass = 'forecast-unchecked';
                    item.showName = '未审核';
                    if (item.statusCode == '20') {
                        item.showClass = 'forecast-checked';
                        item.showName = '已审核';
                    }
                    if (Date.parse(item.endTime.replace(/-/g, "/")) < new Date()) {
                        item.isExpire = true;
                        item.showClass = 'forecast-expire';
                        item.showName = '已过期';
                    }
                });
            });
        }

        //获取需方数据
        demandForecastService.getDemandUnitListData(function(data) {
            vm.dropListData.demandUnit = data.data;
            //设置默认选择的需方
            vm.choose.demandSideSelected.selected = data.data[0];
            vm.search();
        });

        /**
         * 显示仓库需求预测详情页面
         */
        vm.showDetail = function(demandForecastUkid) {

            $scope.dialog.show('views/demand-forecast/detail.html',
                'demandForecastDetailCtrl',
                '800', {
                    demandForecastUkid: function() {
                        return demandForecastUkid;
                    }
                },
                function() {})
        };

        /**
         * 删除仓库需求预测详情
         */
        vm.showDelete = function(item) {
            $scope.dialog.show('views/demand-forecast/delete.html',
                'demandForecastDeleteCtrl',
                'sm', {
                    demandForecast: function() {
                        return item;
                    }
                },
                function(result) {
                    if (result == 'success') {
                        vm.search();
                    }
                });
        }

        /**
         * 操作仓库需求预测详情状态
         * delete  删除
         * check 审核
         */
        vm.showUpdate = function(item, updateType) {

            if (item.isExpire) {
                if (updateType == 'check') {
                    toaster.pop('error', '', '需求已过期,不允许审核');
                } else {
                    toaster.pop('error', '', '需求已过期,不允许删除');
                }
                return;
            }
            if (item.statusCode == '20') {
                if (updateType == 'check') {
                    toaster.pop('error', '', '状态为已审核,不允许再审核');
                } else if (updateType == 'delete') {
                    toaster.pop('error', '', '状态为已审核,不允许删除');
                }
                return;
            }
            $scope.dialog.show('views/demand-forecast/update.html',
                'demandForecastUpdateCtrl',
                'sm', {
                    demandForecast: function() {
                        return {
                            demandForecastUkid: item.demandForecastUkid,
                            updateType: updateType
                        }
                    }
                },
                function(result) {
                    if (result == 'success') {
                        vm.search();
                    }
                });
        }

        /**
         * 显示仓库需求预测新增页面
         */
        vm.showAdd = function() {
            $scope.dialog.show('views/demand-forecast/edit.html',
                'demandForecastEditCtrl',
                '800', {
                    refundOrderDetailRowData: function() {
                        return {};
                    }
                },
                function(result) {
                    if (result == 'save') {
                        vm.search();
                    }
                })
        }
    }
]);

/**
 * 仓库需求预测详情页面
 */
app.controller('demandForecastDetailCtrl', ['$scope', '$uibModalInstance', 'gridService', 'demandForecastService', 'demandForecastUkid',
    function($scope, $uibModalInstance, gridService, demandForecastService, demandForecastUkid) {

        var vm = $scope.vm = {};
        // $scope.service = demandForecastService;
        // gridService.gridInit($scope);
        //分页设置
        $scope.totalItems = 7;
        vm.currentPage = 1;
        $scope.maxSize = 10; //分页条最大显示分页数
        $scope.filter = [];
        $scope.filter.push({
            field: "demand_forecast_ukid",
            compare: "equal",
            value: demandForecastUkid,
            datatype: "string"
        });
        $scope.sort = "demand_forecast_detail_ukid&asc";

        $scope.onPageSizeChanged = function(data) {
            vm.currentPage = 1;
            vm.search();
        };
        $scope.pageChanged = function() {
            vm.search();
        };

        // $scope.columnDefs = $scope.columnDefs.concat([{
        //     headerName: "商品编码",
        //     field: "itemCode",
        //     checked: true,
        //     sort: "desc",
        //     width: 250,
        //     unSortIcon: true
        // }, {
        //     headerName: "数量",
        //     field: "itemNum",
        //     checked: true,
        //     width: 100,
        //     unSortIcon: true
        // }]);

        // $scope.gridOptions = {
        //     columnDefs: $scope.columnDefs,
        //     showToolPanel: false
        // };
        // $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);

        // var consMethods = gridService.construtor($scope);
        $scope.event = {
            close: function() {
                $uibModalInstance.close();
            }
        };
        vm.search = function() {
            demandForecastService.getItemData($scope, {
                currentPage: vm.currentPage,
                sort: $scope.sort,
                pageSize: $scope.page.selectedPageSize.name,
                filter: $scope.filter
            }, function(data) {
                vm.items = data.data.contentList;
                $scope.totalItems = data.data.allNum;
            });
        }
        vm.search();
        //获取详情页面数据
        demandForecastService.getDetailData(demandForecastUkid, function(data) {
            vm.model = data.data;
            if (!angular.isUndefined(vm.model.reasonRemark)) {
                vm.model.reasonName = vm.model.reasonName.replace('其它原因', '其它原因:' + vm.model.reasonRemark);
            }
        });
    }
]);

/**
 * 仓库需求预测新增编辑页面
 */
app.controller('demandForecastEditCtrl', ['$scope', '$uibModalInstance', 'toaster', 'demandForecastService',

    function($scope, $uibModalInstance, toaster, demandForecastService) {

        var vm = $scope.vm = {};
        vm.nowDate = new Date();
        //前端提示对象
        var notice = {};
        notice.success = true;
        notice.msg = "";

        vm.dropListData = {};

        //页面所有选择对象
        vm.choose = {};
        vm.model = {};
        vm.model.demandForecastUkid = 0;
        vm.model.containDailyDemandShow = true;

        //新增页面商品对象
        vm.products = [];
        vm.product = {};

        //获取页面所有下拉框数据源
        demandForecastService.getComBoxListData({
            'codeType': ['BaPlatform', 'DfReason', 'DfOperationCode']
        }, function(data) {
            vm.dropListData.BaPlatform = data.data.BaPlatform;
            vm.dropListData.DfReason = data.data.DfReason;
            vm.dropListData.DfOperationCode = data.data.DfOperationCode;
        });

        //获取需方数据
        demandForecastService.getDemandUnitListData(function(data) {
            vm.dropListData.demandUnit = data.data;
        });

        //获取品类数据
        demandForecastService.getCategoryListData(function(data) {
            vm.dropListData.productCategory = data.data.data;
        });

        //添加商品
        vm.addProduct = function() {

            //初始化提示对象
            notice.success = true;
            notice.msg = "";

            if (angular.isUndefined(vm.model.pptUkid)) {
                notice.success = false;
                notice.msg = "请先选择需方";
            }

            if (angular.isUndefined(vm.product.itemCode)) {
                notice.success = false;
                notice.msg = "商品编码不能为空";
            }

            if (angular.isUndefined(vm.product.itemNum) || vm.product.itemNum <= 0) {
                notice.success = false;
                notice.msg = "商品数量不能小于0";
            }

            angular.forEach(vm.products, function(data, index, array) {
                if (vm.product.itemCode == data.itemCode) {
                    notice.success = false;
                    notice.msg = '商品' + vm.product.itemCode + '已存在';
                    return;
                }
            });


            if (!notice.success) {
                toaster.pop('error', '', notice.msg);
                return;
            }
            var product = {};
            product.demandForecastDetailUkid = 0;
            product.itemUkid = "23685555";
            product.itemCode = vm.product.itemCode; //qz2906969110
            product.itemNum = vm.product.itemNum;
            product.pptUkid = vm.model.pptUkid;//商品带上需方ukid

            //调用服务端接口验证商品
            demandForecastService.getItemUkid(product.itemCode, vm.model.pptUkid, function(response) {
                if (response.data.code == '0') {
                    if (response.data.data != '') {
                        product.itemUkid = response.data.data;
                        vm.products.push(product);
                        vm.product = {}; //清除商品
                    } else {
                        toaster.pop('error', '', '商品编码与店铺不匹配，添加失败');
                    }
                } else {
                    toaster.pop('error', '', '商品编码与店铺不匹配，添加失败');
                }
            });
        }

        //显示隐藏
        $scope.inputcodes = function(evn, product) {
            product.inputcode = true;
        }
        $scope.inputnums = function(evn, product) {
            product.inputnum = true;
        }

        //input隐藏
        $scope.inputblur = function($event, product) {

            //调用服务端验证商品
            demandForecastService.getItemUkid(product.itemCode, vm.model.pptUkid, function(response) {
                if (response.data.code == '0') {
                    if (response.data.data != '') {
                        product.itemUkid = response.data.data;
                        vm.products.push(product);
                        product.inputcode = false;
                    } else {
                        toaster.pop('error', '', '商品编码与店铺不匹配，添加失败');
                    }
                } else {
                    toaster.pop('error', '', '商品编码与店铺不匹配，添加失败');
                }
            });
        }

        $scope.inputnumblur = function($event, product) {

            if (angular.isUndefined(product.itemNum) || product.itemNum <= 0) {
                toaster.pop('error', '', '商品数量不能小于0');
                return false;
            }

            product.inputnum = false;
        }

        //删除商品
        vm.removeProduct = function(product) {

            angular.forEach(vm.products, function(data, index, array) {
                if (product.itemCode == data.itemCode) {
                    vm.products.shift();
                }
            });
        }

        //快捷选择天数
        vm.addDay = function(num) {
         
            if (vm.model.startTime.length == "") {
                toaster.pop('error', '', '请先设置开始时间');
                return;
            }
            vm.model.endTime = new Date(vm.model.startTime).addDate('D', num);
        }

        //页面所有下拉选择事件
        //目前考虑使用隐藏域 这样可以使用angular表单验证功能
        vm.selectedEvent = function(item, model, type) {

            switch (type) {
                case "platform":
                    vm.model.platformId = item.code;
                    vm.model.platformName = item.name;
                    break;
                case "operation":
                    vm.model.operationCode = item.code;
                    vm.model.operationName = item.name;
                    break;
                case "demandSide":
                    //切换需方时 若清空商品需要先提示

                    if (vm.model.pptUkid != undefined && vm.model.pptUkid != item.code) {
                        if (vm.products.length > 0) {
                            toaster.pop('info', '', '请先清空详细需求中商品');
                            //还原选中项
                            vm.choose.demandSideSelected.selected = {
                                'name': vm.model.pptName,
                                'code': vm.model.pptUkid
                            };
                            break;
                            // vm.products = [];
                        }
                    }
                    vm.model.pptUkid = item.code;
                    vm.model.pptName = item.name;
                    break;
                case "category":
                    vm.model.categoryUkid = item.code;
                    vm.model.categoryName = item.name;
                    break;
            }
        }

        //保存按钮
        vm.save = function(demandForecastForm) {

            //初始化提示对象
            notice.success = true;
            notice.msg = "";

            //处理验证项目
            if (vm.model.demandForecastName == undefined) {
                notice.success = false;
                notice.msg = "名称不能为空";
            } else if (vm.model.demandForecastName.length > 10) {
                notice.success = false;
                notice.msg = "名称不能超过10个字符";
            } else if (vm.model.pptUkid == undefined) {
                notice.success = false;
                notice.msg = "请先选择需方";
            } else if (vm.model.orderQty == undefined) {
                notice.success = false;
                notice.msg = "请输入单量";
            } else if (vm.model.operationCode == undefined) {
                notice.success = false;
                notice.msg = "请先选择作业";
            } else if (vm.model.startTime == '') {
                notice.success = false;
                notice.msg = "开始日期不能为空";
            } else if (vm.model.endTime == '') {
                notice.success = false;
                notice.msg = "结束日期不能为空";
            } else if (new Date(vm.model.startTime) > new Date(vm.model.endTime)) {
                notice.success = false;
                notice.msg = "结束日期不小于开始日期";
            } else if (new Date((new Date()).Format("yyyy-MM-dd")) > new Date(vm.model.startTime)) {
                notice.success = false;
                notice.msg = "开始日期不能小于当前日期";
            } else if (vm.model.reasonRemark != undefined && vm.model.reasonRemark.length > 10) {
                notice.success = false;
                notice.msg = "其他原因不能超过10个字符";
            } else if (!angular.isUndefined(vm.model.itemNum) && vm.model.itemNum > 0 && vm.products.length) {
                //验证数量 商品明细数量纸盒不能大于需求总数量
                var itemNumTemp = vm.model.itemNum;
                angular.forEach(vm.products, function(data, index, array) {
                    itemNumTemp = itemNumTemp - data.itemNum;
                });

                if (itemNumTemp < 0) {
                    notice.success = false;
                    notice.msg = "详细需求总量不能大于总需求数量";
                }
            }

            if (!notice.success) {
                toaster.pop('error', '', notice.msg);
                return;
            }

            var result = new Date(vm.model.startTime) >= new Date(vm.model.endTime);

            //处理原因选项
            var reasonCodeArray = [];
            angular.forEach(vm.dropListData.DfReason, function(data, index, array) {
                if (data.choose) {
                    reasonCodeArray.push(data.code);
                }
            });

            vm.model.reasonCode = reasonCodeArray.join(',');
            // vm.model.startTime = new Date(vm.model.startTime).Format('yyyy-MM-dd hh:mm:ss');
            // vm.model.endTime = new Date(vm.model.endTime).Format('yyyy-MM-dd hh:mm:ss');
            vm.model.startTime = vm.model.startTime + " 00:00:00";
            vm.model.endTime = vm.model.endTime + " 00:00:00";
            vm.model.containDailyDemandShow == true ? vm.model.containDailyDemand = 1 : vm.model.containDailyDemand = 0;
            vm.model.statusCode = "10";
            vm.model.statusName = "未审核";
            vm.model.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
            vm.model.createUserUkid = '002381';
            vm.model.details = vm.products;
            demandForecastService.editData(JSON.stringify(vm.model), function(data) {
                if (data.code == "0") {
                    toaster.pop('success', '', '保存成功!');
                    $uibModalInstance.close('save');
                } else {
                    toaster.pop('error', '', '保存失败!' + data.msg);
                }
            });
        };

        //处理原因输入框的显示与隐藏
        vm.showReasonInput = function(reason) {

            if (reason.name == '其它原因') {
                vm.isShowReasonInput = reason.choose;
            }
        }

        //检测结束时间是否小于开始时间
        $scope.$watch('vm.model.endTime', function(newVal, oldVal) {
            if (newVal != oldVal && vm.model.startTime && new Date(vm.model.startTime) > new Date(newVal)) {
                toaster.pop('error', '', '结束日期不能小于开始日期');
                vm.model.endTime = oldVal;
            }
        });
        $scope.$watch('vm.model.startTime', function(newVal, oldVal) {
            if (newVal != oldVal && vm.model.endTime && new Date(newVal) > new Date(vm.model.endTime)) {
                toaster.pop('error', '', '结束日期不能小于开始日期');
                vm.model.startTime = oldVal;
            }
        });

        //需方选择
        vm.choose.demandSideSelected = {};
        //平台选择
        vm.choose.platformSelected = {};
        //品类选择
        vm.choose.categorySelected = {};
        //作业选择
        vm.choose.operationSelected = {};

        $scope.event = {
            close: function() {
                $uibModalInstance.close();
            }
        };
        vm.test = function() {
            console.log(vm.model.containDailyDemand);
        };
    }
]);

//仓库需求预测删除控制器提示页面
app.controller('demandForecastUpdateCtrl', ['$scope', '$uibModalInstance', 'demandForecastService', 'demandForecast', 'toaster',
    function($scope, $uibModalInstance, demandForecastService, demandForecast, toaster) {

        $scope.updateTip = '删除';
        $scope.statusCode = '30';
        if (demandForecast.updateType == 'delete') {
            $scope.updateTip = '删除';
        } else {
            $scope.updateTip = '审核';
            $scope.statusCode = '20';
        }
        //更新预测需求状态
        $scope.Update = function() {
            demandForecastService.updateStatus({
                'demandForecastUkid': demandForecast.demandForecastUkid,
                'statusCode': $scope.statusCode
            }, function(response) {
                if (response.code == '0') {
                    toaster.pop('success', '', $scope.updateTip + '成功!');
                    $uibModalInstance.close('success');
                } else {
                    toaster.pop('error', '', $scope.updateTip + '失败!' + data.msg);
                }
            });
        };

        $scope.event = {
            close: function() {
                $uibModalInstance.close();
            }
        };
    }
]);

//预测结果报表
app.controller('demandForecastReportCtrl', ['$scope', 'httpService', 'demandForecastService', '$timeout',
    function($scope, httpService, demandForecastService, $timeout) {
        var vm = $scope.vm = {};
        vm.choose = {};
        //需方选择
        vm.choose.demandSideSelected = {};
        vm.dropListData = {};
        vm.choose.dateType = "day";
        vm.choose.numType = "orderQty";

        //获取需方数据
        demandForecastService.getDemandUnitListData(function(data) {
            vm.dropListData.demandUnit = data.data;
        });

        vm.choose.demandSideSelected.selected = {
            code: "250029",
            name: "海边小贝壳店铺"
        };
        $scope.lineConfig = {
            theme: 'iscs',
            dataLoaded: true
        };

        $scope.lineConfig.event = [{

            click: function(param) {
                console.log(param);
            }
        }];
        $scope.lineOption = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: []
            }],
            yAxis: {
                type: 'value'
            },
            dataZoom: [{
                type: 'slider',
                start: 0,
                end: 50
            }],
            series: [{
                type: "line",
                name: "单量",
                areaStyle: {
                    "normal": {}
                },
                data: []
            }],
        };
        vm.search = function() {
            // $scope.lineConfig.dataLoaded = false;
            var data = {};
            switch (vm.choose.dateType) {
                case "day":
                    data.forecastTimeType = 10;
                    break;
                case "month":
                    data.forecastTimeType = 20;
                    break;
                case "year":
                    data.forecastTimeType = 30;
                    break;
            }
            if (vm.choose.numType == 'orderQty') {
                data.forecastScaleType = 10;
            } else {
                data.forecastScaleType = 20;
            }
            data.participantUkid = vm.choose.demandSideSelected.selected.code;
            demandForecastService.getDemandForecastReportData(data, function(response) {
                $timeout(function() {
                    $scope.lineOption.dataZoom = vm.choose.dateType == 'day' ? [{
                        type: 'slider',
                        start: 0,
                        end: 50
                    }] : [];
                    $scope.lineOption.series[0].data = response.data.series[0].data;
                    $scope.lineOption.series[0].name = vm.choose.numType == 'orderQty' ? '单量' : '数量';
                    $scope.lineOption.xAxis[0].data = response.data.xAxis.data;
                    // $scope.lineConfig.dataLoaded = true;
                }, 100);
            });
        }
        vm.search();
    }
]);