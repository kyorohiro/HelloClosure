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



    this.mCallerObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {
	    console.log("::onReceiveMessage:"+message);
	    console.log("---"+message.contentType);
	};
	this.onIceCandidate = function(caller,event){
	    console.log("::onIceCandidate:"+event);
	};
	this.onSetSessionDescription = function(caller,event){
	    console.log("::onSetSessionDescription:"+event);
	};
    });
    
    this.mSignalClientAdapter = new (function() {
	this.sendAnswer = function(to,from,sdp) {
	    console.log("+++sendAnswer():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, sdp, "answer");
	};
	this.sendOffer = function(to,from,sdp) {
	    console.log("+++sendOffer():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, sdp, "offer");
	};
	this.sendIceCandidate = function(to,from,candidate) {
	    console.log("+++sendIceCandidate():to="+to+",from="+from+"\n");
	    _this.mSignalClient.unicastMessage(to, from, candidate, "candidate");
	};
    });
    
    this.mSignalObserver = new(
	function() 
	{
	    this.onJoinNetwork = function(v) {
		console.log("+++onJoinNetwork(si)\n");
		console.log("---" + v.content);
		_this.mView.putItem(v["from"]);
	    };
	    
	    this.onReceiveMessage = function(message) {
		console.log("+++onReceivceMessage("+message+")from="+message["from"]);
		_this.mView.putItem(message["from"]);
		
		if("message" == message.contentType) {
		    goog.dom.$('receive').value += hetima.util.Encoder.toText(v.content) + "\n";
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
}
