/**
 * 打印模板设计
 */

/*********************************
 * 处理location.href后面参数问题
 ********************************/
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
/*
function requestSend(url, data) {
    return new Promise(function(resolve, reject) {

        $.ajax({
            type: "post",
            url: url,
            data: data,
            processData: false,
            contentType: "application/json",
            success: function(response) {
                resolve(response);
            },
            error: function(response) {
                reject(response);
            }
        });

    });
}*/

/*********************************
 *ajax请求
 ********************************/
function ajaxSend(url, data, type) {

    var userId = localStorage.getItem("userId");
    var token = localStorage.getItem("token");
    var timeStmap = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var dtd = $.Deferred();
    var body = {
        type: type,
        url: url

    };

    if (type == "post") {

        body.contentType = "application/json";
        body.data = data;
        body.processData = false
        body.headers = {
            "m": "web",
            "v": localStorage.getItem("version"),
            "t": timeStmap,
            "token": token,
            "sign": md5(token + timeStmap + "web" + userId).toUpperCase()
        }
    }

    $.ajax(body)
        .done(function(response) {

            try {
                dtd.resolve(response);
            } catch (error) {
                console.log(error);
                toastr.error(error.message);
                dtd.reject(error);
            }
        })
        .fail(function(response) {

            dtd.reject(response);
        });

    return dtd.promise();
}

/*********************************
 *页面初始化
 ********************************/
$(function() {



    //$('#lodopObject').height = $(window).height - 60;

    //document.getElementById('printItems').height = $(window).height() - 2;
    $('#printItems').height($(window).height() - 2);

    //将高度设为0 防止控件将loading效果遮掉
    handleLodopDisplay('hide');

    $('#printSettingModal').on('hidden.bs.modal', function(e) {
        handleLodopDisplay('show');
    })

    $('#detailTableModal').on('hidden.bs.modal', function(e) {
        handleLodopDisplay('show');
    })

    //没有安装打印控件 关闭遮罩后返回 
    if (LODOP.VERSION == undefined) {

        $('.iscsloading').hide();
        return;
    }

    var request = new Object();
    request = GetRequest();

    var templateId = request["templateId"];
    var templateType = request["templateType"];
    $("#templateId").val(templateId); //模板ID
    ajaxSend("script/" + templateType + ".html", 'get')
        .then(function(response) {

            $('#printItems').append(response);

            $('[data-toggle="tooltip"]').tooltip(); //初始化工具提示
            //首先清除checkbox
            $('input:checkbox').each(function() {
                $(this).prop({
                    "checked": false
                });
            });

            //所有的打印项绑定点击事件
            $('input:checkbox').each(function() {
                var item = $(this);
                item.click(function() {
                    addVariableItem(this.id, this.checked);
                });
            });

        }).then(function(response) {

            return ajaxSend('/wos_api/printerTemplate/getPrinterTemplate',
                JSON.stringify({
                    "templateId": templateId
                }), 'post');

        }).then(function(response) {

            var responseJson = JSON.parse(response);
            // if (responseJson.code != '0') {

            //     $('.iscsloading').hide();
            //     handleLodopDisplay('show');
            //     toastr.error('发生错误,错误信息：' + JSON.stringify(response));
            //     return;
            // }
            template = responseJson.data;
            templateDetail = template.dmPrinterDetailTemplate || [];

            //打印设置弹出框数据初始化
            $('#templateName').val(template.templateName);
            $('#pageTop').val(template.pageTop);
            $('#pageWidth').val(template.pageWidth);
            $('#pageHeight').val(template.pageHeight);
            $('#pageLeft').val(template.pageLeft);
            $('#orient').val(template.orient);

            print_design(template);

            $.each(templateDetail, function(i, item) {

                if (item.itemCustomType == itemCustomTypeList.variable) {

                    $('#' + item.itemCode).prop('checked', true);

                } else if (item.itemCustomType == itemCustomTypeList.detail) {

                    $("#tableBox").html(item.itemContent);

                    //处理明细checkbox选中问题
                    var detailArray = ['detailSerialNo', 'detailPicture', 'detailSpec', 'detailCode',
                        'detailSpecName', 'detailUnit', 'detailSkuCode', 'detailSkuName'
                    ];
                    $.each(detailArray, function(j, detail) {
                        if (item.itemContent.indexOf(_.get(printItemNameList, detail)) > 0) {
                            $('#' + detail).prop('checked', true);
                        }
                    });
                }

                addPrintItem(item);
            });

            $('.iscsloading').hide();
            handleLodopDisplay('show');

        }).fail(function(response) {
            $('.iscsloading').hide();
            handleLodopDisplay('show');
            toastr.error('请求服务出错,错误信息：' + JSON.stringify(response));
        });
});

