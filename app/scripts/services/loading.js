app.factory('loading', [function() {
    var ajaxCount = 0;

    var loading = {
        show: function() {
            ajaxCount++;
            $(".iscsloading").css("display", "block");
        },
        hide: function() {
            ajaxCount--;
            if (ajaxCount === 0) {
                $(".iscsloading").css("display", "none");
            }
        }
    };
    return loading;
}]);
//首页加载等待