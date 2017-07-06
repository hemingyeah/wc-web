/*
*数据交互
*/
app.factory('dataExchange', ['httpService', function(httpService) {
    var obj = {
        loadData: function(route, param, fun) {
            httpService.ajax({
                    type: route.type,
                    url: route.url,
                    data: param
                })
                .success(function(data) {
                    httpService.responseHandle(data, function(data) {
                        if (fun) fun(data);
                    });
                });
        }
    }
    return obj;
}]);
