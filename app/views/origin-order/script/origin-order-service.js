//原始订单列表
app.factory('originOrderService', ['dataExchange', function(dataExchange) {
    return {
        loadData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/originTrade/list'}, {
                currentPage: data.currentPage,
                sort: data.sort,
                pageSize: data.pageSize,
                filter: data.filter
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
}]);
//订单详情
app.factory('orderDetailService', ['dataExchange', function(dataExchange) {
    return {
        loadData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/operationLog/getOperationLog'}, {
                currentPage: data.currentPage || 1,
                sort: data.sort,
                pageSize: data.pageSize,
                filter: data.filter
            }, function(data) {
                if (fun) fun(data);
            })
        },
        loadBaseInfo: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/originTrade/getBaseInfo'}, {
                tradeUkid : data
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
}]);

app.factory('showDetailService', ['dataExchange', function(dataExchange) {
    return {
        //收货人信息
        loadReceiverData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/originTrade/getRecipientInfo'}, {
                tradeUkid : data
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //付款时间信息
        loadPaytimeData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/originTrade/getPayTimeInfo'}, {
                tradeUkid : data
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //买家昵称信息
        loadBuyerData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/ims_api/buyerInfo/getBuyerInfo'}, {
                buyerNick  : data
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //选择快递
        loadExpressData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: 'api/originTrade/express'}, {
                tradeUkid : data
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
}]);
