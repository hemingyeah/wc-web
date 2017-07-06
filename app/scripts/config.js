 /*------可配置项目开始------*/
 /*
  * 是否开启调试模式
  * */
 app.DEBUG = true;
 app.websocket_url = "http://127.0.0.1:8081"; //前后端消息推送地址
 localStorage.setItem('version', '1.0'); //将版本号放进本地存储
 app.default_language = 'zh_CN'; //系统默认语言

 /**
  * app前端缓存对象，用于当前页面生命周期中的数据缓存及持久化缓存。
  * 使用app.caches._cachesData对象，localStorage和sessionStorage三种方式存储
  * */
 app.caches = {
     /**
      * @params k
      * @params v
      * @params persistence default:undefined
      *  可接受：-1: 使用app.caches.cacheData 刷新/关闭清除
      *         1  使用localStorage
      *         0 使用sessionStorage 当前页面生命周期，关闭页面清除
      * @param toJson 是否存储为JSON字符串，用于对象存储
      * */
     setItem: function(k, v, persistence, toJson) {

         if (angular.isObject(v) || angular.isArray(v)) {
             toJson = true;
         }

         if (undefined == persistence) {
             persistence = 1;
         }

         switch (persistence) {
             case -1:
                 app.caches._cachesData[k] = v;
                 break;
             case 1:
                 if (toJson) {
                     v = angular.toJson(v);
                 }
                 localStorage.setItem(k, v);
                 break;
             case 0:
                 if (toJson) {
                     v = angular.toJson(v);
                 }
                 sessionStorage.setItem(k, v);
                 break;
         }
         return v;
     },
     getItem: function(k) {
         var v = app.caches._cachesData[k];

         if (undefined == v) {
             v = sessionStorage.getItem(k);
         }

         if (null == v) {
             v = localStorage.getItem(k);
         }

         try {
             v = angular.fromJson(v);
         } catch (e) {}

         return v;

     },
     removeItem: function(k) {
         delete(app.caches._cachesData[k]);
         sessionStorage.removeItem(k);
         localStorage.removeItem(k);
     },
     clear: function(level) {
         switch (level) {
             case -1:
                 app.caches._cachesData = {};
                 break;
             case 0:
                 sessionStorage.clear();
                 break;
             case 1:
                 localStorage.clear();
                 break;
             default:
                 localStorage.clear();
                 sessionStorage.clear();
                 app.caches._cachesData = {};
         }
     },
     _cachesData: {}
 };