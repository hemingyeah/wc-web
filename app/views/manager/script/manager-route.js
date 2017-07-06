app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("pageManager", {
            url: '/pageManager',
            templateUrl: 'views/manager/page-Manager.html',
            controller: 'pageManagerCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           
                        ]);
                    }
                ]
            }
		})
        // .state("password", {
        //     url: '/password',
        //     template: '<div ui-view></div>',
        //     resolve: {
        //         deps: ['$ocLazyLoad',
        //             function($ocLazyLoad) {
        //                 return $ocLazyLoad.load([
        //                     'views/user/script/passwordController.js',
        //                     'views/user/script/passwordService.js',
        //                     'views/user/script/passWordCall.js'
        //                 ]);
        //             }
        //         ]
        //     }
        // })
        // //Id页面
        // .state("password.passwordCall", {
        //     url: '/passwordCall',
        //     template: "<password-call></password-call>",
        //     controller: 'passWordCallCtrl',
        //     resolve: {
        //         deps: ['$ocLazyLoad',
        //             function($ocLazyLoad) {
        //                 return $ocLazyLoad.load([
        //                     'styles/user/drag.css',
        //                     'views/user/script/drag.js',
        //                 ]);
        //             }
        //         ]
        //     }
        // })
        //Phone页面
        
}]);
