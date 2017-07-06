**网仓内部api接口说明**

>针对前后端api的总体说明

# 系统级输入参数

API参数共由两部分组成, 系统级参数指所有由 后端 提供的API所必须的参数, 应用级参数是指对应API所需的参数。 
在没有特别说明的一般情况下, 系统级参数是调用API时所必须传递的参数

|参数名称|参数类型|参数描述|
|--|--|--|
|Content-Type|string|请求数据类型|
|m|string|模块名称，自定义(web,android,ios)。便于进行接口统计|
|v|string|api版本|
|t|string|请求时间戳|
|token|string|访问码 由登陆接口获取<br/><p style="color:red">token = B1285192E36CC63F23F2428EBAF9A37F 时，不会去检测sign的计算。所以其他参数可以随便填值</p>|
|sign|string|签名 由token + t + m + userId 以编码utf-8获取md5，将md5字符串转成大写|

系统级参数全部放入请求header中

angularjs

``` js
config.headers = config.headers || {};
var token = app.caches.getItem("token");
var userId = app.caches.getItem('userId');
if (!!token)
{
    var timeStamp = new Date().Format('yyyy-MM-dd hh:mm:ss');
    config.headers["Content-Type"] = "application/json";
    config.headers["m"] = "web";
    config.headers["v"] = app.caches.getItem('version');
    config.headers["t"] = timeStamp;
    config.headers["token"] = token;
    //由token + t + m + userId 以编码utf-8获取md5，将md5字符串转成大写
    config.headers["sign"] = md5.createHash(token + timeStamp + 'web' + userId).toUpperCase();
    //console.log(config.headers["sign"]);
}
return config;

```

jquery

``` js
//通过jquery发送请求
service.ajaxSend = function (req)
{
    //设置headers
    var token = app.caches.getItem("token");
    var userId = app.caches.getItem("userId");
    var timeStamp = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var sign = md5.createHash(token + timeStamp + "web" + userId).toUpperCase();

    loading.show();
    req = $.extend(
        {

            contentType : "application/json",

            headers :
            {
                "m" : "web",
                "v" : app.caches.getItem('version'),
                "t" : timeStamp,
                "token" : token,
                "sign" : sign
            }
        }, req);

    var dtd = $.Deferred();

    $.ajax(req)
    .done(function (response)
    {
        loading.hide();
        //若将dataType设为json 序列化会出现精度丢失问题
        //因此在这里进行序列化
        dtd.resolve(JSON.parse(response));
    }
    )
    .fail(function (response)
    {
        loading.hide();
        dtd.reject(response);
    }
    );

    return dtd.promise();
}

```

# 返回参数格式说明

``` json

{
    "code" : "4",//返回编码
    "msg" : "",//返回信息
    "data" : ""//返回数据
}

```

# 全局错误返回码说明

## 错误码说明

在返回的json里，错误码说明如下：

code为0代表响应成功
非0时表示接口调用失败 发生异常


## 错误码列表

### 系统级错误

|错误码|错误描述|解决方案|
|-----|---|----|
|1|系统错误|系统发生错误,请联系管理员.iscs@iscs.com.cn|
|2|必要参数丢失||
|3|参数不合法(参数类型不对，例如：需要传入的是数字类型的，却传入了字符类型的参数)||
|4|token不存在或已失效||
|5|计算签名错误！非法请求||
|6|检查权限失败（用户没有操作权限）||
|7|方法不存在||

### 业务级错误

|错误码|错误描述|解决方案|  
|---|---|---|  
|52|缺少必选参数||  
|53|参数不合法(参数类型不对，例如：需要传入的是数字类型的，却传入了字符类型的参数)||  


# 国际化资源

> 暂时看不懂,什么意思待确定

资源代码为6或者7位

201001或者1101001  

2 代表模块。后期可以可以考虑添加1位，最终可以扩展为99个模块

01 代表业务。一个模块下可以有99种业务  

001 代表该业务下的某一个国际化资源。可以写999个语句 

公共资源`会定义一些公共的语句，供各个模块调用  


## 公共资源

|代码 | 中文含义 |  
|-----------|-----------|
|100000 | 处理成功|
|100001 | 处理失败!原因:{数据}|

## 模块资源

### ims 
|代码 | 中文含义 |  
|----------- |-----------|
|201001 | 订单相关{订单号}|
|202001 | 退款单相关{订单号}|
|203001 | 采购单相关{订单号}|
|204001 | 采购退货相关{订单号}|

### oms
|代码 | 中文含义 |    
|----------- |-----------|
|301001 | 订单相关{订单号}|
|302001 | 退款单相关{订单号}|
|303001 | 采购单相关{订单号}|
|304001 | 采购退货相关{订单号}|


### wos
|代码 | 中文含义 |  
|----------- |-----------|
|401001 | 订单相关{订单号}|
|402001 | 退款单相关{订单号}|
|403001 | 采购单相关{订单号}|
|404001 | 采购退货相关{订单号}|

