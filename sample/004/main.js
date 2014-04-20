goog.require('goog.dom');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

//goog.require('hetima.signal.SignalClient');
goog.require('hetima.signal.Caller');
goog.require('hetima.util.UUID');
//goog.require('hetima.util.Encoder');


var mConnectButton;
var mOfferButton;
var mAnswerButton;
var mLocalSDPField;
var mRemoteSDPField;

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
    mConnectButton    = goog.dom.createDom("input" ,{id:"connect" ,type:"button",value:"connect"});
    mOfferButton      = goog.dom.createDom("input" ,{id:"offer" ,type:"button",value:"offer"});
    mAnswerButton     = goog.dom.createDom("input",{id:"answer",type:"button",value:"answer"});
    mLocalSDPField    = goog.dom.createDom("textarea", {id:"localsdp" ,width:"500px",placeholder:"localsdp" },"");
    mRemoteSDPField   = goog.dom.createDom("textarea", {id:"remotesdp",width:"500px",placeholder:"remotesdp"},"");

    goog.dom.appendChild(document.body, mConnectButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mOfferButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mAnswerButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mLocalSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mRemoteSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    mConnectButton.onclick = onClickConnect;
    mOfferButton.onclick   = onClickOffer;
    mAnswerButton.onclick  = onClickAnswer;
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


