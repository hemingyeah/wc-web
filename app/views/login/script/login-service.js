//登录模块服务层

app.factory('loginService', ['httpService',

    function(httpService) {

        return {
            
            saveUser: function(userId, isSaveUserId) {
                app.caches.setItem('userId', userId, 1); //保存userId 生成sign签名时使用

                if (isSaveUserId) {
                    app.caches.setItem('iscs_user_id', userId, 1); //保存userId 页面记住帐号选项使用

                } else {
                    app.caches.removeItem('iscs_user_id');
                }
            },
            saveToken: function(token) {
                app.caches.setItem('token', token);
            }
        };
    }
]);