goog.provide('AppView06');
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
goog.require('hetima.util.Encoder');


AppView06 = function() {
    var _this = this;
    // handshake ui
    this.mStartButton;
    this.mConnectButton;
    this.mUnconnectedAddressComboBox;
    
    // send/receive ui
    this.mSendMessageButton;
    this.mSendMessageField;
    this.mReceiveMessageField;

    // test ui
    this.mCallerListButton;
    
    // model 
    this.mModel;
    
    
    this.initUI = function()
    {
	console.log("initUI()");
	_this.initHandshakeUI();
	_this.initSendReceiveUI();
	_this.initTestUI();
    };

    this.setInitValue = function(model) {
	_this.mModel = model;
	_this.mModel.addEventListener(_this.mListener);
    };

    this.initHandshakeUI = function() {
	_this.mStartButton                 = goog.dom.createDom("input" ,{id:"start",   type:"button", value:"start"});
	var _unconnectedAddressDom        = goog.dom.createDom("span"  ,{id:"address"}, "");
	_this.mConnectButton               = goog.dom.createDom("input" ,{id:"connect", type:"button", value:"connect"});
	
	goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[handshake]]"));
	goog.dom.appendChild(document.body, _this.mStartButton);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _unconnectedAddressDom);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mConnectButton);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	
	
	_this.mStartButton.onclick = _this.onClickStart;
	_this.mConnectButton.onclick = _this.onClickConnect;
	
	//
	{
	    _this.mUnconnectedAddressComboBox = new goog.ui.ComboBox();
	    _this.mUnconnectedAddressComboBox.setUseDropdownArrow(true);
	    _this.mUnconnectedAddressComboBox.setDefaultText("broadcast");
	    _this.mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
//	    _this.mUnconnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem("broadcast"));
//	    _this.mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	    _this.mUnconnectedAddressComboBox.render(_unconnectedAddressDom);
	}	
    };
    
    this.initSendReceiveUI = function() {
	
	_this.mSendMessageButton   = goog.dom.createDom("input"   , {id:"sendmessage"  ,type:"button",value:"send"});
	_this.mSendMessageField    = goog.dom.createDom("textarea", {id:"sendfield" ,width:"500px",placeholder:"send message" },"");
	_this.mReceiveMessageField = goog.dom.createDom("textarea", {id:"receivefield" ,width:"500px",placeholder:"received message" },"");
	var _connectedAddressDom  = goog.dom.createDom("span"  ,{id:"address"}, "");
	
	goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[send/receive]]"));
//	goog.dom.appendChild(document.body, _connectedAddressDom);
//	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mSendMessageField);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mSendMessageButton);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mReceiveMessageField);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));

	_this.mSendMessageButton.onclick = _this.onClickSendMessage;
    };

    //kiyo
    this.initTestUI = function() {
	goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[test]]"));
	_this.mCallerListButton = goog.dom.createDom("input"   , {id:"callerlisttest"  ,type:"button",value:"callerlist"});
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mCallerListButton);
	_this.mCallerListButton.onclick = _this.onClickCallerList;
    };
    
    this.putItem = function(itemName)
    {
	if(_this.mModel.getMyAddress() == itemName) {
	    return;
	}
	for(var i=0;i<_this.mUnconnectedAddressComboBox.getItemCount();i++)
	{
	    var item = _this.mUnconnectedAddressComboBox.getItemAt(i);
	    var a = item.mSign;//getContent();
	    if(a == itemName) {
		console.log("+SSSSSSSSSSSSSSSS+")
		return;
	    }
	}
	console.log("+ZZZZZZZZZZZZZZZ+")
	var item = new goog.ui.ComboBoxItem(itemName);
	item.mSign = itemName;
	_this.mUnconnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem(itemName));
	_this.mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
    };
    
    this.onClickStart = function()
    {
	console.log("click start");
	_this.mModel.start();
    };
    
    this.onClickConnect = function()
    {
	console.log("click connect");
	var addr = _this.mUnconnectedAddressComboBox.getValue();
	if(addr == undefined || addr == null || addr == "broadcast") {
	    return;
	}
	_this.mModel.connect(addr);
    };
    
    this.onClickSendMessage = function()
    {
	console.log("click send message");
	var addr = _this.mUnconnectedAddressComboBox.getValue();
	if(addr == undefined || addr == null || addr == "broadcast") {
	    return;
	}
	var message = _this.mSendMessageField.value;
	console.log("click send message addr="+addr+",message="+message);
	_this.mModel.sendMessage(addr, message);
    };

    this.onClickCallerList = function() 
    {
	console.log("click callerlist---");
	var list = _this.mModel.getCallerList();
	for(var i=0;i<list.length();i++)
	{
	    console.log("--"+ list.get(i).uuid);
	}
	console.log("----- callerlist-----");
    };

    this.mListener = new (function(){
	this.onError = function(model, event) {
	    console.log("++[m]+onError:"+event);
	};
	this.onClose = function(model, event) {
	    console.log("++[m]+onError:"+event);
	};
	this.onFind = function(model, uuid) {
	    console.log("++[m]+onConnect:"+uuid);
	    if( uuid != undefined ) {
		_this.putItem(uuid);
	    }
	};
	this.onCallerOpen = function(model, caller, event) {
	    console.log("++[m]+onConnect:"+event);
	    _this.putItem(caller.getTargetUUID());
	};

	this.onCallerReceiveMessage = function(model, caller, message) {
	    console.log("++[m]+onReceiveMessage:"+message);
	    _this.mReceiveMessageField.value = ""+hetima.util.Encoder.toText(message["content"]);
	    _this.putItem(caller.getTargetUUID());
	};
	this.onCallerClose = function(model, caller, event) {
	    console.log("++[m]+onClose:"+event);
	};
	this.onCallerError = function(model, caller, error) {
	    console.log("++[m]+onError:"+error);
	};
    });

    
};

