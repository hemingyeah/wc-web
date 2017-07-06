// 'use strict';
app
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'ADMdtpProvider', '$translateProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ADMdtp, $translateProvider) {

            //国际化配置
            $translateProvider.useStaticFilesLoader({
                prefix: '/i18n/',
                suffix: '.json'
            });
            // 默认
            $translateProvider.preferredLanguage('zh_CN');
            $translateProvider.useSanitizeValueStrategy('escape');

            //日期控件全局配置
            ADMdtp.setOptions({
                calType: 'gregorian',
                format: 'YYYY-MM-DD hh:mm',
                default: 'today',
                // transition:false//去掉切换动画效果
                // transition:false//去掉切换动画效果
            });

            $locationProvider.html5Mode({
                enabled: true
            });

            //http拦截器
            $httpProvider.interceptors.push('httpInterceptor');
            $urlRouterProvider
                .otherwise('/login');
            $stateProvider
                .state('iscs', {
                    abstract: true,
                    url: '/iscs',
                    //templateUrl: 'views/index.html',
                    templateProvider: ['$templateCache', function($templateCache) {
                        return $templateCache.get('index.html');
                    }],
                    controller: ['$scope', '$state', 'dataExchange', function($scope, $state, dataExchange) {

                        // dataExchange.loadData({
                        //     type: 'get',
                        //     url: 'api/sidebar-menu.json'
                        // }, function(response) {}, function(response) {
                        //     var demoData = response.data;
                        //     $scope.menuList = demoData.data;
                        //     //获取菜单数据-后端的
                        //     dataExchange.loadData({
                        //         type: 'post',
                        //         url: '/oms_api/response/findAllPage'
                        //     }, function(response) {}, function(response) {
                        //         $scope.menuList = response.data.concat(demoData);
                        //     });
                        // });

                        //获取菜单数据-本地的
                        dataExchange.loadData({
                            type: 'get',
                            url: 'local_api/sidebar-menu.json'
                        }, function(response) {}, function(response) {
                            var demoData = response.data;
                            $scope.menuList = demoData;
                        });
                        $scope.menuIfShow = function(data, evt) {
                            data.show = !data.show;
                        }
                    }]
                })
                .state('iscs.main', {
                    abstract: true,
                    //templateUrl: "views/route/route.html",
                    templateProvider: ['$templateCache', function($templateCache) {
                        return $templateCache.get('route/route.html');
                    }]
                })
                .state('iscs.main.tab', {
                    url: '/index',
                    views: {
                        "default": {
                            url: '/dashboard',
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('dashboard/dashboard.html');
                            }],
                            "controller": "dashBoardCtrl as dashboard"
                        },
                        "personalInfo": {
                            url: '/personalInfo',
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('personal-info/personal-info.html');
                            }],
                            "controller": "personalInfoCtrl as personalInfo"
                        },
                        "baseInfo": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('base-info/base-info.html');
                            }],
                            "controller": "baseInfoCtrl as baseInfo"
                        },
                        "staffManage": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('staff-manage/staff-manage.html');
                            }],
                            "controller": "staffManageCtrl as staffManage"
                        },
                        "menuManage": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('menu-manage/menu-manage.html');
                            }],
                            "controller": "menuManageCtrl as menuManage"
                        },
                        "print": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('print/print.html')
                            }],
                            "controller": "printCtrl as print"
                        },
                        "printer": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('printer/list.html')
                            }],
                            "controller": "printerCtrl as printerCtrl"
                        },
                        "dicMgr": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('dic-mgr/dic-mgr.html')
                            }],
                            "controller": "dicMgrCtrl as dicMgrCtrl"
                        },
                        "originOrder": {
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('origin-order/origin-order.html')
                            }],
                            "controller": "originOrderCtrl as originOrderCtrl"
                        },
                        "refundOrder": { //平台退款单
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('refund-order/refund-order.html')
                            }],
                            "controller": "refundOrderCtrl as refundOrderCtrl"
                        },
                        "demandForecast": { //仓库预测需求
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('demand-forecast/list.html')
                            }],
                            "controller": "demandForecastCtrl as demandForecastCtrl"
                        },
                        "demandForecastReport": { //预测结果报表
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('demand-forecast/report.html')
                            }],
                            "controller": "demandForecastReportCtrl as demandForecastReportCtrl"
                        },
                        "table": { //表格示例
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('table/table.html')
                            }],
                            "controller": "tableCtrl as tableCtrl"
                        },
                        "capacity": { //产能报表
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('capacity-report/capacity-report.html')
                            }],
                            "controller": "capacityReportCtrl as capacityReportCtrl"
                        },
                        "order": { //订单页面-快递选择
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('order/order-list.html')
                            }],
                            "controller": "orderListCtrl as orderListCtrl"
                        },
                        "replenishment": { //仓库补货建议
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('replenishment/replenishment-list.html')
                            }],
                            "controller": "replenishmentListCtrl as replenishmentListCtrl"
                        },
                        "supplyMatching": { //产能报表
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('supply-matching/supply-matching.html')
                            }],
                            "controller": "supplyMatchingCtrl as supplyMatchingCtrl"
                        },
                        "taskList": { //任务列表
                            "templateProvider": ['$templateCache', function($templateCache) {
                                return $templateCache.get('task-list/task-list.html')
                            }],
                            "controller": "taskListCtrl as taskListCtrl"
                        }

                        
                    }
                });
        }
    ]);