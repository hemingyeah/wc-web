app.controller('loginCtrl', ['$scope', 'httpService', '$state', '$location', 'loginService',

    function($scope, httpService, $state, $location, loginService) {
        $scope.app.settings.headerFixed = false;
        $scope.app.name = document.title = "网仓3号";

        $scope.event = {

            login: function() {
                userid = $scope.model.userName;
                password = $scope.model.password;

                if (password == "" || password == undefined || password == null ||
                    userid == "" || userid == undefined || userid == null) {
                    $(".login-user-err-text").text("用户名或密码不能为空");
                    $(".login-user-err-main").show();
                    $(".login-user-tip-main").hide();
                    return false;
                }


                //记住账号
                var checkoxLogin = $(".login-checkbox span").attr("class");

                // var key = keyStr ;
                // var passwordU = encode64(password);
                httpService.ajax({
                    type: "post",
                    url: '/api/base/login',
                    data: {
                        userId: userid,
                        password: password
                    }
                }).success(function(data) {

                    loginService.saveUser(userid, checkoxLogin === 'active');

                    if (data && data.code == 0 && data.data != '') {
                        loginService.saveToken(data.data.token);
                        $state.go("iscs.main.tab"); //跳转到主页面
                    } else {
                        $(".login-user-err-text").text("用户名或密码不对");
                        $(".login-user-err-main").show();
                        $(".login-user-tip-main").hide();
                    }
                }).error(function(data) {

                });
            }
        };

    }
]);

app.directive('login', ['$templateCache', function($templateCache) {
    return {
        template: $templateCache.get('login/login.html'),
        link: function($scope, element, attr, ngModel) {
            document.createElement('ng-click');
            $(window).resize(function() {
                var winwidth = $("body").width();
                $("#slideBox .bd ul").css("width", winwidth);
                $("#slideBox .bd ul li").css("width", winwidth);
            });
            // 轮播插件
            $(".slideBox").slide({
                mainCell: ".bd ul",
                effect: "fold",
                autoPlay: true,
                interTime: 5000,
                startFun: function(i, c) {
                    del();
                    switch (i) {
                        case 0:
                            $("#a3").addClass('animation3');
                            $("#a4").addClass('animation4');
                            $("#a5").addClass('animation5');
                            break;
                        case 1:
                            $("#a8").addClass('animation8');
                            $("#a9").addClass('animation9');
                            $("#a6").addClass('animation6');
                            $("#a7").addClass('animation7');
                            $("#a10").addClass('animation10');
                            break;
                        case 2:
                            $(".b2_word #a21").addClass('animation21');
                            $(".b2_word #a22").addClass('animation21');
                            $(".b2_word #a23").addClass('animation20');
                            $(".content1 #a24").addClass('animation22');
                            break;
                        default:
                            break;
                    }
                }
            });
            //记住密码
            $(".login-checkbox").click(function() {
                $(".login-checkbox span").toggleClass("active");
            });
            //切换PC/qrcode点击
            $(".login-user-qrcode").click(function() {
                if ($(".login-user").is(":visible")) {
                    $(".login-user").hide();
                    $(".login-qrcode").show();
                    $(this).addClass("avce");
                } else {
                    $(".login-user").show();
                    $(".login-qrcode").hide();
                    $(this).removeClass("avce");
                }
            });
            //回车提交
            $("body").on("keydown", function(e) {
                var key = e.which;
                if (key == 13) {
                    $scope.event.login();
                }
            });

            $("input[name=userName]").focus();
            // 用户名非空
            $("input[name=userName]").blur(function() {
                var user = $("input[name=userName]").val();
                if (user == "" || user == undefined || user == null) {
                    $(".login-user-err-text").text("请输入用户名");
                    $(".login-user-err-main").show();
                    $(".login-user-tip-main").hide();
                } else {
                    $(".login-user-err-main").hide();
                }
            });
            // 密码非空
            $("input[name=password]").blur(function() {
                var pwd = $("input[name=password]").val();
                if (pwd == "" || pwd == undefined || pwd == null) {
                    $(".login-user-err-text").text("请输入密码");
                    $(".login-user-err-main").show();
                    $(".login-user-tip-main").hide();
                } else {
                    $(".login-user-err-main").hide();
                }
            });

            //读取localStorage
            if (app.caches.getItem('iscs_user_id')) {
                $(".login-checkbox span").addClass("active");
                $scope.model.userName = app.caches.getItem('iscs_user_id');

            } else {
                $scope.model.userName = "";
                $scope.model.password = "";
            }

            var winwidth = $("body").width();
            $("#slideBox .bd ul").css("width", winwidth);
            $("#slideBox .bd ul li").css("width", winwidth);
        }
    }

}]);