/**
 * 
 * 请求及响应拦截中间件
 */

app.factory('httpInterceptor', ["$q", "$rootScope", 'toaster', 'md5','$window',

    function($q, $rootScope, toaster, md5 ,$window) {

        return {
            "request": function(config) {
                
                config.headers = config.headers || {};
                var token = app.caches.getItem("token");
                var userId = app.caches.getItem('userId');
                if (!!token) {
                    var timeStamp = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    // config.headers["Content-Type"] = "application/json";
                    config.headers["m"] = "web";
                    config.headers["v"] = app.caches.getItem('version');
                    config.headers["t"] = timeStamp;
                    config.headers["token"] = token;
                    //由token + t + m + userId 以编码utf-8获取md5，将md5字符串转成大写
                    config.headers["sign"] = md5.createHash(token + timeStamp + 'web' + userId).toUpperCase();
                    //console.log(config.headers["sign"]);
                }
                return config;
            },
            'response': function(response) {
                
                if(response.config.method.toUpperCase()==="POST"){
                    
                    switch(response.data.code){
                        
                        case '0'://正常直接返回
                        return response;
                        
                        case '305'://存在登录风险 需要二次验证
                        $window.location.href=response.data.data.verifyUrl;
                        //$window.open(response.data.data.verifyUrl,'_top');
                        return ;
                        
                        case '1':
                        toaster.pop('warning', '','系统错误,请联系管理员');
                        break;
                        
                        case '2':
                        toaster.pop('warning', '','必要参数丢失,请检查请求参数');
                        break;
                        
                        case '3':
                        toaster.pop('warning', '','参数不合法,请检查参数类型是否正确');
                        break;
                        
                        case '4':
                        toaster.pop('warning', '','登录超时,请重新登录');
                        app.caches.removeItem('token');//移除token
                        app.caches.removeItem('userId');//移除userId
                        $rootScope.$state.go("login");//跳转至登录页面
                        break;
                        
                        case '5':
                        toaster.pop('warning', '','计算签名错误！非法请求');
                        break;
                        
                        case '6':
                        toaster.pop('warning', '','检查权限失败,用户没有操作权限');
                        break;
                        
                        case '7':
                        toaster.pop('warning', '','方法不存在');
                        break;
                        
                        default:
                        break;
                    }
                    
                    return response;
                }
                
                return response; //get方法暂时直接返回
            },
            'responseError': function(response) {
                
                var data = response.data;
                var status = response.status;
                
                switch (status) {

                    case -1:
                        toaster.pop('error', "", "后端服务返回错误");
                        break;
                    case 400:
                        toaster.pop('error', "", "语法格式有误，服务器无法理解此请求");
                        break;
                    case 401:
                        toaster.pop('warning', "", "请先登录");
                        break;
                    case 403:
                        toaster.pop('warning', "", "登录超时,请先登录");
                        break;
                    case 404:
                        toaster.pop('error', "", "请求地址不存在");
                        break;
                    case 500:
                        toaster.pop('error', "", "服务器错误");
                        break;
                    default:
                        break;
                }
                // 判断错误码，如果是未登录
                /*
                if (data["errorCode"] == "503") {
                    // 清空用户本地token存储的信息
                    $rootScope.user = {
                        token: ""
                    };
                    // 全局事件，方便其他view获取该事件，并给以相应的提示或处理
                    $rootScope.$emit("userIntercepted", "notLogin", response);
                }
                // 如果是登录超时
                if (data["errorCode"] == "500998") {
                    $rootScope.$emit("userIntercepted", "sessionOut", response);
                }*/
                    
                return $q.reject(response);
            }
        };
    }
]);