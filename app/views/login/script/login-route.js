app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state("login", {
				url: '/login',
				template: '<login></login>',
				controller: 'loginCtrl',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
                                'lib/css/slide-box.css',
								'lib/js/switch.js',
								'lib/js/jquery.SuperSlide.2.1.1.js'
							]);
						}
					]
				}
			})
	}]);
