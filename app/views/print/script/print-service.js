//打印模板服务层

app.factory('printService', ['dataExchange', 'httpService', function(dataExchange, httpService) {

    return {
        loadData: function($scope, data, fun) {
            httpService.ajaxSend({
                type: 'post',
                url: '/wos_api/printerTemplate/gets',
                data: JSON.stringify({
                    currentPage: data.currentPage,
                    sort: data.sort,
                    pageSize: data.pageSize,
                    filter: data.filter
                })
            }).then(function(response) {
                if (fun) fun(response);
            });
        },

        //编辑模板主表数据
        editTemplate: function(data, callback) {

            dataExchange.loadData({
                type: 'post',
                url: '/wos_api/printerTemplate/modifyPrinterTemplate'
            }, data, function(response) {
                if (callback) callback(response);
            });
        },
        
        //删除选中的打印模板
        deleteTemplate: function(data, callback) {
            
            httpService.ajaxSend({
                type: 'post',
                url: '/wos_api/printerTemplate/deletePrinterTemplate',
                data: JSON.stringify(data)
            }).then(function(response) {
                if (callback) callback(response);
            });
        }
    }
}]);