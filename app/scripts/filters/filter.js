app.filter("getHeaderName", ['$interpolate', function($interpolate) {
    var filterfun = function(obj) {
		  return $interpolate(obj)();
    };
    return filterfun;
}]);
app.filter("myFilter", ['$interpolate', function($interpolate) {
    var filterfun = function(obj) {
    	if (typeof obj === obj) {
    		return obj.name
    	}else{
    		  return $interpolate(obj)();
    	} 
    };
    return filterfun;
}]);