/*********************************
 *打印项id和name映射关系
 *********************************/
var printItemNameList = {
    "orderNo": "订单号",
    "remark": "订单备注",
    "payNo": "交易单号",
    "printer": "打单员",
    "printTime": "打单时间",
    "createTime": "下单时间",
    "payTime": "付款时间",
    "sendTime": "发货时间",
    "goodNum": "商品总数",
    "weight": "重量",
    "postFee": "运费",
    "discount": "优惠",
    "fullDiscount": "满减优惠",
    "payment": "实付金额",
    "expressName": "快递公司",
    "userNick": "买家昵称",
    "userName": "姓名",
    "phoneNumber": "固话",
    "mobile": "手机号码",
    "buyerMessage": "买家留言",
    "province": "省份",
    "city": "市(州)",
    "district": "区(县)",
    "postCode": "邮编",
    "address": "地址",
    "detailSerialNo": "序号",
    "detailPicture": "图片",
    "detailSpec": "规格编码",
    "detailCode": "商品编码",
    "detailSpecName": "规格名称",
    "detailUnit": "单位",
    "detailSkuCode": "宝贝编码",
    "detailSkuName": "宝贝名称"
};

/*********************************
 * 打印项类别字典
 ********************************/
var itemClassList = {

    "Text": 2,
    "Rect": 31, //矩形
    "SolidRect": 32, //实心矩形
    "Ellipse": 33, //椭圆
    "SolidEllipse": 34, //实心椭圆
    "UpLine": 35, //斜上直线
    "DownLine": 36, //斜下直线
    "Htm": 4, //超文本
    "Image": 8, //图像
    "BarCode": 9, //条码
    "Chart": 10, //图表
    "PageNo": 51
};

/*********************************
 * 打印项类型
 ********************************/
var itemCustomTypeList = {

    "constant": 0, //固定文本打印项
    "variable": 1, //数据打印项
    "detail": 2, //明细表格
};

/*********************************
 * 打印项属性
 * ******************************/
var itemTypeList = {

    // 普通
    "Normal": 0,
    // 页眉页脚
    "PageHeaderOrFooter": 1,
    // 页号项
    "PageNo": 2,
    // 页数项
    "PageCount": 3,
    // 多页项
    "MultiPage": 4
};

/*********************************
 * 图形的类型
 ********************************/
var shapeTypeList = {

    "UpLine": 0, //-仰角直线
    "DownLine": 1, //俯角直线
    "Rect": 2, //-矩形框线
    "Ellipse": 3, //椭圆线
    "SolidRect": 4, //实心矩形
    "SolidEllipse": 5 //实心椭圆
};

/** 打印项属性映射： js对象属性-LODOP属性 */
var _item_style = {

    "itemType": "ItemPageType", // @see itemTypeList
    "itemClass": "ItemClass", // LODOP定义的打印项类别
    "itemTop": "ItemTop", // 打印项上边距
    "itemLeft": "Itemleft", // 打印项左边距
    "itemWidth": "ItemWidth", // 打印项宽度
    "itemHeight": "ItemHeight", // 打印项高度
    "itemFontColor": "ItemColor", // 字符（线条等）颜色
    "itemFontName": "ItemFontName", // 字体名称（或条形码类型）
    "itemFontSize": "ItemFontSize", // 字符大小
    "itemBold": "Itembold", // 是否粗体
    "itemItalic": "ItemItalic", // 是否斜体
    "itemUnderline": "ItemUnderline", // 是否下划线
    "itemAlignment": "ItemAlign", // 对齐方式
    "itemAngle": "ItemAngle", // 旋转角度
    //"itemHorient" : "ItemHorient", // 水平锁定方式
    //"itemVorient" : "ItemVorient", // 垂直锁定方式
    "itemReadOnly": "ItemReadOnly", // 纯文本内容在打印维护时，是否禁止修改
    "itemPreviewOnly": "ItemPreviewOnly",
    "itemPenWidth": "ItemPenWidth", // 线条宽度
    "itemPenStyle": "ItemPenStyle" // 线条风格
};

