app.factory('staffService', ['dataExchange', function(dataExchange) {
    return {
        loadData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: 'ims_api/response/saveSyMenu2' }, {
                currentPage: data.currentPage,
                sort: data.sort,
                pageSize: data.pageSize,
                filter: data.filter
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
}])
