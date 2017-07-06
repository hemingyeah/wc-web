/*
页面调用
*/
app.directive('heade', ['$templateCache', function($templateCache) {
    return {
        restrict: "AE",
        replace: true,
        // templateUrl: 'views/head/head.html',
        template: $templateCache.get('head/head.html'),
        link: function(scope, element, attr) {

        },
        controller: 'headeCtrl'
    }
}]);