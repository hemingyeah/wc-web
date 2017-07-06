/**
 * 头部-菜单控制器
 */
app.controller('headeCtrl', ['$scope', '$rootScope', 'dialog', '$translate',

    function($scope, $rootScope, dialog, $translate) {
        //所有菜单
        $scope.menuAll = true;
        $scope.allToggle = function() {
                $scope.menuAll = !$scope.menuAll;
            }
            //菜单隐藏
        $scope.isActive = false;
        $scope.menuLevel = false;
        $scope.showLevelToggle = function() {
                $scope.isActive = !$scope.isActive;
                $scope.menuLevel = !$scope.menuLevel;
            }
            // 自定义菜单
        var headMenuArrays = [];
        $scope.headMenuArrays = headMenuArrays;
        //弹出框
        $scope.dialog = dialog;
        $scope.add = function() {
            $scope.dialog.show('views/head/menu-add.html', 'headeAddCtrl', 'md', {
                arr: function() {
                    return headMenuArrays;
                }
            }, function(data) {
                headMenuArrays.push(data);
            });
        };

        //注销
        $scope.logOut = function() {

            app.caches.removeItem('token');
            app.caches.removeItem('userId');
            $rootScope.$state.go('login');
        }

        //页面左侧高级搜索隐藏
        $rootScope.viewLeft = false;
        $rootScope.viewIcon = true;
        $rootScope.viewRight = true;
        $rootScope.searchToggle = function() {
            $rootScope.viewLeft = !$rootScope.viewLeft;
            $rootScope.viewIcon = !$rootScope.viewIcon;
            $rootScope.viewRight = !$rootScope.viewRight;
        }
        $rootScope.langs = [{
            "id": "zh_CN",
            "name": "中文简体",
        }, {
            "id": "en_US",
            "name": "English",
        }];
        $scope.languageName = $rootScope.langs[0].name;
        //国际化
        $scope.setLang = function(lang, name) {
            $translate.use(lang.id);
            $scope.languageName = lang.name;
        };
    }
]);

/**
 * 快捷菜单
 */
app.controller('headeAddCtrl', ['$scope', '$rootScope', '$http', 'dialog', 'arr', '$uibModalInstance', 'toaster',

    function($scope, $rootScope, $http, dialog, arr, $uibModalInstance, toaster) {

        $http.get("local_api/sidebar-menu.json")
            .then(function(res) {
                var demoData = res.data.data;
                //selet级联
                $scope.districts = demoData;
            });

        //获取选中菜单
        var arrMenu;
        $scope.itemVaule = function(item) {
                arrMenu = item;
            }
            //提交
        $scope.submit = function(item) {
            if ($(".menu-custom div").length <= "4") {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].pageName == arrMenu.pageName) {
                        toaster.pop('warning', '', '已添加过这个快捷菜单');
                        return false;
                    };
                };
                $uibModalInstance.close(arrMenu);
            } else {
                toaster.pop('warning', '', '最多添加5个快捷菜单');
                return false;
            }
        };
        //关闭
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);