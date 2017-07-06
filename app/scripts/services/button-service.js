app.value('btnGroup', {
    gridBtns: [{
        "code": "add",
        "name": "添加",
        "index": 2001,
        "icon": "fa fa-plus"
    }],
    baseBtns: [{ //由于右浮动原因，现排序大号在前
        "code": "add",
        "name": "base.new",
        "index": 1000,
        "icon": "fa fa-plus",
        "group": false,
        "float": false //静止浮动排列在左侧
    }, {
        "code": "delete",
        "name": "base.delete",
        "index": 1006,
        "icon": "fa fa-trash-o",
        "group": false
    }, {
        "code": "edit",
        "name": "base.edit",
        "index": 1007,
        "icon": "fa fa-pencil",
        "group": false
    }, {
        "code": "refresh",
        "name": "base.refresh",
        "index": 1001,
        "icon": "fa fa-refresh",
        "group": false
    }, {
        "code": "setting",
        "name": "base.set",
        "index": 1001,
        "icon": "",
        "group": false
    }, {
        "code": "setExpress",
        "name": "base.setExpress",
        "index": 1002,
        "icon": "",
        "group": false
    }]
})
