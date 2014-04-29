goog.provide('hetima.signal.Messenger');
goog.require('goog.dom');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

goog.require('hetima.signal.SignalClient');
goog.require('hetima.signal.Caller');
goog.require('hetima.util.UUID');
goog.require('hetima.util.BencodeHelper');
goog.require('hetima.signal.UserInfo');

goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.Encoder');

//
// 
// send ascii or binary data.
//
hetima.signal.Messenger = function() 
{
    var _this = this;
    this.mMyAddress;
    this.mSignalClient;
    this.mCallerList
    this.mBencoder = new hetima.util.Bencode();
    this.mBdecoder = new hetima.util.Bdecode();
    this.mEncoder = new hetima.util.Encoder();
    //
    // receive notification event from this class.
    //
    this.mObserver = new (function(){
	var _own = this;
	this.decorator = undefined;
	this.onError = function(model, event) {
	    console.log("++[m]+onError:"+event);
	    if(_own.decorator == undefined || _own.decorator.onError == undefined) {
		return;
	    }
	    _own.decorator.onError(model, event);
	};
	this.onClose = function(model, event) {
	    console.log("++[m]+onError:"+event);
	    if(_own.decorator == undefined || _own.decorator.onClose == undefined) {
		return;
	    }
	    _own.decorator.onClose(model, event);
	};
	this.onFind = function(model, uuid) {
	    console.log("++[m]+onConnect:"+uuid);
	    if(_own.decorator == undefined || _own.decorator.onFind == undefined) {
		return;
	    }
	    _own.decorator.onFind(model, uuid);
	};
	this.onCallerOpen = function(model, caller, event) {
	    console.log("++[m]+onConnect:"+event);
	    if(_own.decorator == undefined || _own.decorator.onCallerOpen == undefined) {
		return;
	    }
	    _own.decorator.onCallerOpen(model, caller, event);
	};
	this.onCallerReceiveMessage = function(model, caller, message) {
	    console.log("++[m]+onReceiveMessage:"+message);
	    if(_own.decorator == undefined || _own.decorator.onCallerReceiveMessage == undefined) {
		return;
	    }
	    _own.decorator.onCallerReceiveMessage(model, caller, message);
	};
	this.onCallerClose = function(model, caller, event) {
	    console.log("++[m]+onClose:"+event);
	    if(_own.decorator == undefined || _own.decorator.onCallerClose == undefined) {
		return;
	    }
	    _own.decorator.onCallerClose(model, caller, event);
	}
	this.onCallerError = function(model, caller, error) {
	    console.log("++[m]+onError:"+error);
	    if(_own.decorator == undefined || _own.decorator.onCallerError == undefined) {
		return;
	    }
	    _own.decorator.onCallerError(model, caller, error);
	}
    });

    this.mCallerObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {
	    console.log("++[c]+onReceiveMessage:"+message +","+message.contentType);
	    _this.mObserver.onCallerReceiveMessage(_this, caller, _this.transfer(message));
	};
	this.onIceCandidate = function(caller,event){
	    console.log("++[c]+onIceCandidate:"+event);
	};
	this.onSetSessionDescription = function(caller,event){
	    console.log("++[c]+onSetSessionDescription:"+event);
	};
	this.onNotifyError = function (caller, error){
	    console.log("++[c]+onError:"+error.toString());
	    _this.mObserver.onCallerError(_this, caller, error);
	}
	this.onOpen = function(caller,event){
	    console.log("++[c]+onOpen:"+event);
	    _this.mObserver.onCallerOpen(_this, caller, event);
	}
	this.onClose = function(caller,event){
	    console.log("++[c]+onClose:"+event);
	    _this.mObserver.onCallerClose(_this, caller, event);
	}
    });
    
    this.mSignalClientAdapter = new (function() {
	this.sendAnswer = function(to,from,sdp) {
	    console.log("++[a]+sendAnswer():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, sdp, "answer");
	};
	this.sendOffer = function(to,from,sdp) {
	    console.log("++[a+sendOffer():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, sdp, "offer");
	};
	this.sendIceCandidate = function(to,from,candidate) {
	    console.log("++[a]+sendIceCandidate():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, candidate, "candidate");
	};
    });
    
    this.mSignalObserver = new(
	function() 
	{
	    this.onJoinNetwork = function(v) {
		console.log("++[s]+onJoinNetwork(si)\n");
		_this.mObserver.onFind(_this, v["from"]);
	    };
	    
	    this.onReceiveMessage = function(message) {
		console.log("++[s]+onReceivceMessage("+message+")from="+message["from"]);
		
		if("message" == message.contentType) {
		    // 
		}
		else if("answer" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller = callerinfo.content;
		    caller.setRemoteSDP("answer", hetima.util.Encoder.toText(message.content));
		}
		else if("offer" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller;
		    if(callerinfo == undefined) {
			caller = new hetima.signal.Caller(_this.mMyAddress).setTargetUUID(message["from"]);
			caller.setEventListener(_this.mCallerObserver);
			caller.setSignalClient(_this.mSignalClientAdapter);
			_this.mCallerList.add(message["from"], caller);
			caller.createPeerConnection();
		    } else {
			caller = callerinfo.content;
		    }
		    caller.setRemoteSDP("offer", hetima.util.Encoder.toText(message.content));
		    caller.createAnswer();
		}
		else if("candidate" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller = callerinfo.content;
		    caller.addIceCandidate(
			hetima.util.BencodeHelper.buffer2Text(message.content));
		}
		else {
		    console.log("::ASSRET::#################################");
		}
		
	    };
	}
    );


    //
    // initialize
    // 
    this.init = function()
    {
	console.log("init()");
	_this.mMyAddress = hetima.util.UUID.getID();
	console.log("::uuid=" + _this.mMyAddress);
	_this.mCallerList = new hetima.signal.UserInfo();
	_this.mSignalClient = new hetima.signal.SignalClient("ws://localhost:8080");
	_this.mSignalClient.setPeer(_this.mSignalObserver);
    };

    //
    // registed then, receive notification event from this class.
    //
    this.setEventListener = function(observer) {
	_this.mObserver.decorator = observer;
    };

    //
    // start find device
    //
    this.start = function()
    {
	_this.mSignalClient.join(_this.mMyAddress);
    };

    //
    // connect device
    //
    this.connect = function(to)
    {
	var caller = new hetima.signal.Caller(_this.mMyAddress).setTargetUUID(to);
	caller.setEventListener(_this.mCallerObserver);
	caller.setSignalClient(_this.mSignalClientAdapter);
	_this.mCallerList.add(to, caller);
	caller.createPeerConnection();
	caller.createOffer();
    };

    //
    // send message
    //
    this.sendMessage = function(to, message) 
    {
	var callerinfo = _this.mCallerList.findInfo(to);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content;
	if(caller == undefined) {return;}
	var pack = {};
	pack["messagetype"] = "direct";
	pack["contenttype"] = "text";
	pack["content"]     = message;
	console.log("len="+_this.mBencoder.encodeObject(pack).getUint8Array().length);
	caller.sendMessage(_this.mBencoder.encodeObject(pack).getUint8Array().buffer);
    };

    this.transfer = function(pack)
    {
	return hetima.util.Encoder.toText(pack);
	//_this.mBdecoder.decodeArrayBuffer(
	//    new Uint8Array(pack), 0, pack.byteLength);
    }

    //
    // relay message
    //
    this.relayMessage = function(to, relay, message) 
    {
	var callerinfo = _this.mCallerList.findInfo(relay);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content;
	if(caller == undefined) {return;}
	
	caller.sendMessage(message.slice(0,10*1000));
    };
}
