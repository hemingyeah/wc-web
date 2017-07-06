 app.directive("textBox", [function() {
     return {
         restrict: "E",
         replace: true,
         template: function(e, a) {
             var html = $("<div/>");
             var textbox = $('<input type="text" class="form-control"/>').appendTo(html);
             a.maxlength = a.maxlength || 100;
             if (a.disabled ==="true") {
                 textbox[0].attributes.setNamedItem(document.createAttribute('disabled'));
             }
             if (angular.isDefined(a.required)) {
                 textbox[0].attributes.setNamedItem(document.createAttribute('Required'));
                 // html.append('<span style="right:14px; color:green;" class="glyphicon glyphicon-ok form-control-feedback" ng-show="form.' + a.ngmodel.replace('.', '_') + '.$dirty && form.' + a.ngmodel.replace('.', '_') + '.$valid"></span>')
             }
             if (a.type) {
                 textbox.attr("type", a.type);
             }
             if (a.placeholder) {
                 textbox.attr("placeholder", a.placeholder);
             }
             if (a.ngmodel) {
                 textbox.attr({
                     "ng-model": a.ngmodel,
                     "name": a.ngmodel.replace('.', '_')
                 });
             }
             if (a.validtype) {
                 var pattern = "";
                 switch (a.validtype) {
                     case "Phone":
                         pattern = '/^[1][0-9]{10}$/';
                         break;
                     case "EnglishAndNum":
                         pattern = '/^[a-zA-Z0-9]$/';
                         break;
                     case "EnglishAndNumAndUnderline":
                         pattern = '/^[a-zA-Z0-9_]$/';
                         break;
                     case "EnglishAndChineseAndNumAndUnderline":
                         pattern = '/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/';
                         break;
                     case "English":
                         pattern = '/^[a-zA-Z]$/';
                         break;
                     case "IdCardNo":
                         pattern = '/^(\d{18,18}|\d{15,15}|\d{17,17}x)$/';
                         break;
                     case "IpNo":
                         pattern = '/^((([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))\.){3}(([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))$/';
                         break;
                     case "Telephone":
                         pattern = '/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/';
                         break;
                     case "Chinese":
                         pattern = '/^[\u4e00-\u9fa5]*$/';
                         break;
                     case "Number":
                         pattern = '/^[0-9]*$/';
                         break;
                 }
                 if (pattern) {
                     textbox.attr("ng-pattern", pattern);
                 }
             }
             if (a.validtype || angular.isDefined(a.required)) {
                 html.attr("ng-class", '{"has-error":!form.' + a.ngmodel.replace('.', '_') + '.$valid}');
             }
             if (a.ngdisabled) {
                 textbox.attr("ng-disabled", a.ngdisabled);
             } else if (a.disabled === "") {
                 textbox.attr("ng-disabled", a.ngdisabled);
             }
             if (a.maxlength) {
                 textbox.attr("maxlength", a.maxlength);
             }
             if (a.minlength) {
                 textbox.attr("minlength", a.minlength);
             }
 
             return html[0].outerHTML;
         },
         controller: function($scope) {}
     };
 }]);
app.directive("switch", function() {
    return {
        restrict: "E",
        replace: true,
        template: function(e, a) {
            var html = $('<label class="i-switch bg-info m-t-xs"></label>');
            html.addClass(a.class || "");
            var input = $('<input type="checkbox"/>').appendTo(html);
            input.attr("ng-model", a.ngmodel);
            $("<i></i>").appendTo(html);
            for (var item in a) {
                if (item.startsWith("ng-")) {
                    input.attr(item, a[item]);
                }
            }
            return html[0].outerHTML;
        }
    }
})
