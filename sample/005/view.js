goog.provide('AppView');
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


AppView = function() {
    var _this = this;
    // handshake ui
    this.mStartButton;
    this.mConnectButton;
    this.mUnconnectedAddressComboBox;
    
    // send/receive ui
    this.mSendMessageButton;
    this.mSendMessageField;
    this.mReceiveMessageField;
    this.mConnectedAddressComboBox;
    
    // model 
    this.mModel;
    
    
    this.initUI = function()
    {
	console.log("initUI()");
	_this.initHandshakeUI();
	_this.initSendReceiveUI();
    };

    this.setInitValue = function(model) {
	_this.mModel = model;
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
	    _this.mUnconnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem("broadcast"));
	    _this.mUnconnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	    _this.mUnconnectedAddressComboBox.render(_unconnectedAddressDom);
	}	
    };
    
    this.initSendReceiveUI = function() {
	
	_this.mSendMessageButton   = goog.dom.createDom("input"   , {id:"sendmessage"  ,type:"button",value:"send"});
	_this.mSendMessageField    = goog.dom.createDom("textarea", {id:"sendfield" ,width:"500px",placeholder:"send message" },"");
	_this.mReceiveMessageField = goog.dom.createDom("textarea", {id:"receivefield" ,width:"500px",placeholder:"received message" },"");
	var _connectedAddressDom  = goog.dom.createDom("span"  ,{id:"address"}, "");
	
	goog.dom.appendChild(document.body, goog.dom.createDom("div", {}, "[[send/receive]]"));
	goog.dom.appendChild(document.body, _connectedAddressDom);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mSendMessageButton);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mSendMessageField);
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	goog.dom.appendChild(document.body, _this.mReceiveMessageField);
	
	{
	    _this.mConnectedAddressComboBox = new goog.ui.ComboBox();
	    _this.mConnectedAddressComboBox.setUseDropdownArrow(true);
	    _this.mConnectedAddressComboBox.setDefaultText("broadcast");
	    _this.mConnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	    _this.mConnectedAddressComboBox.addItem(new goog.ui.ComboBoxItem("broadcast"));
	    _this.mConnectedAddressComboBox.addItem(new goog.ui.MenuSeparator());
	    _this.mConnectedAddressComboBox.render(_connectedAddressDom);
	}
	
	_this.mSendMessageButton.onclick = _this.onClickSendMessage;
    };
    
    this.putItem = function(itemName)
    {
	if(_this.mModel.mMyAddress == itemName) {
	    return;
	}
	for(var i=0;i<_this.mUnconnectedAddressComboBox.getItemCount();i++)
	{
	    var item = _this.mUnconnectedAddressComboBox.getItemAt(i);
	    if(itemName == item.getContent()) {
		return;
	    }
	}
	
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
    };
    
};
