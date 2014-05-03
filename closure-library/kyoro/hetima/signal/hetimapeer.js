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
	pack["mode"]        = "request";
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
	var mode = hetima.util.Encoder.toText(message.mode);
	console.log("+++action="+action+",target="+target+",mode="+mode);
	if(mode == "response") {
	    if(action == "findnode") {
		var callerlist = _this.messenger.getCallerList();
		var list = message.content;
		if(list != undefined) {
		    for(var i=0;i<list.length;i++)
		    {
			var content = {};
			var uuid = hetima.util.Encoder.toText(list[i]);
			content.relay = ""+caller.getTargetUUID();
			if(callerlist.contain(uuid) == false) { 
			    callerlist.add(uuid, content);
			}
		    }
		}
	    }
	    return;
	}
	else if(mode == "request") {
	    if(action == "findnode") {
		_this.responseFindnode(caller.getTargetUUID());
	    }
	    return;
	}

    }

    this.responseFindnode = function(to)
    {
	var pack = {};
	pack["messagetype"] = "direct";
	pack["action"]      = "findnode";
	pack["mode"]        = "response";
	pack["content"]     = [];
	var list = _this.getCallerList();
	for(var i=0;i<list.length();i++)
	{
	    pack["content"].push(list.get(i).uuid);
	}
	_this.messenger.sendPack(to, pack);
    };
    
};
