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
goog.require('hetima.signal.UserInfo');

//goog.require('hetima.util.Encoder');



// handshake ui
var mStartButton;
var mConnectButton;
var mUnconnectedAddressComboBox;

// send/receive ui
var mSendMessageButton;
var mSendMessageField;
var mReceiveMessageField;
var mConnectedAddressComboBox;


// model 
var mMyAddress;
var mSignalClient;
var mCallerList;


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
    mStartButton                 = goog.dom.createDom("input" ,{id:"start",   type:"button", value:"start"});
    var _unconnectedAddressDom   = goog.dom.createDom("span"  ,{id:"address"}, "");
    mConnectButton               = goog.dom.createDom("input" ,{id:"connect", type:"button", value:"connect"});

    goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[handshake]]"));
    goog.dom.appendChild(document.body, mStartButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, _unconnectedAddressDom);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mConnectButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));


    mStartButton.onclick = onClickStart;
    mConnectButton.onclick = onClickConnect;

    //
    {
	mUnconnectedAddressComboBox = new goog.ui.ComboBox();
	mUnconnectedAddressComboBox.setUseDropdownArrow(true);
	mUnconnectedAddressComboBox.setDefaultText("broadcast");
	mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	mUnconnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem("broadcast"));
	mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	mUnconnectedAddressComboBox.render(_unconnectedAddressDom);
    }

}

function initSendReceiveUI() {

    mSendMessageButton   = goog.dom.createDom("input"   , {id:"sendmessage"  ,type:"button",value:"send"});
    mSendMessageField    = goog.dom.createDom("textarea", {id:"sendfield" ,width:"500px",placeholder:"send message" },"");
    mReceiveMessageField = goog.dom.createDom("textarea", {id:"receivefield" ,width:"500px",placeholder:"received message" },"");
    var _connectedAddressDom     = goog.dom.createDom("span"  ,{id:"address"}, "");


    goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[send/receive]]"));
    goog.dom.appendChild(document.body, _connectedAddressDom);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mSendMessageButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mSendMessageField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mReceiveMessageField);

    {
	mConnectedAddressComboBox = new goog.ui.ComboBox();
	mConnectedAddressComboBox.setUseDropdownArrow(true);
	mConnectedAddressComboBox.setDefaultText("broadcast");
	mConnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	mConnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem("broadcast"));
	mConnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	mConnectedAddressComboBox.render(_connectedAddressDom);
    }

    mSendMessageButton.onclick = onClickSendMessage;
}

function init()
{
    console.log("init()");
    mMyAddress = hetima.util.UUID.getID();
    console.log("::uuid="+mMyAddress);
    mCallerList = new hetima.signal.UserInfo();
    //mCaller = new hetima.signal.Caller();
    //mCaller.setEventListener(mSignalObserver);
    mSignalClient = new hetima.signal.SignalClient("ws://localhost:8080");
    mSignalClient.setPeer(mCallerObserver);
}

var mSignalObserver = new (function() {
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
});

var mCallerObserver = new(function() 
{
    this.onReceiveAnswer = function(v) {
	console.log("+++onReceiveAnswer()\n");
    };
    this.addIceCandidate = function(v) {
	console.log("+++addIceCandidate()\n");
    };
    this.startAnswerTransaction = function(v) {
	console.log("+++startAnswerTransaction()\n");
    };
    this.onJoinNetwork = function(v) {
	console.log("+++onJoinNetwork(si)\n");
	console.log("---" + v.content);
	putItem(v["from"]);
    };
    this.onReceiveMessage = function(v) {
	console.log("+++onReceivceMessage("+v+")\n");
	putItem(v["from"]);
	goog.dom.$('receive').value += hetima.util.Encoder.toText(v.content) + "\n";
    };
});

function putItem(itemName)
{
    if(mMyAddress == itemName) {
	return;
    }
    for(var i=0;i<mUnconnectedAddressComboBox.getItemCount();i++)
    {
	var item = mUnconnectedAddressComboBox.getItemAt(i);
	if(itemName == item.getContent()) {
	    return;
	}
    }

    mUnconnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem(itemName));
    mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
}

function onClickStart()
{
    console.log("click start");
    mSignalClient.join(mMyAddress);
//    mCaller.createPeerConnection();
}

function onClickConnect()
{
    console.log("click connect");
    var addr = mUnconnectedAddressComboBox.getValue();
    if(addr == undefined || addr == null || addr == "broadcast") {
	return;
    }
    var caller = new hetima.util.Caller(mMyAddress).setTargetUUID(addr);
    mCallerList.add(uuid, caller);
    caller.createPeerConnection();
    caller.createOffer();
}

function onClickSendMessage()
{
    console.log("click send message");
//    mCaller.sendMessage("message:"+mSendMessageField.value+";");
}

