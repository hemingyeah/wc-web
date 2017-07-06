//打印机设置服务层
app.factory('printerService', ['dataExchange','httpService', function(dataExchange,httpService) {
    return {
        loadData: function($scope, data, fun) {
            httpService.ajaxSend({
                type: 'post',
                url: '/wos_api/dmDevicePrinter/getPrinters',
                data: JSON.stringify({
                    currentPage: data.currentPage,
                    sort: data.sort,
                    pageSize: data.pageSize,
                    filter: data.filter
                })
            }).then(function(data) {
                if (fun) fun(data);
            });
        },
        //编辑
        edit: function(data, callback) {
            dataExchange.loadData({
                type: 'post',
                url: '/wos_api/dmDevicePrinter/addOrUpdatePrinter'
            }, data, function(response) {
                if (callback) callback(data);
            });
        },
        //删除
        deleted: function(data, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/wos_api/dmDevicePrinter/delPrinter',
                data: JSON.stringify(data)
            }).then(function(response) {
                if (callback) callback(response);
            });
        }
    }
}]);

app.factory('printerServiceRefund', ['dataExchange', function(dataExchange) {
    var service = {};
    //获取平台订单状态
    service.getprinterId = function() {
        var data = [{
            id: 1,
            name: 'ab-0011'
        }, {
            id: 2,
            name: 'ab-0012'
        }, {
            id: 3,
            name: 'ab-0013',
        }, {
            id: 4,
            name: 'ab-0014'
        }, {
            id: 5,
            name: 'ab-0015'
        }];
        return data;
    };
     service.getprintType = function() {
        var data = [{
            id: 1,
            name: '电子面单'
        }, {
            id: 2,
            name: '纸质面单'
        }, {
            id: 3,
            name: '商品清单',
        }, {
            id: 4,
            name: '贺卡'
        }, {
            id: 5,
            name: '条形码'
        }];
        return data;
    };
    service.gettransporter = function() {
        var data = [{
            id: 1,
            name: '申通',
            udname:'001'
        }, {
            id: 2,
            name: '圆通',
            udname:'002'
        }, {
            id: 3,
            name: '顺丰',
            udname:'003'
        }, {
            id: 4,
            name: '天天',
            udname:'004'
        }, {
            id: 5,
            name: '韵达',
            udname:'005'
        }];
        return data;
    };
    service.getworkspace = function() {
        var data = [{
            id: 1,
            name: '区域一'
        }, {
            id: 2,
            name: '区域二'
        }, {
            id: 3,
            name: '区域三',
        }];
        return data;
    };
    service.getfrontBack = function() {
        var data = [{
            id: 1,
            name: '前置打印'
        }, {
            id: 2,
            name: '后置打印'
        }];
        return data;
    };
    return service ;
}]);