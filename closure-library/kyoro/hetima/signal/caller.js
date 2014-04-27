goog.provide('hetima.signal.Caller');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.Encoder');


hetima.signal.Caller = function Caller(id) {
    var _this = this;
    this.mPc = null;
    this.mPcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//    this.mPcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}]};//, {'RtpDataChannels': true }] };
    this.mPcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };
    this.mMyUUID = id;
    this.mTargetUUID = "";
    this.mDataChannel = null;
    
    this.mObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {
	    console.log("+++_ onReceiveMessage()\n");}
	this.onIceCandidate = function(caller,event){;}
	this.onSetSessionDescription = function(caller,event){;}
	this.onNotifyError = function(caller, error){;}
	this.onOpen = function(caller,event){;}
	this.onClose = function(caller,event){;}
    });

    this.mSignalClient = new (function() {
	this.sendAnswer = function(to,from,sdp) {
	    console.log("+++sendAnswer()\n");}
	this.sendOffer = function(to,from,sdp) {
	    console.log("+++sendOffer()\n");}
	this.sendIceCandidate = function(to,from,candidate) {
	    console.log("+++sendIceCandidate()\n");}
    });
    
    this.setEventListener =function(observer) {
	this.mObserver = observer;
	return this;
    };
    
    this.setSignalClient =function(client) {
	this.mSignalClient = client;
	return this;
    };
    
    this.getSignalClient =function() {
	return this.mSignalClient;
    };

    this.getRawPeerConnection = function() 
    {
	return this.mPc;
    };

    this.setTargetUUID = function(uuid) {
	this.mTargetUUID = uuid;
	return this;
    };

    this.getTargetUUID = function() {
	return this.mTargetUUID;
    };
    
    this.getMyUUID = function() {
	return this.mMyUUID;
    };
    
    this.getLocalDescription = function() {
	try {
	    return _this.mPc.localDescription;
	} catch(e) {
	    return null;
	}
    };
    
    this.createPeerConnection = function() {
	console.log("+++createPeerConnection()\n");
	try {
	    this.mPc = new webkitRTCPeerConnection(this.mPcConfig, this.mPcConstraints);
	    this.mDataChannel = this.mPc.createDataChannel("channel",{});
	    
	    this.setChannelEvents();
	    this.mPc.onicecandidate = function (event) {//RTCIceCandidateEvent
		if(event.candidate) {
		    console.log("+onIceCandidate("+event+","+event.candidate+"):"+hetima.signal.Caller.iceCandidateType(_this.mPc.localDescription.sdp));
		    _this.mObserver.onIceCandidate(_this, event);
		    _this.mSignalClient.sendIceCandidate( _this.getTargetUUID(), _this.getMyUUID(), event.candidate);
		} else {
		    _this.mObserver.onIceCandidate(_this, event);
		    console.log("+onIceCandidate(null)");
		}
	    };
	    this.mPc.onaddstream = function (event) {
		console.log("+++onRemoteStreamAdd("+event+"\n");};
	    this.mPc.onremovestream = function (event) {
		console.log("+++onRemoteStreamRemoved("+event+"\n");};
	    this.mPc.onsignalingstatechange = function (event) {
		console.log("+++onSignalingChanged("+event+"\n");};
	    this.mPc.oniceconnectionstatechange = function (event) {
		console.log("+++onIceConnectionStateChanged("+event.type+"\n");};
	    this.onnegotiationneeded = function () {
		console.log("+++onnegotiationneeded()\n");};
	    this.mPc.ondatachannel = function(event) {
		console.log("--ondatachannel-\n");
		_this.mDataChannel = event.channel;
		_this.setChannelEvents();
	    };
	} catch (e) {
	    alert("can not create peer connection."+e+"");
	}
	return this;
    };
    
    this.createOffer = function () {
	console.log("+++createOffer()\n");
	this.mPc.createOffer(
	    function _onSetLocalAndMessage (sessionDescription) {
		console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
		_this.mPc.setLocalDescription(
		    sessionDescription, 
		    function() {console.log("+++onSetSessionDescriptionSuccess.");
				_this.mObserver.onSetSessionDescription(_this, _this.mPc.localDescription.type, _this.mPc.localDescription.sdp);
				_this.mSignalClient.sendOffer(_this.getTargetUUID(), _this.getMyUUID(), _this.mPc.localDescription.sdp);
			       },
		    function(error) {
			_this.mObserver.onNotifyError(_this, error);
		    }
		);
	    });
	return this;
    };

    this.createAnswer = function () {
	console.log("+++createAnsert()======\n");
	this.mPc.createAnswer(
	    function _onSetLocalAndMessage (sessionDescription) {
		console.log("+++setLocalAndSendMessage obj="+sessionDescription+"===============================\n");
		_this.mPc.setLocalDescription(
		    sessionDescription, 
		    function() {
			console.log("+++onSetSessionDescriptionSuccess.=========================");
			_this.mObserver.onSetSessionDescription(_this, _this.mPc.localDescription.type, _this.mPc.localDescription.sdp);
			_this.mSignalClient.sendAnswer(_this.getTargetUUID(), _this.getMyUUID(), _this.mPc.localDescription.sdp);
		    },
		    function(error) {
			_this.mObserver.onNotifyError(_this, error);
		    }
		);});
	return this;
    };
    
    this.addIceCandidate = function (candidate) {
	console.log("+++addIceCandidate()"+this.mPc+","+candidate+"\n");
	try {
	    var _c =new RTCIceCandidate(candidate);
	    this.mPc.addIceCandidate(_c);
	}catch(e) {
	    console.log("+++addIceCandidate() ERROR"+e.message);
	}
    }
    
    this.sendMessage = function (message) {
	//
	// #p2p message send
	//
	console.log("+++sendMessage() message="+message
		    +",from="+_this.mMyUUID
		    +",to="+_this.mTargetUUID
		    +"\n");

	this.mDataChannel.send(message);
    };
    
    this.setRemoteSDP = function(_type, _sdp) {
	console.log("+++setRemoteSDP()"+_type);
	var sd = new RTCSessionDescription();
	sd.type = _type;
	sd.sdp = _sdp;
	this.mPc.setRemoteDescription(sd);
	return this;
    };
    
    
    // createPeerConnection then call this method 
    this.setChannelEvents = function() {
	console.log("+++setChannelEvent()\n");
	this.mDataChannel.onmessage = function(event) {
	    //
	    // #p2p message receive
	    //
	    console.log("+++onReceiveMessage()"+event.data+"\n");
	    _this.mObserver.onReceiveMessage(_this, event.data);
	};
	this.mDataChannel.onopen = function(event) {
	    _this.mObserver.onOpen(_this, event);
	};
	this.mDataChannel.onerror = function(error) {
	    _this.mObserver.onNotifyError(_this, error);
	};
	this.mDataChannel.onclose = function(event) {
	    _this.mObserver.onClose(_this, event);
	};
    };
    
};

hetima.signal.Caller.iceCandidateType = function(candidateSDP) {
    if (candidateSDP.indexOf("typ relay ") >= 0) {
	return "TURN";
    }
    if (candidateSDP.indexOf("typ srflx ") >= 0) {
	return "STUN";
    }
    if (candidateSDP.indexOf("typ host ") >= 0) {
	return "HOST";
    }
    return "UNKNOWN";
};
