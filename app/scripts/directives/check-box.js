//复选框指令
app.directive('checkBox', [function() {
    return {
        restrict: "E",
        replace: true,
        // require:"ngModel",
        template: function(e, a) {
            var className = 'checkbox';
            if (a.ngclass) {
                className = a.ngclass;
            }
            var html = $('<div class="' + className + '"></div>');
            var label = $('<Label class="i-checks i-checks-sm"></Label>').appendTo(html);
            label.text(a.label ? a.label : "");
            $("<i></i>").prependTo(label);
            var input = $('<input type="checkbox" ng-model="' + a.ngmodel + '" />').prependTo(label);
            input.attr({
                "ng-click": a.ngchange || "",
                "ng-disabled": a.ngdisabled || ""
            });
            for (var item in a) {
                if (item.startsWith("ng-")) {
                    input.attr(item, a[item]);
                }
            }
            html.append(e.context.innerHTML);
            return html[0].outerHTML;
        },
        controller: function($scope) {},
        link: function($scope, element, attr, ngModel) {}
    }
}]);