goog.provide('hetima.signal.Messenger');

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
// send ascii or binary data.
//
hetima.signal.Messenger = function() 
{
    var _this = this;
    this.mMyAddress;
    this.mSignalClient;
    this.mCallerList

    //
    // receive notification event from this class.
    //
    this.mMessengerObserverList = new (function(){
	var _own = this;
	this.decorator = new Array();//undefined;
	this.onError = function(model, event) {
	    console.log("++[m]+onError:"+event);
	    for(var i=0;i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onError == undefined) {
		    continue;
		}
		d.onError(model, event);
	    }
	};
	this.onClose = function(model, event) {
	    console.log("++[m]+onError:"+event);
	    for(var i=0;i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onClose == undefined) {
		    continue;
		}
		d.onClose(model, event);
	    }
	};
	this.onFind = function(model, uuid) {
	    console.log("++[m]+onConnect:"+uuid);
	    for(var i=0; i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onFind == undefined) {
		    continue;
		}
		d.onFind(model, uuid);
	    }
	};
	this.onCallerOpen = function(model, caller, event) {
	    console.log("++[m]+onConnect:"+event);
	    for(var i=0; i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onCallerOpen == undefined) {
		    continue;
		}
		d.onCallerOpen(model, caller, event);
	    }
	};
	this.onCallerReceiveMessage = function(model, caller, message) {
	    console.log("++[m]+onReceiveMessage:"+message);
	    for(var i=0; i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onCallerReceiveMessage == undefined) {
		    continue;
		}
		d.onCallerReceiveMessage(model, caller, message);
	    }
	};
	this.onCallerClose = function(model, caller, event) {
	    console.log("++[m]+onClose:"+event);
	    for(var i=0; i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onCallerClose == undefined) {
		    continue;
		}
		d.onCallerClose(model, caller, event);
	    }
	};
	this.onCallerError = function(model, caller, error) {
	    console.log("++[m]+onError:"+error);
	    for(var i=0; i<_own.decorator.length;i++) {
		var d = _own.decorator[i]
		if(d == undefined || d.onCallerError == undefined) {
		    continue;
		}
		d.onCallerError(model, caller, error);
	    }
	}
    });

    this.mCallerObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {
	    console.log("++[c]+onReceiveMessage:"+message +","+message.contentType);
	    var _obj = _this.transfer(message);
	    var _type = hetima.util.Encoder.toText(_obj["messagetype"]);
	    if(_type == "direct") {
		_this.mMessengerObserverList.onCallerReceiveMessage(_this, caller, _obj);		
	    } else if( _type == "relay"){
		var toAddr = _obj["to"];
		if(toAddr == _this.mMyAddress) {
		    _this.mMessengerObserverList.onCallerReceiveMessage(_this, caller, _obj);		
		    return;
		} else {
		    _this.sendMessage(toAddr, message, "relay"); 
		}
	    }
	};
	this.onIceCandidate = function(caller,event){
	    console.log("++[c]+onIceCandidate:"+event);
	};
	this.onSetSessionDescription = function(caller,event){
	    console.log("++[c]+onSetSessionDescription:"+event);
	};
	this.onNotifyError = function (caller, error){
	    console.log("++[c]+onError:"+error.toString());
	    _this.mMessengerObserverList.onCallerError(_this, caller, error);
	}
	this.onOpen = function(caller,event){
	    console.log("++[c]+onOpen:"+event);
	    _this.mMessengerObserverList.onCallerOpen(_this, caller, event);
	}
	this.onClose = function(caller,event){
	    console.log("++[c]+onClose:"+event);
	    _this.mMessengerObserverList.onCallerClose(_this, caller, event);
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
		var content = {};
		if(_this.mMyAddress != v.from) {
		    _this.mCallerList.add(v.from, content);
		    _this.mMessengerObserverList.onFind(_this, v["from"]);
		}
	    };
	    
	    this.onReceiveMessage = function(message) {
		console.log("++[s]+onReceivceMessage("+message+")from="+message["from"]);
		
		if("message" == message.contentType) {
		    // 
		}
		else if("answer" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller = callerinfo.content.caller;
		    caller.setRemoteSDP("answer", hetima.util.Encoder.toText(message.content));
		}
		else if("offer" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller;
		    if(callerinfo == undefined) {
			caller = new hetima.signal.Caller(_this.mMyAddress).setTargetUUID(message["from"]);
			caller.setEventListener(_this.mCallerObserver);
			caller.setSignalClient(_this.mSignalClientAdapter);
			var content = {};
			content.caller = caller;
			_this.mCallerList.add(message["from"], content);
			caller.createPeerConnection();
		    } else {
			caller = callerinfo.content.caller;
		    }
		    caller.setRemoteSDP("offer", hetima.util.Encoder.toText(message.content));
		    caller.createAnswer();
		}
		else if("candidate" == message.contentType) {
		    var callerinfo = _this.mCallerList.findInfo(message["from"]);
		    var caller = callerinfo.content.caller;
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
    this.addEventListener = function(observer) {
	_this.mMessengerObserverList.decorator.push(observer);
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
	var content = {};
	content.caller = caller;
	_this.mCallerList.add(to, content);
	caller.createPeerConnection();
	caller.createOffer();
    };

    //
    // send message
    //
    this.sendMessage = function(to, message, messagetype) 
    {
	if(messagetype == undefined) {
	    messagetype = "direct";
	}
	var callerinfo = _this.mCallerList.findInfo(to);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content.caller;
	if(caller == undefined) {return;}
	var pack = {};
	pack["messagetype"] = messagetype;
	pack["content"]     = message;
	caller.sendMessage(hetima.util.Encoder.toText(hetima.util.Bencode.encode(pack)));
    };

    this.sendPack = function(to, pack) 
    {
	var callerinfo = _this.mCallerList.findInfo(to);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content;
	if(caller == undefined) {return;}
	caller.sendMessage(hetima.util.Encoder.toText(hetima.util.Bencode.encode(pack)));
    };

    this.transfer = function(pack)
    {
	return hetima.util.Bencode.decode(pack);
    }

    //
    // relay message
    //
    this.relayMessage = function(to, relay, message) 
    {
	var callerinfo = _this.mCallerList.findInfo(relay);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content.caller;
	if(caller == undefined) {return;}
	var pack = {};
	pack["messagetype"] = "relay";
	pack["from"]        = mMyAddress;
	pack["to"]          = to;
	pack["content"]     = message;
	caller.sendMessage(hetima.util.Encoder.toText(hetima.util.Bencode.encode(pack)));
    };

    this.getCallerList = function()
    {
	return _this.mCallerList;
    };
}
