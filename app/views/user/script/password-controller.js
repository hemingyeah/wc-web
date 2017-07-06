app.controller('passWordCallCtrl', ['$scope', '$state',function($scope, $state) {
$scope.event = {
    btnSubmit: function () {
        var user= $("input[name=uid]").val();
        //此处需要与后台比对是否有ID 
        if(user !== '100'){
            $(".callPwd-from-tip-error ").show();
            $("input[name=uid]").addClass('error');
            $(".callPwd-from-tip-error span").text("工号错误，请输入正确工号。");
        }else{
            //验证通过否
            if($(".handler_ok_bg").is(':visible')){
                $state.go("password.passwordPhone");
            }else{
                $(".callPwd-from-tip-error ").show();
                $("input[name=uid]").addClass('error');
                $(".callPwd-from-tip-error span").text("验证未通过"); 
            }
        }
     }
 }

}]);

app.directive('passwordCall', ['$templateCache',function($templateCache) {
  return {
    restrict: "E",
    replace: true,
    template: $templateCache.get('user/password-call.html'),
    link: function($scope, element, attr, ngModel) {
        // 用户名非空
        $("input[name=uid]").blur(function(){
            var user= $("input[name=uid]").val();
            if( user == "" || user == undefined || user == null){
                $(".callPwd-from-tip-error ").show();
                $(this).addClass('error');
                $(".callPwd-from-tip-error span").text("请输入工号");
            }else{
                $(".callPwd-from-tip-error ").hide();
                $(this).removeClass('error');
            }
        });
        $('#drag').drag();
    }
  }
}]); 

//phone
app.controller('passwordPhoneCtrl', ['$scope', '$state',function($scope, $state) {
    $scope.event = {
        btnSubmit: function() {
            var phone = $("input[name=phone]").val();
            var phoneValidate = $('input[name=phoneValidate]').val();
            var phonev = $('input[name=phoneValidate]');
            var valdate = $('.callPwd-from-tip-error.valdata');
            
            if(phoneValidate == '123456'){
                 $state.go("password.passwordReset");
            }else{
                valdate.show();
                phonev.addClass('error');
                valdate.find('span').text('验证码不正确');
            }
        }
       
    }

}]);
//reset
app.controller('passwordResetCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.event = {
        btnSubmit: function() {
            var password = $("input[name=password]").val();
            var passwordcfm = $("input[name=passwordConfirm]").val();
            var passwordl = $("input[name=password]");
            var error = $('.callPwd-from-tip-error');
            var tip =$('.callPwd-from-tip-remind');
            //密码验证
            if(password == "" || password == null || password == undefined){
                tip.removeClass('show');
                error.show();
                error.find('span').text('密码不能为空');
                passwordl.addClass("error");
            }else{
                if(password != passwordcfm){
                    tip.removeClass('show');
                    error.show();
                    passwordl.addClass("error");
                    error.find('span').text('两次密码不一样');
                }else{
                    $state.go("password.passwordSuccess");
                }
            }
        }
    }
}]);
app.directive('passwordReset', ['$templateCache',function($templateCache) {
  return {
    restrict: "E",
    replace: true,
    template: $templateCache.get('user/password-reset.html'),
    //templateUrl: "views/user/password-reset.html",
    link: function($scope, element, attr, ngModel) {
        //正则 字母数字组合8-20
        var strongRegex = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$"); 
        $("input[name=password]").keyup(function(){
            var password = $("input[name=password]").val();
            var passwordl = $("input[name=password]");
            var button = $("button.btn-submit");
            var error = $('.callPwd-from-tip-error');
            //密码正则验证
            if(strongRegex.test(password)){
                error.hide();
                button.removeAttr("disabled");
                passwordl.removeClass("error");
            }else{
                $('.callPwd-from-tip-remind').removeClass('show');
                error.show();
                passwordl.addClass("error");
                error.find('span').text('密码不符合要求');
                button.attr({"disabled":"disabled"});
            }
        });
    }
  }
}]); 

//success
app.controller('passwordSuccessCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.event = {
    }
}]);


