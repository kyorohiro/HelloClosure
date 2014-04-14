goog.provide('hetima.signal.SignalServer');
goog.require('hetima.signal.UserInfo');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.Encoder');

var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');

hetima.signal.SignalServer = function (rootDir) {
    console.log("rootDir="+rootDir);
    this.mRootDir = rootDir;
    this.mHttpServer = null;
    this.mWsserverSocket = null;
    this.mUserInfos = new hetima.signal.UserInfo(10);
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
		var cont = _this.mDecoder.decodeArrayBuffer(mes.binaryData, 0, mes.binaryData.length);
		console.log("mes:"+JSON.stringify(cont));
		var messageType   = cont["messageType"];
		var content       = cont["content"];
		var to            = cont["to"];
		var from          = cont["from"];

		console.log("type:"+messageType+",to:"+to+",from:"+from);
		{ // recent list
		    console.log("to:"   + hetima.util.Encoder.toText(to));
		    console.log("from:" + hetima.util.Encoder.toText(from));
		    _own.mUserInfos.add(hetima.util.Encoder.toText(from), websocket);
		}

		if(messageType === "unicast") {
		    var v = {}
		    v["content"] = content;
		    v["to"]      = to;
		    v["from"]    = from;
		    var s=_this.mEncoder.encodeObject(v);
		    _own.uniMessage(to, s.getUint8Array());
		} else if(messageType ==="broadcast") {
		    var v = {}
		    v["content"]     = content;
		    v["from"]        = from;
		    var s=_this.mEncoder.encodeObject(v);
		    _own.broadcastMessage(s.getUint8Array());
		} else if(messageType === "list") {
		    var v = {};
		    v["list"] = [];

		}
	    });
	});
    };

    
    this.broadcastMessage = function(_message) {
	console.log("----broadcast----");
	for(var i=0;i<this.mUserInfos.length();i++) {
	    var socket = this.mUserInfos.get(i)["socket"];
	    socket.send(_message);
	    console.log(hetima.util.Encoder.toText(_message));
	}
	console.log("----//broadcast-----");
    }
    
    this.uniMessage = function(to,_message) {
	console.log("----uni----"+to);
	try {
	    var socket = this.mUserInfos.get(to)["socket"];
	    socket.send(_message.buffer);
	    console.log(_message);
	} catch(e) {
	    console.log(e);
	}
	console.log("----//uni-----");
    }

};
