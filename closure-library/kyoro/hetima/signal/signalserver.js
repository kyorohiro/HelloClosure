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
    hetima.util.Bencode.sMode  = "server";
    hetima.util.Bencode.sType  = "binary";
    var _this = this;

    this.startServer = function(host, port) {
	this.mHttpServer = HTTP.createServer(function (req, res) {
	    console.log("onRequest="+req.url);
	    try {
		var path =  _this.mRootDir + "/" + req.url.substring(1);
		Fs.statSync(path);
		var file = Fs.readFileSync(path);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file);
	    } catch(e) {
		console.log(""+e);
		res.writeHead(404);
		res.write("404");
		res.end();
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
		var cont = hetima.util.Bencode.decode(mes.binaryData);
		console.log("mes:"+JSON.stringify(cont));
		var messageType   = cont["messageType"];
		var content       = cont["content"];
		var to            = cont["to"];
		var from          = cont["from"];

		console.log("type:"+messageType+",to:"+to+",from:"+from);
		{ // recent list
//		    console.log("to:"   + hetima.util.Encoder.toText(to));
//		    console.log("from:" + hetima.util.Encoder.toText(from));
		    _own.mUserInfos.add(hetima.util.Encoder.toText(from), websocket);
		}
		var _messageType = hetima.util.Encoder.toText(messageType);
		if(_messageType === "unicast") {
		    var v = {}
		    v["content"] = content;
		    v["to"]      = to;
		    v["from"]    = from;
		    var s = hetima.util.Bencode.encode(v);
		    _own.uniMessage(hetima.util.Encoder.toText(to), s);
		} else if(_messageType ==="broadcast") {
		    var v = {}
		    v["content"]     = content;
		    v["from"]        = from;
		    var s= hetima.util.Bencode.encode(v);
		    _own.broadcastMessage(s);
		} else if(_messageType ==="list") {
		    var v = {}
		    v["content"] = {};
		    v["content"]["body"] = _own.mUserInfos.getList();
		    v["content"]["contentType"] = "list";
		    v["from"]        = from;
		    var s= hetima.util.Bencode.encode(v);
		    _own.uniMessage(hetima.util.Encoder.toText(from), s);
		}
	    });
	});
    };

    
    this.broadcastMessage = function(_message) {
	console.log("----broadcast----"+_message);
	for(var i=0;i<this.mUserInfos.length();i++) {
	    var socket = this.mUserInfos.get(i)["content"];
	    socket.send(_message);
	    console.log(hetima.util.Encoder.toText(_message));
	}
	console.log("----//broadcast-----");
    }
    
    this.uniMessage = function(to,_message) {
	console.log("----uni----"+to);
	try {
	    var info = this.mUserInfos.findInfo(to);
	    if(info == undefined) {
		console.log("----//uni--e---");
		return;
	    }
	    var socket = info["content"];
	    socket.send(_message);
	    console.log(hetima.util.Encoder.toText(_message));
	} catch(e) {
	    console.log(e);
	}
	console.log("----//uni-----");
    }

};
