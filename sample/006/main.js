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
goog.require('hetima.signal.HetimaPeer');

goog.require('AppView06');


// handshake ui
var mView;


// model 
var mMyAddress;
var mSignalClient;
var mCallerList;


function appmain() 
{
    console.log("start app");
    mView = new AppView06();
    mView.initUI();
    mModel = new hetima.signal.HetimaPeer();
    mModel.init();
    mView.setInitValue(mModel);
}





