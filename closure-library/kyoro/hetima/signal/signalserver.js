goog.provide('hetima.signal.SignalServer');
goog.require('hetima.signal.UserInfo');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');

var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');

hetima.signal.SignalServer = function (rootDir) {
    console.log("rootDir="+rootDir);
    this.mRootDir = rootDir;
    this.mHttpServer = null;
    this.mWsserverSocket = null;
    this.mUserInfos = new hetima.signal.UserInfo();
    this.mEncoder = new hetima.util.Bencode("text");
    this.mDecoder = new hetima.util.Bdecode("text");
    var _this = this;

    this.startServer = function(host, port) {
	this.mHttpServer = HTTP.createServer(function (req, res) {
	    console.log("onRequest="+req.url);
	    try {
		var path =  _this.mRootDir + "/" + req.url.substring(1);
		var file = Fs.readFileSync(path);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file);
	    } catch(e) {
		console.log(""+e);
	    }
	}).listen(port, host);
	console.log("Server running at http://"+host+":"+port);
    };
    
    this.startWSServer = function() {
	var _own = this;
	this.mWsserverSocket = new WSServer({httpServer:this.mHttpServer,
					     maxReceivedFrameSize: 0x1000000,
					     autoAcceptConnections: false
					    });
	this.mWsserverSocket.on('request', function(req){
	    console.log("on:"+req);
	    var websocket = req.accept(null, req.origin);

	    websocket.on('message', function(mes) {
		console.log("mes:t="+mes.type);
		console.log("mes:"+mes.binaryData.length);

		var cont = _this.mDecoder.decodeArrayBuffer(mes.binaryData, 0, mes.binaryData.length);
		console.log("mes:"+JSON.stringify(cont));
		var messageType   = cont["messageType"];
		var content       = cont["content"];
		var to            = cont["to"];
		var from          = cont["from"];
		console.log("to:"+to);
		console.log("from:"+from);
		_own.mUserInfos.add(from, websocket)
		
		if(messageType === "unicast") {
		    var v = {}
		    v["content"] = content;
		    v["to"]      = to;
		    v["from"]    = from;
		    var s=_this.mEncoder.encodeObject(v);
		    _own.uniMessage(to, s.getUint8Array());
		} else if(messageType =="broadcast") {
		    var v = {}
		    v["content"]     = content;
		    v["from"]        = from;
		    var s=_this.mEncoder.encodeObject(v);
		    _own.broadcastMessage(s.getUint8Array());
		} 
	    });
	});
    };
    
    this.broadcastMessage = function(_message) {
	console.log("----broadcast----");
	this.mUserInfos.show();
	var keys = this.mUserInfos.keys();
	while(keys.length != 0) {
	    var key = keys.pop();
	    var socket = this.mUserInfos.get(key)["socket"];
	    socket.send(this.toBuffer(_message.buffer));
	    console.log(_message);
	}
	console.log("----//broadcast-----");
    }
    
    this.uniMessage = function(to,_message) {
	console.log("----uni----"+to);
	try {
	    var socket = this.mUserInfos.get(to)["socket"];
	    socket.send(this.toBuffer(_message.buffer));
	    console.log(_message);
	} catch(e) {
	    console.log(e);
	}
	console.log("----//uni-----");
    }

    //http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
    this.toBuffer = function(ab) {
	var buffer = new Buffer(ab.byteLength);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
	}
	return buffer;
    }
};