var _extend_sign = new function() {
    var base = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 30) / 1000); // 默认去除2000年之前的时间，去除毫秒级别参数，缩短长度
    this.generate = function() {
        return ((++base).toString(16)); // 转换为16进制，缩短长度
    };
};

/**
 * 打印设计
 * @param template
 * @returns
 */
function print_design(template) {

    var viewWidth = template.viewWidth || 700;
    var viewHeight = template.viewHeight || 533;

    LODOP.PRINT_INITA(10, 10, viewWidth, viewHeight, "网仓3号打印模板设计");
    LODOP.SET_SHOW_MODE("SHOW_SCALEBAR", 1);
    LODOP.SET_SHOW_MODE("TEXT_SHOW_BORDER", 1);
    LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
    LODOP.SET_SHOW_MODE("SETUP_IN_BROWSE", 1);
    LODOP.SET_SHOW_MODE("SETUP_ENABLESS", "11111111000000"); //隐藏关闭(叉)按钮
    LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK", 1); //隐藏纸钉按钮
    LODOP.SET_SHOW_MODE("NP_NO_RESULT", 1);
    LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP", 1); //隐藏打印维护及设计窗口的打印按钮
    LODOP.SET_SHOW_MODE("HIDE_VBUTTIN_SETUP", 1); //隐藏打印维护及设计窗口的预览按钮
    LODOP.SET_SHOW_MODE("HIDE_ABUTTIN_SETUP", 1); //隐藏打印维护及设计窗口的应用（暂存）按钮
    LODOP.SET_SHOW_MODE("HIDE_RBUTTIN_SETUP", 1); //隐藏打印维护及设计窗口的复原按钮
    LODOP.PRINT_SETUP(); //打印维护模式,面对用户
    //LODOP.PRINT_DESIGN();//打印设计模式,面对程序开发者
}
/**
 * 处理打印内容（由于打印控件会将转义字符转为字符串形式的\，所以需要将包含转义字符的特殊字符替换掉）
 * @param itemContent
 * @returns
 */
function generateItemContent(itemContent) {
    if (!itemContent) return "";
    if (itemContent.indexOf("\\") > -1) {
        itemContent = itemContent.replace(/\\b/g, "\b").replace(/\\f/g, "\f").replace(/\\n/g, "\n").replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t").replace(/\\'/g, "\'").replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
    }
    if (itemContent.indexOf("script") > -1) {

        itemContent = itemContent.replace(/^<script.*script>/, '');
    }
    return itemContent;
}

/*********************************
 * 打印项基本方法 
 *********************************/
var _item = new function() {

    //获得程序代码、打印项属性等数据值V
    this.get = function(alias, prop) {
        return LODOP.GET_VALUE(prop, alias);
    };

    //设置打印项风格A,继承SET_PRINT_STYLE的所有属性
    this.set = function(alias, prop, value) {
        LODOP.SET_PRINT_STYLEA(alias, prop, value);
    };

    this.name = function(index, name) {
        if (!index && index !== 0) return null;
        if (name) this.set(index, "ItemName", name);
        return this.get(index, "ItemName");
    };

    this.content = function(alias, content) {
        if (!alias && alias != 0) return null;
        if (content) this.set(alias, "Content", content);
        return this.get(alias, "ItemContent");
    };

    this.del = function(alias) {
        if (!alias && alias != 0) return false;
        this.set(alias, "Deleted", true);
    };

    this.exist = function(alias) {
        if (!alias && alias != 0) return false;
        return this.get(alias, "ItemExist");
    };

    //增加打印项
    /**
     * @param  {any} alias 打印项唯一编码
     * @param  {any} itemClass 打印项类别
     * @param  {any} top     上边距
     * @param  {any} left    左边距
     * @param  {any} width   宽度
     * @param  {any} height  高度
     * @param  {any} content 内容
     * @param  {any} color 颜色
     * @param  {any} fontFamily
     * @param  {any} penWidth 线条宽度
     * @param  {any} penStyle 线条风格
     */
    this.add = function(alias, itemClass, top, left, width, height, content, color, fontFamily, penWidth, penStyle) {

        if (itemClass == itemClassList.Text) { // 插入文本项
            LODOP.ADD_PRINT_TEXTA(alias, top, left, width, height, content);
        } else if (itemClass == itemClassList.Rect) { // 矩形
            LODOP.ADD_PRINT_SHAPE(shapeTypeList.Rect, top, left, width, height, penStyle, penWidth, color);
        } else if (itemClass == itemClassList.Ellipse) { // 椭圆
            LODOP.ADD_PRINT_SHAPE(shapeTypeList.Ellipse, top, left, width, height, penStyle, penWidth, color);
        } else if (itemClass == itemClassList.UpLine || itemClass == itemClassList.DownLine) { // 直线
            LODOP.ADD_PRINT_SHAPE(shapeTypeList.DownLine, top, left, width, height, penStyle, penWidth, color);
        } else if (itemClass == itemClassList.BarCode) { // 条形码
            if (fontFamily) {
                LODOP.ADD_PRINT_BARCODE(top, left, width, height, fontFamily, content);
                _item.set(0, "QRCodeVersion", 3);
            }
        } else if (itemClass == itemClassList.Image) { // 图片
            LODOP.ADD_PRINT_IMAGE(top, left, width, height, content);
            _item.set(0, "Stretch", 2);
        } else if (itemClass == itemClassList.Htm) { // Html
            LODOP.ADD_PRINT_HTM(top, left, width, height, content);
        } else toastr.warning('无法识别的打印项');

        if (alias) this.name(0, alias);
    };
};

