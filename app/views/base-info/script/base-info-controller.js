//基础信息控制器
app.controller('baseInfoCtrl', ['$scope', '$state', 'originOrderService','gridService','$rootScope',
function($scope, $state ,originOrderService ,gridService ,$rootScope ) {
    $scope.service = originOrderService;
    gridService.gridInit($scope);
    //状态配置
    $scope.tgle = "checked";
    //表头配置
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "订单号",
        checked: true,
        field: "orderId"
    }, {
        headerName: "来源平台",
        checked: true,
        field: "pageUrl",
        sort: "desc",
        width:120,
        unSortIcon: true
    }, {
        headerName: "店铺",
        checked: true,
        field: "shopId"
    }, {
        headerName: "网仓订单状态",
        checked: true,
        field: "originTradeStatus",
        width:120
    }, {
        headerName: "订单状态",
        checked: true,
        width:120,
        field: "placeOrderStatus"
    }, {
        headerName: "买家昵称",
        checked: true,
        field: "buyerNick",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "收货人",
        checked: true,
        field: "receiverName"
    }, {
        headerName: "付款金额",
        checked: true,
        field: "orderPayment",
        sort: "desc",
        width:120,
        unSortIcon: true
    }, {
        headerName: "付款时间",
        checked: true,
        field: "orderPayTime"
    }, {
        headerName: "买家留言",
        checked: true,
        field: "buyerMessage",
        width:120,
        cellRenderer: function(params){
            return '<label class="switch "><input ng-model="'+$scope.tgle +'" checked="" type="checkbox" ><span></span></label>'
        }
    }]);
    //表格配置
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false,
        headerCellRenderer: $scope.headerCellRenderer
    };
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods);
    
    $scope.alertadd = function(){
        $scope.dialog.show('views/base-info/base-info-detail.html', 'baseInfoDetailCtrl', 'lg', {
                data: function() {
                    return [1]
                }
            }, function() {});
    };
    $scope.detail = function(){
        $scope.dialog.show('views/base-info/base-detail.html', 'baseDetailCtrl', 'lg', {
                data: function() {
                    return [1]
                }
            }, function() {});
    };
    $scope.test = function () {
        console.log($scope.selected)
    }
}]);







//原始订单详情例子
app.controller('baseInfoDetailCtrl', ['$scope', 'orderDetailService', 'gridService', '$compile', '$uibModalInstance', 
function ($scope, orderDetailService, gridService, $compile, $uibModalInstance) {
    $scope.service = orderDetailService;
    gridService.gridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "平台订单号",
        field: "orderId",
        cellRenderer: function(params) {
            var div = "<a ng-model='data' ng-click='showDetail(data, $event)'>" + params.data.orderId + "</a>";
            var content = $compile(div)($scope);
            return content[0];
        }
    }, {
        headerName: "来源平台",
        field: "pageUrl",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "店铺",
        field: "shopId",
    }, {
        headerName: "网仓订单状态",
        field: "originTradeStatus",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "平台订单状态",
        field: "placeOrderStatus",
    }, {
        headerName: "买家昵称",
        field: "buyerNick",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "收货人",
        field: "receiverName",
    }, {
        headerName: "付款金额",
        field: "orderPayment",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "付款时间",
        field: "orderPayTime",
    }, {
        headerName: "买家留言",
        field: "buyerMessage",
    }]);
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false
    };
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        add: function() {
            
        },
        close: function () {
            $uibModalInstance.close();
        }
    });


}]);




//平台退款单详情例子
app.controller('baseDetailCtrl', ['$scope', 'orderDetailService', 'gridService', '$compile', '$uibModalInstance', 'Upload',
function ($scope, orderDetailService, gridService, $compile, $uibModalInstance ,Upload) {
    $scope.service = orderDetailService;
    gridService.gridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "平台订单号",
        field: "orderId",
        cellRenderer: function(params) {
            var div = "<a ng-model='data' ng-click='showDetail(data, $event)'>" + params.data.orderId + "</a>";
            var content = $compile(div)($scope);
            return content[0];
        }
    }, {
        headerName: "来源平台",
        field: "pageUrl",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "店铺",
        field: "shopId",
    }, {
        headerName: "网仓订单状态",
        field: "originTradeStatus",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "平台订单状态",
        field: "placeOrderStatus",
    }, {
        headerName: "买家昵称",
        field: "buyerNick",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "收货人",
        field: "receiverName",
    }, {
        headerName: "付款金额",
        field: "orderPayment",
        sort: "desc",
        unSortIcon: true
    }, {
        headerName: "付款时间",
        field: "orderPayTime",
    }, {
        headerName: "买家留言",
        field: "buyerMessage",
    }]);
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        showToolPanel: false
    };
    $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
    var consMethods = gridService.construtor($scope);
    $scope.event = $.extend(consMethods, {
        add: function() {
            
        },
        close: function () {
            $uibModalInstance.close();
        }
    });

//图片上传裁切
  $scope.upload = function (dataUrl, name) {
        Upload.upload({
            url:'/uploadFile_api/file/upload',
            headers: {"Content-Type": "multipart/form-data"},
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
            },
        }).then(function (response) {
                $scope.result = 'http://localhost:8081/' + response.data.data.path;
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status 
                + ': ' + response.data;
        }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
  }

}]);









//下拉框指令

app.directive('myUiSelect', function() {
  return {
    restrict: "A",
    require: 'uiSelect',
    link: function(scope, element, attrs, $select) {
    scope.itemArray = [
            {id: 1, name: '学生'},
            {id: 2, name: '医生'},
            {id: 3, name: '警察'},
            {id: 4, name: '程序员'},
            {id: 5, name: '厨师'},
        ];    //selected数据示例
        scope.selected = { value: scope.itemArray[0] };
        }
  };
});
//uploader
    // $scope.btnRemove = function(file) {
    //     $log.info('deleting=' + file);
    //     uiUploader.removeFile(file);
    // };
    // $scope.btnClean = function() {
    //     uiUploader.removeAll();
    // };
    // $scope.btnUpload = function() {
    //    // $log.info('uploading...');
    //     uiUploader.startUpload({
    //         url: 'http://realtica.org/ng-uploader/demo.html',
    //         concurrency: 2,
    //         onProgress: function(file) {
    //            // $log.info(file.name + '=' + file.humanSize);
    //            console.log('成功');
    //             $scope.$apply();
    //         },
    //         onCompleted: function(file, response) {
    //             //$log.info(file + 'response' + response);
    //             console.log('失败');
    //         }
    //     });
    // };
    // $scope.files = [];
    // var element = document.getElementById('file1');
    // element.addEventListener('change', function(e) {
    //     var files = e.target.files;
    //     uiUploader.addFiles(files);
    //     $scope.files = uiUploader.getFiles();
    //     $scope.$apply();
    // });