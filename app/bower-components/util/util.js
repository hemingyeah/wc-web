// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 日期计算：支持负数，即可加可减，返回计算后的日期
 * num：必选，必须是数字，且正数是时期加，负数是日期减
 * field：可选，标识是在哪个字段上进行相加或相减，字段见如下的约定。无此参数时，默认为d
 * 约定如下格式：
 * （1）Y/y 年
 * （2）M 月
 * （3）W/w 周
 * （4）D/d 日
 * （5）H/h 时
 * （6）m 分
 * （7）S/s 秒
 * （8）Q/q 季
 */
Date.prototype.addDate = function(field,num)
{
    if((!num)||isNaN(num)||parseInt(num)==0){
        return this;
    }
    if(!field){
        field = "d";
    }
    switch(field){
        case 'Y':
        case 'y':return new Date((this.getFullYear()+num), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());break;
        case 'Q':
        case 'q':return new Date(this.getFullYear(), (this.getMonth()+num*3), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());break;
        case 'M':return new Date(this.getFullYear(), this.getMonth()+num, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());break;
        case 'W':
        case 'w':return new Date(Date.parse(this) + ((86400000 * 7) * num));break;
        case 'D':
        case 'd':return new Date(Date.parse(this) + (86400000 * num));break;
        case 'H':
        case 'h':return new Date(Date.parse(this) + (3600000 * num));break;
        case 'm':return new Date(Date.parse(this) + (60000 * num));break;
        case 'S':
        case 's':return new Date(Date.parse(this) + (1000 * num));break;
        default: return this;
    }
    return this;
}