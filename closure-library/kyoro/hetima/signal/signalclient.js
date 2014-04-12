goog.provide('hetima.signal.SignalClient');

hetima.signal.SignalClient = function (url) {
    this.ws = new WebSocket(url);
    this.mList = new Array();

    this.mPeer = new (function() {
	this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
	this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
	this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
	this.onJoinNetwork = function(v) {console.log("+++onJoinNetwork(si)\n");}
	this.onReceiveMessage = function(v) {console.log("+++onReceivceMessage("+v+")\n");}
    });

    this.setPeer = function(peer) {
	this.mPeer = peer;
    };

    this.onReceiveMessage = function(message) {
	var body = message.content;
	var v = {};
	v.contentType = body["contentType"];
	v.content     = body["body"];
	v.from        = message["from"];
	v.to          = message["to"];
	console.log("::::::::::::::::onReeive"+v.contentType+","+v.from);
	if ("join" === v.contentType) {
	    this.mPeer.onJoinNetwork(v);
	} else if ("answer"=== v.contentType) {
	    this.mPeer.onReceiveAnswer(v)
	} else if ("offer" === v.contentType) {
	    this.mPeer.startAnswerTransaction("server",v);
	} else if("candidate" == v.contentType){
	    this.mPeer.addIceCandidate(v);
	} else if("message" == v.contentType){
	    this.mPeer.onReceiveMessage(v);
	}
    };

    this.send = function() {
	this.ws.send("hello");
    };

    this.join = function(from) {
	console.log("::::::::::::::::join");
	this.broadcastMessage(from,"hello","join");
    };

    this.broadcastMessage = function(from, content, contentType) {
	console.log("::::::::::::::::broadcastMessage : from="+from+",content="+content);
	if(contentType == undefined) {
	    contentType = "message";
	}
	var v = {};
	var b = {};
	v["from"]        = from;
	v["messageType"] = "broadcast";
	b["contentType"] = contentType;
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(JSON.stringify(v));
    };

    this.unicastMessage = function(to, from, content) {
	console.log("::::::::::::::::unicastMessage : from="+from+",content="+content);
	var v = {};
	var b = {};
	v["to"]          = to;
	v["from"]        = from;
	v["messageType"] = "unicast";
	b["contentType"] = "message";
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(JSON.stringify(v));
    };

    this.sendOffer = function(to, from, content) {
	console.log("::::::::::::::::sendOffer");
	var v = {};
	var b = {};
	v["to"]          = to;
	v["from"]        = from;
	v["messageType"] = "unicast";
	b["contentType"] = "offer";
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(JSON.stringify(v));
    };

    this.sendCandidate = function(to, from, content) {
	console.log("::::::::::::::::sendCandidate");
	var v = {};
	var b = {};
	v["to"]          = to;
	v["from"]        = from;
	v["messageType"] = "unicast";
	b["contentType"] = "candidate";
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(JSON.stringify(v));
    };

    this.sendAnswer = function(to, from, content) {
	console.log("::::::::::::::::sendAnswer");
	var v = {};
	var b = {};
	v["to"]          = to;
	v["from"]        = from;
	v["messageType"] = "unicast";
	b["contentType"] = "answer";
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(JSON.stringify(v));
    };

    var _own = this;
    this.ws.onmessage = function(m) {
	console.log("::::::::::::::::pnmessage");
	var parsedData = JSON.parse(m.data);
	var contentType = parsedData["contentType"];
	var uuid = parsedData["_from"];
	console.log("--onSignalClient#WS#OnMessage():"+contentType+","+uuid);
	if("join" === contentType) {
	    var v={};
	    v.name = "dummy";
	    _own.mList[uuid] = v;
	}
	_own.onReceiveMessage(parsedData);
    };

    this.ws.onclose = function(m) {
	console.log("--onClose()"+m);
    };

    this.onTransferMessage = function(caller, message) {

    }
};
