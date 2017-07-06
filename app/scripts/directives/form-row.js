 //左边标题右侧输入框，封装组
 app.directive("formRow", [function() {
         return {
             restrict: "E",
             replace: true,
             template: function(e, a) {
                 a.colspan = a.colspan ? a.colspan : 2;
                 var html = $('<div class="form-group" style="height: 30px;"></div>');
                 var label = $('<label class="control-label"></label>').appendTo(html);
                 label.addClass('col-sm-' + a.colspan);
                 if (a.required || a.required === '') {
                     label.addClass('col-sm-' + a.colspan);
                 }
                 var content = $('<div></div>').appendTo(html);
                 content.html($(e.context).html());
                 content.addClass('col-sm-' + (a.colspan === '12' ? a.colspan : (12 - parseInt(a.colspan))));
                 if (a.label) {
                     label.text(a.label);
                 } else {
                     content.addClass('col-sm-offset-' + a.colspan);
                 }
                 // for (var item in a) {
                 //     if (item.startsWith("ng-")) {
                 //         html.attr(item, a[item]);
                 //     }
                 // }
                 return html[0].outerHTML;
             },
             controller: function($scope) {},
             link: function($scope, element, attr, ngModel) {}
         };
     }]);