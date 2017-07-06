app.service('capacityReportService', ['dataExchange', function (dataExchange) {
	return {
		loadData: function($scope, data, fun) {
		    dataExchange.loadData({type: 'POST', url: '/api/warehouse/stockCapacity/capacity'}, {
		        startDate: data.timeFrom,
		        endDate: data.timeTo,
		        unit: data.search
		    }, function(data) {
		        if (fun) fun(data);
		    })
		},
		loadData7: function($scope, data, fun) {
		    dataExchange.loadData({type: 'POST', url: '/api/warehouse/stockCapacity/capacity'}, {
		        startDate: data.initDate,
		        endDate: data.sevenDaysAfter,
		        unit: data.search
		    }, function(data) {
		        if (fun) fun(data);
		    })
		},
	    loadData30: function($scope, data, fun) {
	    	dataExchange.loadData({type: 'POST', url: '/api/warehouse/stockCapacity/capacity'}, {
	    	    startDate: data.initDate,
	    	    endDate: data.thirtyDaysAfter,
	    	    unit: data.search
	    	}, function(data) {
	    	    if (fun) fun(data);
	    	})
	    }
	};
}])