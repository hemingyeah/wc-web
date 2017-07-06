//弹出框控件
app.factory('dialog',['$http','$uibModal','$window',function($http,$uibModal,$window){
     var obj = {
        show: function(tplUrl, ctrl, size, param, fun) {
            var modal = $uibModal.open({
                templateUrl: tplUrl,
                controller: ctrl,
                backdrop: "static",
                size: size,
                resolve: param
            });
            window.modal = modal;
            modal.result.then(function(result) {
                if (fun) fun(result);
            });
        }
    };
    return obj;
}]);
