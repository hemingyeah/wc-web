app.controller('capacityReportCtrl', ['$scope', 'capacityReportService', 'toaster', '$interval', function($scope, capacityReportService, toaster, $interval) {
    /*echart表格参数配置*/
    $scope.baseConfig = {
        theme: 'iscs',
        dataLoaded: true
    };
    function onClick(params) {
        console.log(params);
    };

    $scope.lineConfig = _.cloneDeep($scope.baseConfig);
    $scope.lineConfig.event = [{
        click: onClick,
        legendselectchanged: onClick
    }];
    $scope.lineOption = {
        title: {
            text: '产能报表',
            subtext: '产能预测'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["杭州仓", "深圳仓", "北京仓"]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []

        },
        yAxis: [{
            type: 'value',
            position: 0
        }],
        series: []
    };
    var initDate = (new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd"); //默认当天+1;
    var sevenDaysAfter = (new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd");
    var thirtyDaysAfter = (new Date((new Date()).getTime() + 30 * 24 * 60 * 60 * 1000)).Format("yyyy-MM-dd");
    var today = (new Date()).Format("yyyy-MM-dd");
    $scope.model = {
        search: "件",
        timeFrom: initDate,
        timeTo: initDate,
        initDate: initDate,
        today: today,
        thirtyDaysAfter: thirtyDaysAfter,
        sevenDaysAfter: sevenDaysAfter,
        switch: "seven"
    };
    $scope.$watch('model.timeTo', function(newVal, oldVal) {
        var timeSelectedTo = new Date(newVal).getTime();
        var timeSelectedFrom = new Date($scope.model.timeFrom).getTime();
        if (newVal !== oldVal) {
            if (timeSelectedTo < timeSelectedFrom) {
                toaster.pop('warning', '', '开始时间不能大于结束时间');

            } else if (timeSelectedTo - timeSelectedFrom > (30 - 1) * 24 * 3600 * 1000) {
                toaster.pop('warning', '', '无法选择30天以外的天数');
            }
        }

    })
    $scope.$watch('model.timeFrom', function(newVal, oldVal) {
        var timeSelectedTo = new Date($scope.model.timeTo).getTime();
        var timeSelectedFrom = new Date(newVal).getTime();
        if (newVal !== oldVal) {
            if (timeSelectedTo < timeSelectedFrom) {
                toaster.pop('warning', '', '开始时间不能大于结束时间');

            } else if (timeSelectedTo - timeSelectedFrom > (30 - 1) * 24 * 3600 * 1000) {
                toaster.pop('warning', '', '无法选择30天以外的天数');
            }
        }

    })
    $scope.event = {
        /**
         * @param  {[type]}
         * @return {[type]}
         * 获取7天预测产能
         */
        getCapacityInSeven: function(evt) {
            $scope.model.timeFrom = $scope.model.initDate;
            $scope.model.timeTo = $scope.model.sevenDaysAfter;
            $scope.model.search = "件"; //默认件数
            $scope.model.switch = "seven";
            $(evt.target).siblings().removeClass('btn-info');
            $(evt.target).addClass('btn-info');
            capacityReportService.loadData7($scope, $scope.model, function(data) {
                $scope.lineOption.series = []; //还原初始值
                if ($scope.lineOption.xAxis.data) {
                    $scope.lineOption.xAxis.data = [];
                }
                data.data.series.forEach(function(obj, index) {
                    obj.type = "line";
                    obj.areaStyle = { normal: {} };
                    obj.stack = "总量";
                    $scope.lineOption.series.push(obj);
                });
                $scope.lineOption.xAxis.data = data.data.xAxis.data;
            })
        },
        /**
         * @param  {[type]}
         * @return {[type]}
         * 获取30天预测产能
         */
        getCapacityInThirty: function(evt) {
            $scope.model.timeFrom = $scope.model.initDate;
            $scope.model.timeTo = $scope.model.thirtyDaysAfter;
            // $(evt.target).siblings().removeClass('btn-default');
            $scope.model.search = "件"; //默认件数
            $scope.model.switch = "thirty";
            $(evt.target).siblings().removeClass('btn-info');
            $(evt.target).addClass('btn-info');
            capacityReportService.loadData30($scope, $scope.model, function(data) {
                $scope.lineOption.series = []; //还原初始值
                if ($scope.lineOption.xAxis.data) {
                    $scope.lineOption.xAxis.data = [];
                }
                data.data.series.forEach(function(obj, index) {
                    obj.type = "line";
                    obj.areaStyle = { normal: {} };
                    obj.stack = "总量";
                    $scope.lineOption.series.push(obj);
                })
                $scope.lineOption.xAxis.data = data.data.xAxis.data;
            });
        },
        /**
         * @return {[type]}
         * 按单量查询产能
         */
        getCapacityReportByOrder: function() {
            if ($scope.model.switch == "seven") {
                capacityReportService.loadData7($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            } else if ($scope.model.switch == "thirty") {
                capacityReportService.loadData30($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            } else {
                capacityReportService.loadData($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            }
        },
        /**
         * @return {[type]}
         * 按订单查询产能
         */
        getCapacityReportByNum: function() {
            if ($scope.model.switch == "seven") {
                capacityReportService.loadData7($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            } else if ($scope.model.switch == "thirty") {
                capacityReportService.loadData30($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            } else {
                capacityReportService.loadData($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            }
        },
        /**
         * @return {[type]}
         * 查询产能
         * 点击查询前验证时间控件的业务逻辑
         */
        search: function() {
            $scope.model.switch = "custom";
            if ($scope.model.timeFrom && $scope.model.timeTo) {
                capacityReportService.loadData($scope, $scope.model, function(data) {
                    $scope.lineOption.series = []; //还原初始值
                    if ($scope.lineOption.xAxis.data) {
                        $scope.lineOption.xAxis.data = [];
                    }
                    data.data.series.forEach(function(obj, index) {
                        obj.type = "line";
                        obj.areaStyle = { normal: {} };
                        obj.stack = "总量";
                        $scope.lineOption.series.push(obj);
                    })
                    $scope.lineOption.xAxis.data = data.data.xAxis.data;
                })
            } else if ($scope.model.timeFrom == "" && $scope.model.timeTo) {
                toaster.pop('warning', '', '请选择开始时间！');
            } else if ($scope.model.timeTo == "" && $scope.model.timeFrom) {
                toaster.pop('warning', '', '请选择结束时间！');
            } else {
                toaster.pop('warning', '', '请选择结束时间和结束时间！');
            }
        },
        /**
         * @return {[type]}
         * 点击输入框，移除快捷查询按钮的高亮
         */
        open: function() {
            $('.btn-info').removeClass('btn-info');
        }
    }
}]);
