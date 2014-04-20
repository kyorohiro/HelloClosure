goog.require('goog.dom');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

//goog.require('hetima.signal.SignalClient');
goog.require('hetima.signal.Caller');
goog.require('hetima.util.UUID');
//goog.require('hetima.util.Encoder');



// handshake ui
var mConnectButton;
var mOfferButton;
var mAnswerButton;
var mSetRemoteSdpAsCallerButton;
var mSetRemoteSdpAsCalleeButton;
var mLocalSDPField;
var mRemoteSDPField;

// send/receive ui
var mSendMessageButton;
var mSendMessageField;
var mReceiveMessageField;

var mCaller;
var mMyAddress;

function appmain() 
{
    console.log("start app");
    initUI();
    init();
}


function initUI()
{
    console.log("initUI()");
    initHandshakeUI();
    initSendReceiveUI();
}

function initHandshakeUI() {
    mConnectButton       = goog.dom.createDom("input" ,{id:"connect" ,type:"button",value:"connect"});
    mOfferButton         = goog.dom.createDom("input" ,{id:"offer" ,type:"button",value:"offer"});
    mAnswerButton        = goog.dom.createDom("input",{id:"answer",type:"button",value:"answer"});
    mSetRemoteSdpAsCallerButton  = goog.dom.createDom("input",{id:"setremotesdpascaller",type:"button",value:"setRemoteSdp as caller"});
    mSetRemoteSdpAsCalleeButton  = goog.dom.createDom("input",{id:"setremotesdpascallee",type:"button",value:"setRemoteSdp as callee"});
    mLocalSDPField       = goog.dom.createDom("textarea", {id:"localsdp" ,width:"500px",placeholder:"localsdp" },"");
    mRemoteSDPField      = goog.dom.createDom("textarea", {id:"remotesdp",width:"500px",placeholder:"remotesdp"},"");

    goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[handshake]]"));
    goog.dom.appendChild(document.body, mConnectButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mOfferButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mAnswerButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mLocalSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    goog.dom.appendChild(document.body, mSetRemoteSdpAsCallerButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mSetRemoteSdpAsCalleeButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mRemoteSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    mConnectButton.onclick = onClickConnect;
    mOfferButton.onclick   = onClickOffer;
    mAnswerButton.onclick  = onClickAnswer;
    mSetRemoteSdpAsCallerButton.onclick  = onClickSetRemoteSdpAsCaller;
    mSetRemoteSdpAsCalleeButton.onclick  = onClickSetRemoteSdpAsCallee;
}

function initSendReceiveUI() {

    mSendMessageButton   = goog.dom.createDom("input"   , {id:"sendmessage"  ,type:"button",value:"send"});
    mSendMessageField    = goog.dom.createDom("textarea", {id:"sendfield" ,width:"500px",placeholder:"send message" },"");
    mReceiveMessageField = goog.dom.createDom("textarea", {id:"receivefield" ,width:"500px",placeholder:"received message" },"");

    goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[send/receive]]"));
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mSendMessageButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mSendMessageField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mReceiveMessageField);

    mSendMessageButton.onclick = onClickSendMessage;
}

function init()
{
    console.log("init()");
    mMyAddress = hetima.util.UUID.getID();
    console.log("::uuid="+mMyAddress);
    mCaller = new hetima.signal.Caller();
    mCaller.setEventListener(
	new (function() {
		this.onReceiveMessage = function(caller, message) {
		    console.log("::onReceiveMessage");
		    mReceiveMessageField.value = message;
		};
		this.onIceCandidate = function(caller,event){
		    console.log("::onIceCandidate");
		    if(!event.candidate) {
			mLocalSDPField.value = caller.getRawPeerConnection().localDescription.sdp;
		    }
		};
		this.onSetSessionDescription = function(caller,event){
		    console.log("::onSetSessionDescription");
		};
	})
    );
}

function onClickConnect()
{
    console.log("click connection");
    mCaller.createPeerConnection();
}

function onClickOffer() 
{
    console.log("click offer");
    mCaller.createOffer();
}

function onClickAnswer() 
{
    console.log("click answer");
    mCaller.createAnswer();
}


function onClickSetRemoteSdpAsCaller()
{
    console.log("click setremotesdp");
    mCaller.setRemoteSDP("answer", mRemoteSDPField.value);
}

function onClickSetRemoteSdpAsCallee()
{
    console.log("click setremotesdp");
    mCaller.setRemoteSDP("offer", mRemoteSDPField.value);
}

function onClickSendMessage()
{
    console.log("click send message");
    mCaller.sendMessage("message:"+mSendMessageField.value+";");
}

