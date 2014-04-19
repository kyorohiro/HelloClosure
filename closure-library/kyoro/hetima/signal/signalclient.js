goog.provide('hetima.signal.SignalClient');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.Encoder');

hetima.signal.SignalClient = function (url) {
    var _this = this;
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    this.mBencoder = new hetima.util.Bencode();
    this.mBdecoder = new hetima.util.Bdecode();
    this.mEncoder = new hetima.util.Encoder();
//    this.mAutoConnect = true;

    this.mPeer = new (function() {
	this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
	this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
	this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
	this.onJoinNetwork = function(v) {
	    console.log("+++onJoinNetwork("+JSON.stringify(parsedData)+")");
	}
	this.onReceiveMessage = function(v) {
	    console.log("+++onReceivceMessage("+JSON.stringify(parsedData)+")");
	}
    });


    this.setPeer = function(peer) {
	this.mPeer = peer;
    };

    this.onReceiveMessage = function(message) {
	console.log("+++onReceivceMessage("+JSON.stringify(message)+")");
	var body = message.content;
	var v = {};

	v.content     = body["body"];
	v.contentType = hetima.util.Encoder.toText(body["contentType"]);
	v.from        = hetima.util.Encoder.toText(message["from"]);
	v.to          = hetima.util.Encoder.toText(message["to"]);
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
	this.ws.send(_this.mBencoder.encodeObject(v).getUint8Array().buffer);
    };

    this.unicastMessage = function(to, from, content) {
	console.log("::::::::::::::::unicastMessage : to="+to+",from="+from+",content="+content);
	var v = {};
	var b = {};
	v["to"]          = to;
	v["from"]        = from;
	v["messageType"] = "unicast";
	b["contentType"] = "message";
	b["body"]        = content;
	v["content"]     = b;
	this.ws.send(_this.mBencoder.encodeObject(v).getUint8Array().buffer);
    };

    this.ws.onmessage = function(m) {
	console.log("+++("+hetima.util.Encoder.toText(new Uint8Array(m.data))+")");
//	var parsedData = _this.mBdecoder.decodeArrayBuffer(m.data, 0, m.data.byteLength);
	var parsedData = _this.mBdecoder.decodeArrayBuffer(new Uint8Array(m.data), 0, m.data.byteLength);
	_this.onReceiveMessage(parsedData);
    };

    this.ws.onclose = function(m) {
	console.log("--onClose()"+m);
    };

};
