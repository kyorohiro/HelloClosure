goog.provide('AppModel');
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

goog.require('AppView');



// handshake ui
var mView;

AppModel =function() 
{
    var _this = this;
    this.mMyAddress;
    this.mSignalClient;
    this.mCallerList;

    //
    // 
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

    this.setEventListener = function(observer) {
	_this.mObserver.decorator = observer;
    };

    this.mCallerObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {
	    console.log("++[c]+onReceiveMessage:"+message +","+message.contentType);
	    _this.mObserver.onCallerReceiveMessage(_this, caller, message);
	};
	this.onIceCandidate = function(caller,event){
	    console.log("++[c]+onIceCandidate:"+event);
	};
	this.onSetSessionDescription = function(caller,event){
	    console.log("++[c]+onSetSessionDescription:"+event);
	};
	this.onNotifyError = function (caller, error){
	    console.log("++[c]+onError:"+error.toString());
	    _this.mObserver.onCallerError(this. caller, error);
	}
	this.onOpen = function(caller,event){
	    console.log("++[c]+onOpen:"+event);
	    _this.mObserver.onCallerOpen(this. caller, event);
	}
	this.onClose = function(caller,event){
	    console.log("++[c]+onClose:"+event);
	    _this.mObserver.onCallerClose(this. caller, event);
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
		_this.mView.putItem(message["from"]);
		
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


    this.setInitValue = function(view)
    {
	_this.mView = view;
    }
    this.init = function()
    {
	console.log("init()");
	_this.mMyAddress = hetima.util.UUID.getID();
	console.log("::uuid=" + _this.mMyAddress);
	_this.mCallerList = new hetima.signal.UserInfo();
	_this.mSignalClient = new hetima.signal.SignalClient("ws://localhost:8080");
	_this.mSignalClient.setPeer(_this.mSignalObserver);
    };
    
    this.start = function()
    {
	_this.mSignalClient.join(_this.mMyAddress);
    };
    
    this.connect = function(to)
    {
	var caller = new hetima.signal.Caller(_this.mMyAddress).setTargetUUID(to);
	caller.setEventListener(_this.mCallerObserver);
	caller.setSignalClient(_this.mSignalClientAdapter);
	_this.mCallerList.add(to, caller);
	caller.createPeerConnection();
	caller.createOffer();
    };

    this.sendMessage = function(to, message) 
    {
	var callerinfo = _this.mCallerList.findInfo(to);
	if(callerinfo == undefined) {return;}
	var caller = callerinfo.content;
	if(caller == undefined) {return;}
	caller.sendMessage(message);
    };
}
