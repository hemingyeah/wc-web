/**
 * 首页控制器,
 */
app.controller('dashBoardCtrl', ['$scope', 'dashBoardService', 'toaster',

    function($scope, dashBoardService, toaster) {

        $scope.themes = ['default', 'vintage', ];
        $scope.baseConfig = {
            theme: 'iscs',
            dataLoaded: true
        };

        var base = +new Date(1968, 9, 3);
        var oneDay = 24 * 3600 * 1000;
        var date = [];

        var data = [Math.random() * 300];

        for (var i = 1; i < 20000; i++) {
            var now = new Date(base += oneDay);
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }

        function onClick(params) {
            console.log(params);
        };
        $scope.lineConfig = _.cloneDeep($scope.baseConfig);
        $scope.lineConfig.event = [{
            click: onClick,
            legendselectchanged: onclick
        }];
        $scope.$watch('theme', function(v) {
            $scope.lineConfig.theme = v;
        });

        $scope.lineOption = {
            tooltip: {
                trigger: 'axis',
                position: function(pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '大数据量面积图',
            },
            legend: {
                top: 'bottom',
                data: ['意向']
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [{
                name: '模拟数据',
                type: 'line',
                smooth: true,

                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                data: data
            }]
        };

        // //监听后端消息
        // socketService.on('anytao',function(data){
        //     toaster.pop('info',data);
        //     console.log(data);
        // });

        // //发送消息到后端
        // socketService.emit('my other event','hhhh');
    }
]);


/**
 * 柱状条形图
 */
app.controller('barChartController', ['$scope', function($scope) {

    $scope.themes = ['default', 'vintage', ];
    $scope.baseConfig = {
        theme: 'iscs',
        dataLoaded: true
    };

    $scope.barConfig = _.cloneDeep($scope.baseConfig);
    $scope.$watch('theme', function(v) {
        $scope.barConfig.theme = v;
    });

    $scope.barOption = {
        title: {
            text: '蒸发量和降水量',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['蒸发量', '降水量']
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }, {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            markPoint: {
                data: [{
                    name: '年最高',
                    value: 182.2,
                    xAxis: 7,
                    yAxis: 183,
                    symbolSize: 18
                }, {
                    name: '年最低',
                    value: 2.3,
                    xAxis: 11,
                    yAxis: 3
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }]
    };
}]);

/**
 * 折线图
 */
app.controller('lineChartController', ['$scope','$interval','$timeout', 
function($scope, $interval,$timeout) {

    $scope.themes = ['default', 'vintage', ];
    $scope.baseConfig = {
        theme: 'iscs',
        dataLoaded: true
    };

    function onClick(params) {
        console.log(params.name);
    };

    $scope.lineConfig = _.cloneDeep($scope.baseConfig);
    $scope.lineConfig.event = [{
        click: onClick,
        legendselectchanged: onclick
    }];
    $scope.$watch('theme', function(v) {
        $scope.lineConfig.theme = v;
    });

    $scope.lineOption = {
        title: {
            text: '未来一周气温变化(5秒后自动轮询)',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最高气温', '最低气温']


        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        }],
        series: [{
            name: '最高气温',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }, {
            name: '最低气温',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
                data: [{
                    name: '周最低',
                    value: -2,
                    xAxis: 1,
                    yAxis: -1.5
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }]
    };
}]);

/**
 * 异步加载数据
 */
app.controller('ajaxChartController', ['$scope', '$interval', '$http',

    function($scope, $interval, $http) {

        $scope.config = {
            debug: true,
            theme: 'infographic',
            showXAxis: true
                // width: 480,
                // height: 320
        };

        $http({
            type: 'get',
            url: '/api/data.json'
        }).then(function(response) {

            $scope.data = response.data.data;
        });
    }
]);