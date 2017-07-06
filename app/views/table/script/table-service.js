app.service('tableService', ['dataExchange', function (dataExchange) {
	return {
	    loadData: function($scope, data, fun) {
	        dataExchange.loadData({type: 'get', url: 'api/olympicWinners.json' }, {

	        }, function(data) {
	            if (fun) fun(data);
	        })
	    }
	};
}])