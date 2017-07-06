/**
 * 仓库需求预测服务层
 */
app.factory('demandForecastService', ['dataExchange', 'httpService',
    function(dataExchange, httpService) {

        var service = {};

        service.loadData = function($scope, data, fun) {
            dataExchange.loadData({
                type: 'POST',
                url: '/api/supply/demandForecast/getDetails'
            }, {
                currentPage: data.currentPage || 1,
                sort: data.sort,
                pageSize: data.pageSize,
                filter: data.filter
            }, function(data) {
                if (fun) fun(data);
            })
        };
        //获取商品列表数据
        service.getItemData = function($scope, data, fun) {
            dataExchange.loadData({
                type: 'POST',
                url: '/api/supply/demandForecast/getDetails'
            }, data, function(data) {
                if (fun) fun(data);
            })
        };
        //列表页获取数据
        service.getListData = function($scope, data, fun) {
            dataExchange.loadData({
                type: 'POST',
                url: '/api/supply/demandForecast/getConInfos'
            }, data, function(data) {
                if (fun) fun(data);
            })
        };

        //新增接口
        service.editData = function(data, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/supply/demandForecast/create',
                data: data
            }).then(function(response) {
                if (callback) {
                    callback(response);
                }
            });
        }

        //详情页面获取数据
        service.getDetailData = function(demandForecastUkid, callback) {

            httpService.ajaxSend({
                type: 'post',
                url: '/api/supply/demandForecast/get',
                data: JSON.stringify({
                    'demandForecastUkid': demandForecastUkid
                })
            }).then(function(response) {
                if (callback) callback(response);
            });
        }

        //获取详情页面商品数据
        service.getDetailItemData = function(demandForecastUkid, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/supply/demandForecast/getDetails',
                data: {}
            }).then(function(response) {
                if (callback) callback(response);
            });
        }

        //更新状态
        service.updateStatus = function(data, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/supply/demandForecast/updateStatus',
                data: JSON.stringify(data)
            }).then(function(response) {
                if (callback) callback(response)
            });
        }

        //获取页面下拉选择数据
        service.getComBoxListData = function(data, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/base/comboBox/getComBoxListData',
                data: JSON.stringify(data)
            }).then(function(response) {
                if (callback) callback(response);
            });
        }

        //获取业务单位(需方)下拉数据
        service.getDemandUnitListData = function(callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/base/comboBox/getCBUDefinedCode',
                data: JSON.stringify({
                    'businessType': 100
                })
            }).then(function(response) {
                if (callback) callback(response);
            });
        }

        //获取品类数据
        service.getCategoryListData = function(callback) {
            httpService.ajax({
                type: 'post',
                url: '/api/base/comboBox/getICDefinedCode'
            }).then(function(response) {
                if (callback) callback(response);
            });
        }

        //商品验证接口
        //验证通过取到ukid 为空提示商品不存在
        service.getItemUkid = function(itemCode, participantUkid, callback) {
            httpService.ajax({
                type: 'post',
                url: '/api/base/imItem/getItemUkidByItemCode',
                data: JSON.stringify({
                    "itemCode": itemCode,
                    "participantUkid": participantUkid
                })
            }).then(function(response) {
                if (callback) callback(response);
            });
        };

        /**
         * 获取需求预测报表数据
         */
        service.getDemandForecastReportData = function(data, callback) {
            httpService.ajaxSend({
                type: 'post',
                url: '/api/supply/dfDemandForecast/getDfForecastData',
                data: JSON.stringify(data)
            }).then(function(response) {
                if (callback) callback(response);
            });
        }
        return service;
    }
]);