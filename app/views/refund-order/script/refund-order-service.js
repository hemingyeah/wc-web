/**
 * 平台退款单服务层
 */
app.factory('refundOrderService', ['dataExchange', function(dataExchange) {

    var service = {};

    //列表页获取数据
    service.loadData = function($scope, data, fun) {
        dataExchange.loadData({
            type: 'POST',
            url: '/ims_api/originRefund/list'
        }, {
            currentPage: data.currentPage,
            sort: data.sort,
            pageSize: data.pageSize,
            filter: data.filter
        }, function(data) {
            if (fun) fun(data);
        })
    };

    //获取平台订单状态
    service.getOrderStatusData = function() {
        var data = [{
            id: 1,
            name: '全部'
        }, {
            id: 2,
            name: '待处理'
        }, {
            id: 3,
            name: '已关闭',
        }, {
            id: 4,
            name: '已拒绝'
        }, {
            id: 5,
            name: '处理完成'
        }];
        return data;
    };

    //获取货物状态
    service.getGoodStatusData = function() {

        var data = [{
            id: 1,
            name: '等待买家发回'
        }, {
            id: 2,
            name: '等待卖家签收'
        }, {
            id: 3,
            name: '待质检'
        }, {
            id: 4,
            name: '已入库'
        }];

        return data;
    };

    //获取网仓入库状态
    service.getIscsReceiptStatusData = function() {

        return [{
            id: 1,
            name: '未入库'
        }, {
            id: 2,
            name: '正在入库'
        }, {
            id: 3,
            name: '已入库'
        }];
    };

    /**
     * 客服处理状态
     */
    service.getServiceStatusData = function() {

        return [{
            id: 1,
            name: '等待处理'
        }, {
            id: 2,
            name: '正在处理'
        }, {
            id: 3,
            name: '处理完成'
        }];
    };

    /**
     * 查询时间段数据
     */
    service.getQueryByTimeData = function() {

        return [{
            id: 1,
            code: 'noLimit',
            name: '不限制',
            minValue: '',
            maxValue: ''

        }, {
            id: 2,
            code: 'today',
            name: '今天',
            minValue: new Date().Format("yyyy-MM-dd 00:00:00"),
            maxValue: new Date().Format("yyyy-MM-dd hh:mm:ss")
        }, {
            id: 3,
            code: 'threeDay',
            name: '3天以内',
            minValue: new Date().addDate('D', -3).Format("yyyy-MM-dd hh:mm:ss"),
            maxValue: new Date().Format("yyyy-MM-dd hh:mm:ss")
        }, {
            id: 4,
            code: 'weekDay',
            name: '一周以内',
            minValue: new Date().addDate('D', -7).Format("yyyy-MM-dd hh:mm:ss"),
            maxValue: new Date().Format("yyyy-MM-dd hh:mm:ss")
        }, {
            id: 5,
            code: 'weekDayBeyond',
            name: '一周以外',
            minValue: new Date().addDate('D', -7).Format("yyyy-MM-dd hh:mm:ss"),
            maxValue: ""
        }];
    };

    /**
     * 从平台同步
     */
    service.syncPlatformStatus = function(data, callback) {
        
        dataExchange.loadData({
            type: 'post',
            url: '/ims_api/originRefund/refundInfo'
        }, angular.toJson(data), function(response) {
           
            if (fun) fun(response)
        })
    };
    
    /**
     * 生成退换货单
     */
    service.createReturnOrder = function(data,callback){
        
        callback('功能尚未实现');
    }

    return service;
}]);

/**
 * 平台退款单详情服务层
 */
app.factory('refundOrderDetailService', ['dataExchange', function(dataExchange) {

    return {
        loadData: function($scope, data, fun) {
            dataExchange.loadData({
                type: 'POST',
                url: '/ims_api/originRefund/refundInfo'
            }, {
                platformId: 2,
                refundUkid: 20
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };

}]);