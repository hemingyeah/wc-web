 app.service('supplyMatchService', ['dataExchange', function (dataExchange) {
 	return {
 		loadData: function($scope, data, fun) {
 		    dataExchange.loadData({type: 'POST', url: '/oms_api/matchQuery/querySupplyDemandPlan'}, {
 		    	storyId: data && data.storyId || [],
 		        unit: $scope.model.search
 		    }, function(data) {
 		        if (fun) fun(data);
 		    })
 		}
 	};
 }])