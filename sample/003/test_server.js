require('../../closure-library/closure/goog/bootstrap/nodejs');
require('../../closure-library/kyoro/hetima/deps.js');
goog.require('hetima.signal.SignalServer');

var server = new hetima.signal.SignalServer("../../");
server.startServer("127.0.0.1", 8080);
server.startWSServer();


