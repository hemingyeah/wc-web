app.controller('supplyMatchingCtrl', ['$scope', 'supplyMatchService', function($scope, supplyMatchService) {
    $scope.baseConfig = {
        theme: 'iscs',
        dataLoaded: true
    };
    $scope.model = {
        search: "件"
    }
    var storyDic = [{
        name: "杭州仓",
        id: "1"
    }, {
        name: "深圳仓",
        id: "2"
    }, {
        name: "北京仓",
        id: "3"
    }, {
        name: "产能总量",
        id: "1024",
        selectedMode: false
    }];
    $scope.select = function(params) {
        var obj = params.selected;
        $scope.storyArray = [];
        for (var key in obj) {
            if (obj[key] && key !== "产能总量") {
                storyDic.forEach(function(obj1, index) {
                    if (obj1.name === key) {
                        $scope.storyArray.push(obj1.id)
                    }
                })
            }
        }
        supplyMatchService.loadData($scope, { storyId: $scope.storyArray }, function(data) {
            data.data.series.forEach(function(obj, index) {
                if (obj.id === "1024") {
                    $scope.barOption.series.forEach(function(obj1, index1) {
                        if (obj1.id === "1024") {
                            if (!$scope.storyArray.length) {
                                obj1.data = [];
                            } else {
                                obj1.data = obj.data;
                            }
                        }
                    })
                }
            });
            $scope.barOption.legend.selected = params.selected
        });
    }
    $scope.barConfig = _.cloneDeep($scope.baseConfig);
    $scope.barConfig.event = [{
        click: $scope.onClick,
        legendselectchanged: $scope.select
    }];
    $scope.barOption = {
            title:[
                {text: '出库供需计划',},
                {text: '柱状表示各仓库接收的需求量，折线表示选中仓库的产能之和',
                    textStyle:{color:'#ffA500',
                        fontWeight:'normal',
                        fontSize:'16',
                    },
                    padding:'90',
                    left:'12',
                }],
            //subtext: '供需预测'
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '60',
            containLabel: true
        },
        legend: {
            data: storyDic,
            right:'5%',
        },
        dataZoom: [{
            type: 'slider',
            start: 0,
            end: 20
        }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: [{
            type: 'value'
        }],
        series: []
    };
    $scope.$watch('model.search', function(newVal, oldVal) {
        if (newVal !== oldVal || newVal === "件") {
            supplyMatchService.loadData($scope, null, function(data) {
                $scope.barOption.series = []; //还原初始值
                if ($scope.barOption.xAxis.data) {
                    $scope.barOption.xAxis.data = [];
                }
                data.data.series.forEach(function(obj, index) {
                    if (obj.id === "1024") {
                        obj.type = "line";
                        obj.smooth = false,
                        obj.lineStyle = {
                            normal: {
                                width: 3
                            }
                        };
                    } else {
                        obj.type = "bar";
                        obj.stack = '仓库';
                    }
                    $scope.barOption.series.push(obj);
                });
                $scope.barOption.xAxis.data = data.data.xAxis.data;
            })
        }
    })

}]);