/********************************
 * 按照模板添加打印项
 ********************************/
function addPrintItem(tempDetail, setStyle) {

    var itemName = tempDetail.itemName;
    var itemContent = tempDetail.itemContent;
    _item.add(itemName, tempDetail.itemClass, tempDetail.itemTop, tempDetail.itemLeft, tempDetail.itemWidth,
        tempDetail.itemHeight, itemContent, tempDetail.itemFontColor, tempDetail.itemFontName, tempDetail.itemPenWidth,
        tempDetail.itemPenStyle);

    //表格项
    if (tempDetail.itemCustomType == itemCustomTypeList.detail) {
        return true;
    }

    _item.set(itemName, "ItemType", tempDetail.itemType); // 必设属性-打印项类型
    _item.set(itemName, "ReadOnly", tempDetail.itemOnlyRead); // 必设属性-是否只读

    var itemFontSize = tempDetail.itemFontSize;
    var itemFontName = tempDetail.itemFontName;
    var itemFontColor = tempDetail.itemFontColor; // 打印项字符（线条等）颜色
    var itemBold = tempDetail.itemBold;
    var itemAlignment = tempDetail.itemAlignment;
    var itemItalic = tempDetail.itemItalic;
    var itemUnderline = tempDetail.itemUnderLine;
    var itemAngle = tempDetail.itemAngle;

    if (itemFontSize) _item.set(itemName, "FontSize", itemFontSize);
    if (itemFontName) _item.set(itemName, "FontName", itemFontName);
    if (itemFontColor) _item.set(itemName, "FontColor", itemFontColor);
    if (itemBold) _item.set(itemName, "Bold", itemBold);
    if (itemAlignment) _item.set(itemName, "Alignment", itemAlignment);
    if (itemItalic) _item.set(itemName, "Italic", itemItalic);
    if (itemUnderline) _item.set(itemName, "Underline", itemUnderline);
    if (itemAngle) _item.set(itemName, "Angle", itemAngle);
}

/*********************************
 * 添加变量打印项
 ********************************/
