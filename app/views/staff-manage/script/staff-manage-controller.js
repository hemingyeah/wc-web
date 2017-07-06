 //员工管理控制器

 app.controller('staffManageCtrl', ['$scope', '$http', '$compile', 'dialog', 'gridService', 'staffService',
     function($scope, $http, $compile, dialog, gridService, staffService) {
         $scope.dialog = dialog;
         $scope.service = staffService;
         gridService.gridInit($scope);
         $scope.columnDefs = $scope.columnDefs.concat([{
             headerName: "菜单名",
             field: "pageName",
             width: 300,
             editable: true,
             headerTooltip: "提示语",
             filter: 'number', //过滤器
             // cellRenderer: function(params) {
             //         return '<a href="' + params.data.url + '" target="_blank">' + params.data.title + '</a>'
             //     }
             // cellClass: ["iscs-table"] //单元格样式类
         }, {
             headerName: "跳转页面",
             field: "pageUrl",
             width: 100,
             editable: true,
             sort: "desc",
             unSortIcon: true,
             // newValueHandler: function(param) {
             //     console.log(param.newValue)
             // },
             // hide: true,
             headerTooltip: "提示语",
             // cellClass: ["iscs-table"] //单元格样式类
         }, {
             headerName: "创建时间",
             field: "createDate",
             width: 500,
             editable: true,
             // newValueHandler: function(param) {
             //     console.log(param.newValue)
             // },
             // hide: true,
             headerTooltip: "提示语"
                 // cellClass: ["iscs-table"] //单元格样式类
         }]);

         $scope.gridOptions = {
             columnDefs: $scope.columnDefs,
             showToolPanel: false
         }
         $scope.gridOptions = $.extend($scope.options, $scope.gridOptions);
         var consMethods = gridService.construtor($scope);
         $scope.event = $.extend(consMethods, {
             add: function() {
                 var data1 = $scope.gridOptions.api.getSelectedRows();
                 $scope.dialog.show('views/staff-manage/staff-edit.html', 'staffManageEditCtrl', 'md', {
                     data: function() {
                         return [1]
                     }
                 }, function() {})
             }
         });
         $scope.onPageSizeChanged = function(data) {
             $scope.pageIndex = $scope.currentPage = 1;
             $scope.event.loadData();
         };
         $scope.pageChanged = function() {
             $scope.pageIndex = $scope.currentPage;
             $scope.event.loadData();
         };
         $scope.sort = "page_ukid&asc";
         $scope.filter = [{
             "field": "parent_page_ukid",
             "compare": "equal",
             "value": "0",
             "datatype": "int"
         }];
     }
 ]);
 //员工编辑控制器
 app.controller('staffManageEditCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
     var daf = 111;
     $scope.close = function() {
         $uibModalInstance.close(daf);
     }
 }]);
