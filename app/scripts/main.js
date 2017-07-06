'use strict';

/* Controllers */

app
    .controller('AppCtrl', ['$scope', '$translate', '$window', '$state', '$localStorage',
    
        function($scope, $translate, $window, $state, $localStorage) {
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
            // config
            $scope.app = {
                name: '网仓3号',
                UserName: app.caches.getItem("UserName") || "系统管理员",
                GroupRelationName: app.caches.getItem("GroupRelationName"),
                version: '1.3.3',
                Layout: false,
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 3,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: false,
                    asideFixed: false,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            }



            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }
            /*改造框架*/
            $scope.id;
            $scope.tabItems = [{
                pageName: "首页",
                pageUrl: "default",
                show: true,
                iconId: 'btn-info',
                kclass: true
            }];
            $scope.refresh;
            $scope.model = {};
            $scope.ifShow = function(data, evt) {
                $(evt.target).siblings().removeClass('btn-info');
                $(evt.target).addClass('btn-info');
                angular.forEach($scope.tabItems, function(obj, index) {
                    obj.show = false;
                    obj.iconId = "btn-default";
                });
                data.show = true;
                data.iconId = 'btn-info';
                // $scope.refresh();
            }
            $scope.closeTab = function(data, index) {
                $scope.tabItems.splice(index, 1);
                angular.forEach($scope.tabItems, function(obj, index) {
                    obj.show = false;
                    obj.iconId = "btn-default";
                });
                $scope.tabItems[0].show = true;
                $scope.tabItems[0].iconId = 'btn-info';
                //删除时判断TAB是否有隐藏
                var $menuTabLi = $(".tab-menu").children("li.tab-show-one");
                if ($menuTabLi.length < 2) {
                    for (var i=0; i< $scope.tabItems.length; i++) {
                        $scope.tabItems[i].kclass = true;
                    }
                }
            }

            $scope.addTab = function(data, evt) {
                if ($.inArray(data, $scope.tabItems) === -1) {
                    angular.forEach($scope.tabItems, function(obj, index) {
                        obj.show = false;
                        obj.iconId = "btn-default";
                    });
                    data.show = true;
                    data.iconId = "btn-info"
                    $scope.tabItems.push($.extend(data, {kclass: true}));
                    //新增时判断TAB过长
                    var $menuTab = $(".tab-menu");
                    var $menuTabLi = $menuTab.children("li.tab-show-one");
                    var $menuTabWidth = $menuTab.width();
                    var mun = 0;
                    $menuTabLi.each(function() {
                        mun += this.clientWidth + 2;
                    });
                    //li是否过多
                    if (mun > $menuTabWidth-150) {
                        var itemsLength = $scope.tabItems.length;
                        for (var i=0; i<itemsLength; i++) {
                            if ($scope.tabItems[i].kclass === true) {
                                $scope.tabItems[i].kclass = false;
                                break; 
                            }
                        }
                    }
                } else {
                    angular.forEach($scope.tabItems, function(obj, index) {
                        obj.show = false;
                        obj.iconId = "btn-default";
                        if (data.pageUkid === obj.pageUkid) {
                            obj.kclass = true;
                        }
                    });
                    data.show = true ;
                    data.iconId = "btn-info";
                };
            }
    
    //左侧按钮
    $scope.navTabLeft = function(data) {
        $menuTab = $(".tab-menu");
        if (!$menuTab.is(':animated')) {
            var $menuTabLi = $menuTab.children("li.tab-hide-one");
            if ($menuTabLi.length > 0) {
                var itemsLength = data.length;
                var mun = 0;
                for (var i=0; i<itemsLength; i++) {
                    if (data[i].kclass === false) {
                        mun += 1;
                    }
                }
                if (data[mun-1] == 0 ) {
                    data.kclass = true;
                }else {
                    data[mun-1].kclass = true;
                }
            }
        }
    }
    //右侧按钮
    $scope.navTabRight = function(data) {
        $menuTab = $(".tab-menu");
        if (!$menuTab.is(':animated')) {
            var $menuTabLi = $menuTab.children("li.tab-show-one");
            var $menuTabWidth = $menuTab.width();
            var mun = 0;
            //获取li宽度
            $menuTabLi.each(function() {
                mun += this.clientWidth + 2;
            });
            //li是否过多
            if (mun > $menuTabWidth) {
                var itemsLength = data.length;
                for (var i=0; i<itemsLength; i++) {
                    if (data[i].kclass === true) {
                        data[i].kclass = false;
                        break; 
                    }
                }
            }
        }
    }
/*改造框架*/
}]);