function addVariableItem(id, checked) {

    //id=item.itemCode
    var item = {};

    //取消
    if (!checked && id.indexOf("detail") < 0) {

        $.each(templateDetail, function(i, item) {
            if (item.itemCode == id) {
                item.isDeleted = 1;
                _item.del(item.itemName);
            }
        });
        return;
    }

    item.templateDetailId = "0";
    item.isDeleted = 0;
    item.itemType = itemTypeList.Normal; //普通打印项
    item.itemCustomType = itemCustomTypeList.variable;
    item.itemClass = itemClassList.Text;
    item.itemCode = id;
    item.itemName = "_unique_name_" + _extend_sign.generate(); //生成对象唯一名称
    item.itemContent = '[' + _.get(printItemNameList, id) + ']';
    item.itemTop = 20;
    item.itemLeft = 20;
    item.itemWidth = 100;
    item.itemHeight = 50;
    item.itemReadOnly = 0;

    if (id.indexOf("detail") < 0) {

        if (checked) {
            addPrintItem(item);
            templateDetail.push(item);
        } else {
            _item.del(id);
            $.each(templateDetail, function(item) {
                if (item.itemName == id) {
                    item.isDeleted = 1;
                    return false;
                }
            });
        }
        return true;
    }

    //处理明细表格
    item.itemContent = _.get(printItemNameList, id);
    item.itemCustomType = itemCustomTypeList.detail;
    item.itemClass = itemClassList.Htm;
    item.itemName = "detailTable";
    item.itemCode = "detailTable";
    item.itemHeight = 250;
    item.itemTop = 350;

    var width = _item.get("detailTable", "ItemWidth") || "0";

    if (checked) {
        var trHtml = "<td id='" + id + "' width='" + 100 + "'>" + item.itemContent + "</td>";
        var trHtmlBody = "<td id='" + id + "' width='" + 100 + "'>[" + item.itemContent + "]</td>";
        var trHtmlFoot = "<td id='" + id + "' width='" + 100 + "'></td>";
        $("#itemTable thead tr").each(function() {
            $(this).append(trHtml);
        });
        $("#itemTable tbody tr").each(function() {
            $(this).append(trHtmlBody);
        });
        $("#itemTable tfoot tr").each(function() {
            $(this).append(trHtmlFoot);
        });
        _item.set("detailTable", "Width", parseInt(parseInt(width) + 100));
    } else {
        _item.set("detailTable", "Width", parseInt(parseInt(width) - 100));
        $("#itemTable thead tr td#" + id).remove();
        $("#itemTable tbody tr td#" + id).remove();
        $("#itemTable tfoot tr td#" + id).remove();
    }

    if (_item.exist("detailTable")) {
        _item.set("detailTable", "ItemContent", $("#tableBox").html());
    } else {
        item.itemContent = $("#tableBox").html();
        addPrintItem(item);
        templateDetail.push(item);
    }
}

/*********************************
 * 添加自定义打印项
 * @param itemClass
 * @param itemContent
 *********************************/
function addCustomItem(itemClass, itemContent) {

    var item = {};

    item.templateDetailId = "0";
    item.isDeleted = 0;
    item.itemType = itemTypeList.Normal; //普通打印项
    item.itemCustomType = itemCustomTypeList.constant;
    item.itemClass = itemClass;
    item.itemName = "_unique_name_" + _extend_sign.generate(); //生成对象唯一名称
    item.itemCode = item.itemName;
    item.itemContent = itemContent;
    item.itemTop = 20;
    item.itemLeft = 20;
    item.itemWidth = 100;
    item.itemHeight = 60;
    item.itemReadOnly = 0;

    if (itemClass == itemClassList.Text) {
        item.itemHeight = 50;
        item.itemContent = '可编辑文本';
    } else if (itemClass == itemClassList.Rect || itemClass == itemClassList.Ellipse ||
        itemClass == itemClassList.UpLine || itemClass == itemClassList.DownLine) { // 矩形、椭圆、直线
        item.itemPenStyle = 0; //线条风格
        item.itemPenWidth = 1; //线条宽度
        if (itemClass == itemClassList.UpLine) item.itemHeight = 1;
        if (itemClass == itemClassList.DownLine) item.itemWidth = 1;
    } else if (itemClass == itemClassList.BarCode || itemClass == itemClassList.Image) { // 条形码、图片
        if (itemClass == itemClassList.BarCode) item.itemFontName = "Code39";
        else item.itemContent = itemContent;
    }

    templateDetail.push(item);

    addPrintItem(item);
}

/*********************************
 * 打印设置按钮
 *********************************/
function printSetting() {
    handleLodopDisplay('hide');
    $('#printSettingModal').modal('show');
}

/*********************************
 * 打印设置确定按钮
 *********************************/
function confirmEditDialog() {

    $('#printSettingModal').modal('hide');
}

/*********************************
 * 打印设置取消按钮
 *********************************/
function closeEditDialog() {

    $('#printSettingModal').modal({
        backdrop: "false"
    });

    $('#printSettingModal').modal('hide');
}

/*****************************
 * 删除设计区域选中的打印项
 ****************************/
