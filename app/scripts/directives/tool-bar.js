/**
 * toolBar
 * items属性
    [{id:"searchBtn",class:"btn-default",icon:"fa fa-home",title:"查询",event:"search()"},
    {id:"refreshBtn",class:"btn-default",icon:"fa fa-refresh",title:"刷新",event:"search()"},
    {id:"addBtn",class:"btn-default",icon:"fa fa-refresh",title:"新增",event:"search()"}]
    
    实际页面controller层传入页面的唯一ID 通过接口调用后端api
    返回按钮ID和是否有权限值hasPower 用hasPower替换ngIfValue的值 实现权限控制
    后端返回值示例：
    itemsPower
    [{id:"searchBtn",hasPower:"true"},
    {id:"refreshBtn",hasPower:"true"},
    {id:"addBtn",hasPower:"false"}]
 * 
 */
app.directive('toolBar', ['$compile', 'httpService', function($compile, httpService) {
    
    return {
        restrict: "A",
        replace: true,
        template: '',
        link: function(scope, element, attrs) {

            //var buttonGroup=$('<div class="btn-group btn-group-sm" role="group" aria-label="..."></div>');
            //element.append(buttonGroup);
            //var pageUkid=scope.pageUkid;//页面唯一ID
            //通过api调用获取按钮权限数据
            httpService.ajax({
                type: 'get',
                url: 'api/itemsPower.json'
            }).success(function(response) {

                var items = _.merge(scope.items, response.data);
                var button = $('<div class="btn-toolbar"></div>');

                for (var i in items) {
                    var item = items[i];
                    button.append('<button type="button" class="btn ' +
                        item.class + '" ng-click="' + item.event + '" ng-if="' + item.havePower + '"><i class="' + item.icon + '"></i> ' + item.title);
                    button.append('</button>');
                }

                $compile(button)(scope);
                element.append(button);
            }).error(function(response){
                
                
            });
        }
    };
}]);
