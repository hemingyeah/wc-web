
/**
 * socket.io服务
 */
app.factory('socketService', ['socketFactory',function (socketFactory) {
  
  var myIoSocket = io.connect(app.websocket_url);//后端地址
  
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
  
}]);