function deleteSelectedItem() {

    for (var i = 1; _item.exist(i); i++) { // 遍历选中项
        var itemName = _item.name(i); // 打印项别名（一般为字段名称
        if (LODOP.GET_VALUE("ItemSelected", i) && itemName) {
            //将打印项在templateDetail数组中标记isDeleted为1
            $.each(templateDetail, function(i, item) {
                if (item.itemName == itemName) {
                    item.isDeleted = 1;

                    //处理右边的选择问题
                    if (item.itemCustomType == itemCustomTypeList.variable) {
                        $('#' + item.itemCode).prop('checked', false);
                    } else if (item.itemCustomType == itemCustomTypeList.detail) {
                        $('.detail').each(function() {
                            $(this).prop("checked", false);
                            $('#itemTable').html('<thead><tr></tr></thread><tbody><tr></tr></tbody>');
                        });
                    }
                    return false;
                }
            });
        }
    }
    _item.del("Selected"); // 删除设计区域选中的打印项
}


/********************************
 * 复制设计区域选中的打印项
 *******************************/
function copySelectedItem() {

    var itemName = _item.get('selected', 'ItemName');
    var itemTemp = {};
    $.each(templateDetail, function(i, item) {
        if (item.itemName == itemName) {
            itemTemp = _.clone(item, true);;
            return false;
        }
    });
    itemTemp.itemTop = parseInt(itemTemp.itemTop) + 40;
    itemTemp.itemName = '_unique_name_' + _extend_sign.generate();
    itemTemp.templateDetailId = "0";
    templateDetail.push(itemTemp);
    addPrintItem(itemTemp);
}


/**********************************************
 * 保存模板按钮
 *********************************************/
function saveTemplate() {

    //对于数据库没有记录又有删除标记的打印项 直接去掉
    _.remove(templateDetail, function(item) {
        return item.isDeleted == 1 && item.templateDetailId == "0";
    });

    //添加打印项时先放入templateDetail数组
    //以打印项数组为准 获取需要保存的打印项的各个属性值
    $.each(templateDetail, function(i, item) {

        if (item.isDeleted == 0) {

            var itemId = item.itemName;

            item.itemContent = _item.get(itemId, "ItemContent");
            item.itemTop = _item.get(itemId, "ItemTop");
            item.itemLeft = _item.get(itemId, "ItemLeft");
            item.itemWidth = _item.get(itemId, "ItemWidth");
            item.itemHeight = _item.get(itemId, "ItemHeight");
            item.itemFontName = _item.get(itemId, "ItemFontName");
            item.itemFontSize = _item.get(itemId, "ItemFontSize");
            item.itemFontColor = _item.get(itemId, "ItemColor");
            item.itemBold = _item.get(itemId, "Itembold");
            item.itemItalic = _item.get(itemId, "ItemItalic");
            item.itemUnderLine = _item.get(itemId, "ItemUnderline");
            item.itemAlignment = _item.get(itemId, "ItemAlign");
            item.itemAngle = _item.get(itemId, "ItemAngle");
            item.itemPenWidth = _item.get(itemId, "ItemPenWidth");
            item.itemOnlyRead = _item.get(itemId, "ItemOnlyRead");
            item.itemPreviewOnly = _item.get(itemId, "ItemPreviewOnly");

            //表格明细内容需要特殊处理一下
            if (item.itemCustomType == itemCustomTypeList.detail) {
                item.itemContent = generateItemContent(item.itemContent);
            }

            if (item.itemClass == itemClassList.UpLine || item.itemClass == itemClassList.DownLine) { // 对于直线的宽高特殊处理一下
                var width = Math.abs(item.itemHeight - item.itemLeft);
                item.itemHeight = Math.abs(item.itemWidth - item.itemTop);
                item.itemWidth = width;
            }
            delete item.templateId;
        }
    });

    delete template.updateDate;
    delete template.createDate;
    template.viewWidth = LODOP.GET_VALUE("PrintInitWidth", 0);
    template.viewHeight = LODOP.GET_VALUE("PrintInitHeight", 0);
    template.templateName = $('#templateName').val();
    template.pageTop = $('#pageTop').val();
    template.pageWidth = $('#pageWidth').val();
    template.pageHeight = $('#pageHeight').val();
    template.pageLeft = $('#pageLeft').val();
    template.orient = $('#orient').val();
    template.dmPrinterDetailTemplate = templateDetail;
    loadingMsg('show', '请稍等,正在保存模板数据......');

    ajaxSend('/wos_api/printerTemplate/modifyPrinterTemplate',
            JSON.stringify(template), 'post')
        .then(function(res) {
            $('.iscsloading').hide();
            if (JSON.parse(res).code != "0") {
                throw new Error("修改失败,错误信息:"+JSON.parse(res).msg,"Error");
            }
         
            return ajaxSend('/wos_api/printerTemplate/getPrinterTemplate',
                JSON.stringify({
                    "templateId": JSON.parse(res).data.templateId
                }), 'post');
        })
        .then(function(response) {
            $('.iscsloading').hide();
            var responseJson = JSON.parse(response);
            template = responseJson.data;
            templateDetail = template.dmPrinterDetailTemplate || [];
            toastr.success('修改成功')
        })
        .fail(function(err) {
            toastr.error('修改失败,错误信息:' + JSON.stringify(err));
        });

}

