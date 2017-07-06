//补货建议列表
app.factory('taskListService', ['dataExchange', function(dataExchange) {
    return {
        // loadData: function($scope, data, fun) {
        //     dataExchange.loadData({ type: 'POST', url: '/oms_api/supplySuggest/list' }, {
        //         currentPage: data.currentPage,
        //         sort: data.sort,
        //         pageSize: data.pageSize,
        //         filter: data.filter
        //     }, function(data) {
        //         if (fun) fun(data);
        //     })
        // }
    };
}]);
app.factory('showTaskListService', ['dataExchange', function(dataExchange) {
    return {
        //选择快递
        loadExpressData: function($scope, data, fun) {
            dataExchange.loadData({ type: 'POST', url: '/oms_api/ddContract/getExpress' }, {
                contractUkid: data
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //保存快递
        updataExpress: function($scope, data, fun) {
            dataExchange.loadData({ type: 'POST', url: '/oms_api/ddContract/updateExpres' }, {
                contractUkid: data.contractUkid,
                serviceUkid: data.serviceUkid
            }, function(data) {
                if (fun) fun(data);
            })
        },
    };
}]);