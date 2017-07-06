//http://www.expressjs.com.cn/starter/hello-world.html

var express = require('express');
var app = express();
var server = require('http').Server(app);
var multipart = require('connect-multiparty'); //处理文件上传
var fs = require('fs');
var path = require('path');

//https://github.com/socketio/engine.io#methods-1
//https://github.com/socketio/socket.io/issues/1995#issuecomment-73955941
var ioServer = require('socket.io'); //chu
var io = new ioServer(server);

var fs = require('fs');

app.use(multipart({
  uploadDir: "server/upload"
}));

server.listen(8081);


// 静态文件目录
var staticDir = path.join(__dirname, '/upload');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(staticDir));

//登录接口
app.post('/base/login', function(req, res) {
  fs.readFile('./server/api/login.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
  //res.json({"code":"0","msg":"","data":{"token":"B1285192E36CC63F23F2428EBAF9A37F"}});
  //res.send('you have send post message');
});

//菜单接口
app.post('/response/findAllPage', function(req, res) {
  fs.readFile(__dirname+'/api/menu.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
});

app.get('/sidebar-menu.json', function(req, res) {
  fs.readFile(__dirname+'/api/sidebar-menu.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
});
//图表数据
app.get('/capacity-report.json', function(req, res) {
  fs.readFile('./server/api/capacity-report.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
});

//首页报表数据
app.get('/data.json', function(req, res) {
  fs.readFile(__dirname+'/api/data.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
});

//打印模板列表页
app.post('/printerTemplate/gets', function(req, res) {
  fs.readFile(__dirname+'/api/printTemplate.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.log(error);
    res.send(data);
  });
});

//打印机设置列表页
app.post('/dmDevicePrinter/getPrinters', function(req, res) {
  fs.readFile(__dirname+'/api/printers.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//平台退款单列表页
app.post('/originRefund/list', function(req, res) {
  fs.readFile(__dirname+'/api/refundOrder.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//原始订单列表页
app.post('/originTrade/list', function(req, res) {
  fs.readFile(__dirname+'/api/originTrade.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//仓库预测需求列表页面数据
app.post('/demandForecast/getConInfos', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecast.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//仓库预测需求详情页面数据
app.post('/demandForecast/detail', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecastDetail.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//仓库预测需求新增接口
app.post('/demandForecast/edit', function(req, res) {
  console.log(req);
});

//预测结果报表数据
app.post('/dfDemandForecast/getDfForecastData', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecastReport.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//仓库需求预测新增接口下拉框数据源
app.post('/comboBox/getComBoxListData', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecastChooseData.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//获取需方接口
app.post('/comboBox/getCBUDefinedCode', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecastDemandUnit.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//获取品类接口
app.post('/comboBox/getICDefinedCode', function(req, res) {
  fs.readFile(__dirname+'/api/demandForecastCategory.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});


//原始订单-选择快递弹框
app.post('/originTrade/express', function(req, res) {

  fs.readFile(__dirname+'/api/express.json', {
    encoding: 'utf-8'
  }, function(error, data) {
    if (error) console.error(error);
    res.send(data);
  });
});

//socket.io
io.on('connection', function(socket) {

  socket.emit('news', {
    hello: 'world'
  });

  socket.emit('anytao', {
    name: 'welcome to use socket.io services'
  });

  socket.on('my other event', function(data) {
    console.log(data);
    socket.emit('anytao', 'I Have Received Message');
  });

  socket.on('fromPage', function(data) {
    console.log(data);
  });

  setTimeout(function() {
    socket.emit('anytao', {
      name: 'welcome to use socket.io services again!!!'
    });
  }, 20000);
});

/**
 * 处理文件上传
 */
app.post('/file/upload', function(req, res) {

  var uploadResult = {};
  uploadResult.status = '200';
  uploadResult.code = '0';

  var file = req.files.file;
  // var filepath = file.path;
  // var uploadPath = __dirname + '\\upload';
  // console.log(uploadPath);
  // var basename = path.basename(filepath);
  // fs.renameSync(filepath, uploadPath + '/' + basename);
  var basename = path.basename(file.path);
  uploadResult.data = {
    path: basename
  }
  res.send(uploadResult);
});

/*
var express = require('express');
var modRewrite = require('connect-modrewrite');
var historyApiFallback = require('connect-history-api-fallback');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable')
var app = express();
var util = require('util');
var fs=require('fs');

// 静态文件目录
var staticDir = path.join(__dirname, '../dist');

//解析客户端请求的body
app.use(bodyParser()); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb' }));

app.use(modRewrite([
                    '^/api/(.*)$ http://localhost:8081/api/$1 [P]',
                    '^/ecm_api/(.*)$ http://192.168.200.59:8080/$1 [P]'
                   ]));
app.use(historyApiFallback());
app.use('/', express.static(staticDir));


app.get('/print.html', function (req, res) {
  res.send('Hello World!');
});

app.post('/node_api/savePrint',function(req,res){
    
    var form = new formidable.IncomingForm();
        form.uploadDir="./api";//必须设置
    form.parse(req, function(err, fields, files) {
      fs.renameSync(files.upload.path,"./api/"+fields.username+".grf");
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
*/ 