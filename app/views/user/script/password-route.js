app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("password", {
            url: '/password',
            template: '<div ui-view></div>',
            resolve: {
                deps: ['$ocLazyLoad',
                    function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'views/user/script/passWord-call.js'
                        ]);
                    }
                ]
            }
        })
        //Id页面
        .state("password.passwordCall", {
            url: '/passwordCall',
            template: "<password-call></password-call>",
            controller: 'passWordCallCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'styles/user/drag.css',
                            'views/user/script/drag.js',
                        ]);
                    }
                ]
            }
        })
        //Phone页面
        .state('password.passwordPhone',{
            url: '/passwordPhone',
            "templateProvider": function($templateCache) {
                                return $templateCache.get('user/password-phone.html');
                            },
            //templateUrl: 'views/user/password-phone.html',
            controller: 'passwordPhoneCtrl'
            
        })
        //Reset页面
        .state('password.passwordReset',{
            url: '/passwordReset',
            template: '<password-reset></password-reset>',
            controller: 'passwordResetCtrl'
            
        })
        //Phone页面
        .state('password.passwordSuccess',{
            url: '/passwordSuccess',
           "templateProvider": function($templateCache) {
                                return $templateCache.get('user/password-success.html');
                            },
            //templateUrl: 'views/user/password-success.html',
            controller: 'passwordSuccessCtrl'
            
        })
}]);
