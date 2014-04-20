goog.provide('hetima.signal.Caller');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.Encoder');


hetima.signal.Caller = function Caller(id) {
    var _this = this;
    this.pc = null;
    this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    this.pcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}]};//, {'RtpDataChannels': true }] };
    this.mMyUUID = id;
    this.mTargetUUID = "";
    this.mDataChannel = null;
    
    this.mObserver = new (function() {
	this.onReceiveMessage = function(caller, message) {;}
	this.onIceCandidate = function(caller,event){;}
	this.onSetSessionDescription = function(caller,event){;}
    });
    
    this.mSignalClient = new (function() {
	this.sendAnswer = function(to,from,sdp) {
	    console.log("+++sendAnswer()\n");}
	this.sendOffer = function(to,from,sdp) {
	    console.log("+++sendOffer()\n");}
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
	    return _this.pc.localDescription;
	} catch(e) {
	    return null;
	}
    };
    
    this.createPeerConnection = function() {
	console.log("+++createPeerConnection()\n");
	try {
	    this.pc = new webkitRTCPeerConnection(this.pcConfig, this.pcConstraints);
	    this.mDataChannel = this.pc.createDataChannel("channel",{});
	    
	    this.setChannelEvents();
	    this.pc.onicecandidate = function (event) {//RTCIceCandidateEvent
		if(event.candidate) {
		    console.log("+onIceCandidate("+event+","+event.candidate+"):"
				+hetima.signal.Caller.iceCandidateType(_this.pc.localDescription.sdp));
		    _this.mObserver.onIceCandidate(_this, event);
		} else {
		    console.log("+onIceCandidate(null)");
		}
	    };
	    this.pc.onaddstream = function (event) {
		console.log("+++onRemoteStreamAdd("+event+"\n");};
	    this.pc.onremovestream = function (event) {
		console.log("+++onRemoteStreamRemoved("+event+"\n");};
	    this.pc.onsignalingstatechange = function (event) {
		console.log("+++onSignalingChanged("+event+"\n");};
	    this.pc.oniceconnectionstatechange = function (event) {
		console.log("+++onIceConnectionStateChanged("+event.type+"\n");};
	    this.onnegotiationneeded = function () {
		console.log("+++onnegotiationneeded()\n");};
	    this.pc.ondatachannel = function(event) {
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
	this.pc.createOffer(
	    function _onSetLocalAndMessage (sessionDescription) {
		console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
		_this.pc.setLocalDescription(
		    sessionDescription, 
		    function() {console.log("+++onSetSessionDescriptionSuccess.");
				_this.mObserver.onSetSessionDescription(_this, _this.pc.localDescription.type, _this.pc.localDescription.sdp);
				_this.mSignalClient.sendOffer(_this.getTargetUUID(), _this.getMyUUID(), _this.pc.localDescription.sdp);
			       },
		    function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());}
		);
	    });
	return this;
    };

    this.createAnswer = function () {
	console.log("+++createAnsert()======\n");
	this.pc.createAnswer(
	    function _onSetLocalAndMessage (sessionDescription) {
		console.log("+++setLocalAndSendMessage obj="+sessionDescription+"===============================\n");
		_this.pc.setLocalDescription(
		    sessionDescription, 
		    function() {
			console.log("+++onSetSessionDescriptionSuccess.=========================");
			_this.mObserver.onSetSessionDescription(_this, _this.pc.localDescription.type, _this.pc.localDescription.sdp);
			_this.mSignalClient.sendAnswer(_this.getTargetUUID(), _this.getMyUUID(), _this.pc.localDescription.sdp);
		    },
		    function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());}
		);});
	return this;
    };
    
    this.addIceCandidate = function (candidate) {
	console.log("+++addIceCandidate()"+this.pc+","+candidate+"\n");
	try {
	    var _c =new RTCIceCandidate(candidate);
	    this.pc.addIceCandidate(_c);
	}catch(e) {
	    console.log("+++addIceCandidate() ERROR"+e.message);
	}
    }
    
    this.sendMessage = function (message) {
	//
	// #p2p message send
	//
	console.log("+++sendMessage()"+message+"\n");
	this.mDataChannel.send(message);
    };
    
    this.setRemoteSDP = function(_type, _sdp) {
	console.log("+++setRemoteSDP()"+_type);
	var sd = new RTCSessionDescription();
	sd.type = _type;
	sd.sdp = _sdp;
	this.pc.setRemoteDescription(sd);
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
	    console.log("############## onopen:"+event);
	    _this.mObserver.onOpen(_this, event.data);
	};
	this.mDataChannel.onerror = function(error) {console.log("onerror:"+JSON.parse(error));};
	this.mDataChannel.onclose = function(error) {console.log("onclose:"+JSON.parse(error));};
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
