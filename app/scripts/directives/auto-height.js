//双表格页面，自动算高度，清楚外层滚动条指令
app.directive('tableHeight', [function() {

    return {
        link: function($scope, element, attr) {
            //自动高度
            cont = function() {
                var winHeight = $(window).height() - 234;
                var mainHeight = $(window).height();
                $('.list-height-auto-table').css('height', winHeight / 2); //2张表
                $('.table-height-main').css('height', mainHeight -70); //main
                $('.dashboard-index').css('height', mainHeight -105); //首页
                $('.auto-height-table').css('height', mainHeight -220); //1张表
                $('.auto-height-dialog-table').css('height', mainHeight -510); //弹框用高度
                $('.auto-height-modal-table').css('height', mainHeight -200); //modal height表
            }
            //算外围宽度
            $menuTab = $(".tab-menu");
            init = function(){
                var width = $(window).width();
                $menuTab.css("width",width-42);
            }
            cont();
            init();
            $(window).resize(function() {
                cont();
                init();
            });
        }
    };

}]);
//菜单导航-自适应隐藏
app.directive('barWidth', [function() {
    return {
        link: function($scope, element, attr) {
            var winHeight = $(window).height();
            contd = function() {
                var width = $(window).width();
                
                if(width < 1200  ){
                    $(".iscs-navright").hide();
                    if(width < 999){
                        $(".iscs-mens").hide();
                        $(".min-menu").show();
                    }else {
                        $(".iscs-mens").show();
                        $(".min-menu").hide();
                    }
                }else{
                    $(".iscs-navright").show();
                    $(".iscs-mens").show();
                    $(".min-menu").hide();
                }
            };
            contd();
            $(window).resize(function() {
                contd();
            });
            
            //1000以下菜单开/关
            var myerpDiv = $(".min-menu-main");
            $(".min-menu").click(function (event) {
            	myerpDiv.fadeIn().css("height",winHeight);
            	$("body").on("click", function () {
            		$(myerpDiv).fadeOut();
            	});
            	event.stopPropagation();
            });
            $(myerpDiv).on("click",".iscs-min-menu",function (event) {
                event.stopPropagation();
            });
            
        }
    };

}]);
/** 
 * 
 * 
 * 调用方式
 * 菜单页面表的调用
 * <iscs-grid grid-config="gridOptions" grid-class="auto-height-table" ></iscs-grid>
 * 
 * 弹出层内表的调用
 * <iscs-grid grid-config="gridOptions" grid-class="auto-height-modal-table" ></iscs-grid>
 **/