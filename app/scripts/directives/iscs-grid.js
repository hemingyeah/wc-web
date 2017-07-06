//表格指令
app.directive('columnPanel', [function() {
    return {
        restrict: 'E',
        templateUrl: 'views/tpl/column-panel.html',
        link: function(scope, iElement, iAttrs) {
            iElement.find('#toolPanel').css('height', scope.iscsGridHeight)
        }
    };
}])
app.directive('formEditor', [function() {
    return {
        restrict: 'E',
        scope: true,
        template: function(elem, attr){
            var html = $('<div class="row" style="width: 100%;"></div>');
            var colspan = angular.isDefined(attr.colspan)? attr.colspan : 2;
            var formLeft = $('<div class="col-md-'+ colspan +'"  style="text-align:right; "></div>').appendTo(html);
            var formRight = $('<div class="'+(12-colspan)+'"></div>');
            var formtext = $('<p ng-hide="showtooltip" style="padding:5px;"></p>').appendTo(formRight);
            var formGroup = $('<div style="margin-bottom: 5px;"></div>').appendTo(formRight);
            var editorArea = $('<div ng-click="$event.stopPropagation()" ng-show="showtooltip"></div>').appendTo(formGroup);
            if(angular.isDefined(attr.label)){
                formLeft.append('<label style="padding: 5px;">'+attr.label+'</label>');
            }
            formtext.append('<a ng-click="toggleTooltip($event)" style="border: 0px solid blue; border-bottom: 1px dashed #5ca4de; text-decoration: none;">{{'+attr.iscsModel+'}}</a>');
            switch (attr.iscsType) {
                case "input": 
                    editorArea.append('<input type="text" id="input" class="input-sm" style="border-radius: 0px;" ng-model="'+attr.iscsModel+'"/>');
                    break;
                case "textarea": 
                    editorArea.append('<textarea id="textarea" rows="3" cols="30" ng-model="'+attr.iscsModel+'"></textarea>');
                    break;
                case "select": 
                    var selectEdit = $('<div style="width: 200px; display:inline-block;"></div>');
                    var formSelect = $('<ui-select ng-model="'+attr.iscsModel+'"></ui-select>').appendTo(selectEdit);
                    var selectMatch = $('<ui-select-match placeholder="请选择"></ui-select-match>').appendTo(formSelect);
                    var selectChoices = $('<ui-select-choices repeat="item.name as item in '+attr.exampleData+' track by item.id"></ui-select-choices>').appendTo(formSelect);
                    selectMatch.append('<span ng-bind="'+attr.iscsModel+'" ></span>');
                    selectChoices.append('<span ng-bind="item.name"></span>');
                    editorArea.append(selectEdit);
                    break;
            }
            editorArea.append('<button type="button" class="btn btn-success btn-sm" ng-click="saveTooltip()" style="margin-left: 5px; vertical-align: top;"><span class="fa fa-check glyphicon glyphicon-ok"></span></button>');
            editorArea.append('<button type="button" class="btn btn-default btn-sm" ng-click="cancelTooltip()" style="margin-left: 5px; vertical-align: top;"><span class="fa fa-times text-muted glyphicon glyphicon-remove"></span></button>');
            html.append(formRight);
            return html[0].outerHTML;
        },
        link: function($scope, iElement, iAttrs) {
            $scope.prefixValue = iAttrs.iscsModel.split('.')[0];
            $scope.suffixValue = iAttrs.iscsModel.split('.')[1];
            $scope[$scope.prefixValue][$scope.suffixValue] = iAttrs.iscsInit;
            $scope.oldVal = $scope[$scope.prefixValue][$scope.suffixValue];
            if (iAttrs.iscsType === "select") {
                $scope.exampleData = $scope.$eval(iAttrs.exampleData);
            };
            $('document').click(function () {
            })
        },
        controller: function($scope) {
            $scope.showtooltip = false;
            $scope.saveTooltip = function() {
                $scope.showtooltip = false;
                if ($scope[$scope.prefixValue][$scope.suffixValue] === '' ) {
                    $scope[$scope.prefixValue][$scope.suffixValue] = '请输入';
                    $scope.oldVal = '请输入';
                }else {
                    $scope.oldVal = $scope[$scope.prefixValue][$scope.suffixValue];
                }
            }
            $scope.cancelTooltip= function() {
                $scope.showtooltip = false;
                $scope[$scope.prefixValue][$scope.suffixValue] =$scope.oldVal;
            }
            $scope.toggleTooltip = function(e) {
                e.stopPropagation();
                $scope.showtooltip = !$scope.showtooltip;
            }
        }
    }
}])
app.directive("iscsGrid", ['$compile', '$translate', '$interpolate', function($compile, $translate, $interpolate) {

    return {
        restrict: "E",
        template: function(element, attr) {
            var html = $('<div id="iscs-main" class="text-center" style="position: relative;"></div>');
            var div = $('<div class="iscs-fresh ' + attr.gridClass + '" table-height style="text-align: left" id="iscsGrid"></div>');
            var pager = $('<uib-pagination ng-model="currentPage" ng-change="pageChanged()" items-per-page="page.selectedPageSize.name" template-url="/views/tpl/pagination.html" max-size="maxSize" class="pagination-sm" boundary-links="true" rotate="false"></uib-pagination>')
            var pageSize = '<div class="float-right table-paging mrg20T" >' + '<select ng-options="option.name for option in page.pageSize track by option.id" ng-model="page.selectedPageSize" ng-change="onPageSizeChanged(page.selectedPageSize)" ></select>' + '<span>{{"base.recordPage" | translate}}</span></div>';
            html.append(div);
            pager.attr({
                "total-items": "totalItems"
            });
            if (angular.isDefined(attr.gridConfig)) {
                div.attr("ag-grid", attr.gridConfig);
            }
            if (!angular.isDefined(attr.pagination)) {
                html.append(pager);
                html.append(pageSize);
            }
            return html[0].outerHTML;
        },
        link: function($scope, element, attr, ctrl) {
            if (angular.isDefined(attr.no) && attr.no === 'false') { //移除序列号
                $scope[attr.gridConfig].columnApi.setColumnVisible('no', false);
                $scope[attr.gridConfig].columnDefs[0].checked = false;
            }
            if (angular.isDefined(attr.checkBox) && attr.checkBox === 'false') { //移除复选框
                $scope[attr.gridConfig].columnApi.setColumnVisible('checkBox', false);
                $scope[attr.gridConfig].columnDefs[1].checked = false;
            }
            var columnDefs = $scope.gridOptions.columnDefs;
            var totalColumnDefsWidth = 0;
            var viewportWidth = document.body.offsetWidth - (10 + 1) * 2;
            var viewLeftWidth = $('.iscs-view-left').width();
            var iscsGridWidth = 0;
            $scope.iscsGridHeight = $('#iscsGrid').height();
            var lastColumnWidth = 0;
            /*滚动条17px未解决*/
            // var ifScroll = $('.ag-body-viewport').css('overflow-y');
            // console.log(ifScroll);
            $scope.getGridWidth = function() {
                totalColumnDefsWidth = 0;
                columnDefs.forEach(function(obj, index) {
                    if (obj.checked) {
                        totalColumnDefsWidth += (obj.width || 200);
                    } else return;
                });
            }
            $scope.$watch('viewLeft', function(newVal, oldVal) {
                $scope.getGridWidth();
                if (newVal === true) {
                    iscsGridWidth = viewportWidth;
                } else {
                    iscsGridWidth = viewportWidth - viewLeftWidth;
                }
                if (totalColumnDefsWidth < iscsGridWidth) {
                    $scope.flatGrid();
                }
            });
            $scope.flatGrid = function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                for (i = columnDefs.length - 1; i >= 0; --i) {
                    if (columnDefs[i].checked) {
                        lastColumnWidth = (columnDefs[i].width || 200) + iscsGridWidth - totalColumnDefsWidth - 17 - 2;
                        break;
                    } else {
                        continue
                    }
                }
                // lastColumnWidth = (columnDefs[columnDefs.length - 1].width || 200) + iscsGridWidth - totalColumnDefsWidth - 17 - 2;
                $scope.gridOptions.columnApi.setColumnWidth(columnDefs[i], lastColumnWidth);
            }
            element.find('#iscs-main').append($compile('<column-panel></column-panel>')($scope));
            $scope.columns = $scope.gridOptions.columnDefs.filter(function(obj, index) {
                return obj.ifShowInPanel === undefined; //需要在面板显示的列
            });
            $scope.initColumnsState();
            element.find('#south').remove(); //弃用ag-grid原生的分页工具
            $scope.event.loadData();
        },

        controller: ['$scope', '$compile', function($scope, $compile) {
            $scope.flag = false;
            $scope.pageIndex = 1;
            $scope.maxSize = 10; //分页条最大显示分页数
            $scope.onPageSizeChanged = function(data) {
                $scope.pageIndex = $scope.currentPage = 1;
                $scope.event.loadData();
            };
            $scope.pageChanged = function() {
                $scope.pageIndex = $scope.currentPage;
                $scope.event.loadData();
            };
            $scope.save = function() {
                $scope.columns.forEach(function(obj, index) {
                    if (!obj.checked) {
                        $scope.gridOptions.columnApi.setColumnVisible(obj.field, false);
                    } else {
                        $scope.gridOptions.columnApi.setColumnVisible(obj.field, true);
                    }
                });
                $scope.getGridWidth();
                $scope.flatGrid();
                $scope.flag = false;
            };
            $scope.close = function() {
                    $scope.flag = false;
                }
                //列状态开关按钮
            $scope.event.setting = function() {
                    $scope.flag = !$scope.flag;
                }
                //初始化列选中状态
            $scope.initColumnsState = function() {
                $scope.columns.forEach(function(obj, index) {
                    if (!obj.checked) {
                        $scope.gridOptions.columnApi.setColumnVisible(obj.field, false);
                    }
                })
            };
        }]
    }
}]);
