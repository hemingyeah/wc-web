'use strict';
agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module('app', [
    'ngAnimate',
    'ngStorage',
    'ngSanitize',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'templates',
    'agGrid',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.select',
    'ui.validate',
    'ui.mask',
    'ADM-dateTimePicker',
    'ngLocale',
    'toaster',
    'angular.socket-io',
    'angular-md5',
    'ngFileUpload',
    'ngImgCrop',
    'ng-echarts'
    
]);

var common = {

    constructor: function(data) {
        var userId = app.caches.getItem("UserID");
        var userName = app.caches.getItem("UserName");
        var appId = app.caches.getItem("AppID");
        var groupRelationId = app.caches.getItem("GroupRelationID");
        var groupRelationName = app.caches.getItem("GroupRelationID");
        $.extend(data, {
            DataSource: 2,
            TypeId: "",
            PluginId: "",
            AddUser: userId,
            AddUserName: userName,
            AppId: appId,
            GroupRelationId: groupRelationId,
            GroupRelationName: groupRelationName,
            ModifyUser: userId,
            ModifyUserName: userName
        });
        return data;
    }
};
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$timeout', '$http', '$location',
            function($rootScope, $state, $stateParams, $timeout, $http, $location) {

                // var parseResponse = function(response) {
                //     // parse response here
                //     console.log(response);
                //     return response;
                // };

                // $http.defaults.transformResponse = [parseResponse];
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                //增加一个路由事件侦听并判断，这样就可以避免未登录用户直接输入路由地址来跳转到登录界面地址
                $rootScope
                    .$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                        if (toState.name == 'login') return; // 如果是进入登录界面则允许

                        if (toState.name.match(/password.*/)) { //密码重置模块
                            return;
                        }

                        //存在token 说明是经过淘宝御城河回调过来的 直接进入系统
                        //回调地址类似http://127.0.0.1:8080/iscs/index?token=89juhjjj&userId=100188
                        if ($location.search().token) {

                            app.caches.setItem('userId', $location.search().userId);
                            app.caches.setItem('token', $location.search().token);
                            //将参数从地址栏去掉
                            $location.search({
                                userId: null,
                                token: null
                            });
                        }

                        // 如果不存在sessionId
                        if (!app.caches.getItem("token")) {
                            event.preventDefault(); // 取消默认跳转行为
                            $state.go("login", {
                                from: fromState.name,
                                w: 'notLogin'
                            }); //跳转到登录界面
                        } else {

                        }
                    });

                /*pagination config*/
                $rootScope.page = {
                    pageSize: [{
                        name: '10',
                        id: 1
                    }, {
                        name: '20',
                        id: 2
                    }, {
                        name: '50',
                        id: 3
                    }],
                    selectedPageSize: {
                        name: 10,
                        id: 1
                    }
                };
            }
        ]
    );