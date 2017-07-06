//菜单控件
app.directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        
         el.on('mouseover mouseout', 'li.iscs-menu-one', function(e) {
          var _this = $(this);
          _this.toggleClass('active');
        });

        wrap.on('mouseleave', function(e){
          //next && next.trigger('mouseleave.nav');
         // $('> .nav', wrap).remove();
        });
      }
    };
  }]);