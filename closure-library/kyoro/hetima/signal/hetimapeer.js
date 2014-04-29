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
    };

    //
    // registed then, receive notification event from this class.
    //
    this.setEventListener = function(observer) {
	this.messenger.setEventListener(observer);
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

}
