app.factory('dicService', ['dataExchange', function(dataExchange) {
    return {
        loadData: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/api/base/definedCode/getBaDefinedCodes' }, {
                currentPage: data.currentPage,
                sort: data.sort,
                pageSize: data.pageSize,
                filter: data.filter
            }, function(data) {
                if (fun) fun(data);
            })
        },
        save: function($scope, data, fun) {
        	dataExchange.loadData({type: 'POST', url: '/api/base/definedCode/addBaDefinedCode' }, {
        	    definedCodeType: data.definedCodeType,
        	    definedCode: data.definedCode,
        	    definedDesc: data.definedDesc,
        	    displaySeq: data.displaySeq,
        	    definedName: data.definedName
        	}, function(data) {
        	    if (fun) fun(data);
        	})
        },
        edit: function($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/api/base/definedCode/modBaDefinedCode' }, {
                definedCodeType: data.definedCodeType,
                definedCode: data.definedCode,
                definedDesc: data.definedDesc,
                displaySeq: data.displaySeq,
                definedName: data.definedName
            }, function(data) {
                if (fun) fun(data);
            })
        },
        delete: function ($scope, data, fun) {
            dataExchange.loadData({type: 'POST', url: '/api/base/definedCode/delBaDefinedCode' }, {
                definedCodeType: data.definedCodeType,
                definedCode: data.definedCode
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
}])