/*****************************
 * 打印预览
 *****************************/
function printPreview() {

    var pageWidth = parseInt(template.pageWidth) * 10;
    var pageHeight = parseInt(template.pageHeight) * 10;
    var intOrient = template.orient;
    LODOP2 = getLodop(document.getElementById('LODOP2'), document.getElementById('LODOP_EM2'));
    LODOP2.SET_PRINT_PAGESIZE(intOrient, pageWidth, pageHeight, "A4");
    eval(LODOP.GET_VALUE('ProgramCodes', 1).replace(/LODOP/g, 'LODOP2'));
    LODOP2.PREVIEW();
}

/*****************************
 * 明细表格设置按钮
 *****************************/
function editTableDetails() {

    $('.detailItem').remove();

    var detailTitle = '<div class="text-right line-height30 col-md-4 detailItem">' +
        '<span class="color-8c">name:</span></div>';

    var detailWidth = '<div class="col-md-4 text-center pad0L detailItem">' +
        '<input type="text" id="detailId" value="detailWidthValue"></div>';

    var detailSum = '<div class="col-md-4 text-center pad3T detailItem">' +
        '<div class="checkbox c-checkbox ">' +
        '<label>' +
        '<input id="sum_detailId" type="checkbox"  checked />' +
        '<span class="fa fa-check"></span></label>' +
        ' </div>' +
        ' </div>'

    //首先隐藏lodop
    handleLodopDisplay('hide');

    $("#itemTable thead tr td").each(function() {

        var detail = $(this);

        $('#detailTableSetting').append(
            detailTitle.replace('name', detail.text()) +
            detailWidth.replace('detailId', detail.prop('id')).replace('detailWidthValue', detail.prop('width')) +
            detailSum.replace('detailId', detail.prop('id'))
            .replace('checked', $("#itemTable tfoot tr td#" + detail.prop('id')).text() == '合计' ? 'checked' : '')
        );
        //console.log(detail.prop('id') + '' + detail.prop('width')+detail.text());
    });

    $('#detailTableModal').modal('show');
}

/*****************************
 * 明细表格设置确定按钮
 *****************************/
function confirmEditTableDetails() {

    $("#itemTable thead tr td").each(function() {

        var item = $(this);
        //console.log($('input[type="text"]#'+item.prop('id')).prop('value'));
        //console.log($('input#' + item.prop('id').val());
        item.prop('width', $('input[type="text"]#' + item.prop('id')).val());
    });

    $("#itemTable tbody tr td").each(function() {

        var item = $(this);
        item.prop('width', $('input[type="text"]#' + item.prop('id')).val());
    });

    $("#itemTable tfoot tr td").each(function() {

        var item = $(this);
        item.prop('width', $('input[type="text"]#' + item.prop('id')).val());
        $('#sum_' + item.prop('id')).prop('checked') ? item.text('合计') : item.text('');
    });

    _item.set("detailTable", "ItemContent", $("#tableBox").html());

    $('#detailTableModal').modal('hide');
}

/*********************************
 * 明细表格设置取消按钮
 *********************************/
function closeEditTableDetails() {

    $('#detailTableModal').modal({
        backdrop: "false"
    });

    $('#detailTableModal').modal('hide');
}

/*********************************
 * 显示/隐藏lodop控件
 * 通过调整高度
 *********************************/
function handleLodopDisplay(mode) {

    if (mode === 'show') {
        document.getElementById('LODOP').height = $(window).height() - 60;
        document.getElementById('LODOP_EM').height = $(window).height() - 60;
    } else {
        document.getElementById('LODOP').height = "0";
        document.getElementById('LODOP_EM').height = "0";
    }
}

/*********************************
 * 显示/隐藏loading
 * 可以控制提示信息
 *********************************/

function loadingMsg(mode, msg) {

    $('#loadingMsg').text(msg);

    if (mode === 'show') {

        $('.iscsloading').show();
    } else {

        $('.iscsloading').hide();
    }
}