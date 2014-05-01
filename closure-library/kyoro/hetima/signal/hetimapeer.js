goog.provide('hetima.signal.HetimaPeer');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

goog.require('hetima.signal.SignalClient');
goog.require('hetima.signal.Caller');
goog.require('hetima.signal.UserInfo');
goog.require('hetima.signal.Messenger');

goog.require('hetima.util.UUID');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Encoder');

// 
// organize p2p network
//
hetima.signal.HetimaPeer = function() 
{
    var _this = this;
    this.messenger = new hetima.signal.Messenger();

    //
    // initialize
    // 
    this.init = function()
    {
	console.log("init()");
	this.messenger.init();
	this.addEventListener(this);
    };

    //
    //
    //
    this.getMyAddress = function()
    {
	return this.messenger.mMyAddress;
    };

    //
    //
    //
    this.getCallerList = function()
    {
	return this.messenger.getCallerList();
    }

    //
    // registed then, receive notification event from this class.
    //
    this.addEventListener = function(observer) {
	this.messenger.addEventListener(observer);
    };

    //
    // start find device
    //
    this.start = function()
    {
	this.messenger.start();
    };

    //
    // connect device
    //
    this.connect = function(to)
    {
	this.messenger.connect(to);
    };

    //
    // send message
    //
    this.sendMessage = function(to, message, messagetype) 
    {
	this.messenger.sendMessage(to, message, messagetype);
    };

    //
    // get peer list
    // request to information near target uuid device.
    //
    this.findnode = function(to, target)
    {
	if(target == undefined) {
	    to = target;
	}

	var pack = {};
	pack["messagetype"] = "direct";
	pack["action"]      = "findnode";
	pack["from"]        = mMyAddress;
	pack["to"]          = to;
	pack["target"]      = target;
	_this.messenger.sendPack(to, pack);
    };


    this.onCallerReceiveMessage = function(model, caller, message) {
	console.log("++[hetpeer]+onReceiveMessage:"+message);
	if(message.action == undefined) {return;}
	var action = hetima.util.Encoder.toText(message.action);
	var target = hetima.util.Encoder.toText(message.target);
	console.log("+++action="+action+",target="+target);
	var pack = {};
//	_this.messenger.sendPack(caller.getTargetUUID(), pack);
    }
    
};
