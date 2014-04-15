goog.require('goog.dom');
goog.require('hetima.signal.SignalClient');
goog.require('hetima.util.UUID');
goog.require('hetima.util.Encoder');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

var _client;// = hetima.signal.SignalClient("ws://localhost:8080");
var _myAddress;// = hetima.util.UUID.getID();
var _toAddress;//

var _interSignalCL = new(function() 
{
    this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");};
    this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");};
    this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");};
    this.onJoinNetwork = function(v) {
	console.log("+++onJoinNetwork(si)\n");
	console.log("---" + v.content);
	_toAddress.addItem(new goog.ui.ComboBoxItem(v["from"]));
	_toAddress.addItem(new goog.ui.MenuSeparator());
	console.log("======="+_toAddress.getValue());
    };
    this.onReceiveMessage = function(v) {
	console.log("+++onReceivceMessage("+v+")\n");
	goog.dom.$('receive').value += hetima.util.Encoder.toText(v.content) + "\n";
    };
});

function appmain() 
{
    console.log("start app");
    initial();
    initialUI();
}


function initial()
{
    _myAddress = hetima.util.UUID.getID();
    _client = new hetima.signal.SignalClient("ws://localhost:8080");
    _client.setPeer(_interSignalCL);
}

function initialUI() 
{
    var btnJoin = goog.dom.createDom("input", {id:"button",type:"button",value:"join"},"");
    btnJoin.onclick = onClickA;
    goog.dom.appendChild(document.body, btnJoin);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, goog.dom.createDom("hr"));
{
    var boxAddress = goog.dom.createDom("span", {id:"address"}, "");
    goog.dom.appendChild(document.body, boxAddress);
    var cb = new goog.ui.ComboBox();
    cb.setUseDropdownArrow(true);
    cb.setDefaultText("broadcast");
    cb.addItem(new goog.ui.MenuSeparator());
    cb.addItem(new goog.ui.ComboBoxItem("broadcast"));
    cb.addItem(new goog.ui.MenuSeparator());
    cb.render(boxAddress);
    _toAddress = cb;
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    //
}

    var fieldSend = goog.dom.createDom("textarea", {id:"send",width:"500px"},"");
    goog.dom.appendChild(document.body, fieldSend);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    var btnSend = goog.dom.createDom("input", {id:"button",type:"button",value:"send"},"");
    goog.dom.appendChild(document.body, btnSend);
    btnSend.onclick = onClickB;
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, goog.dom.createDom("hr"));

    var fieldReceive = goog.dom.createDom("textarea", {id:"receive",width:"500px"},"");
    goog.dom.appendChild(document.body, fieldReceive);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
}


function onClickA()
{
    console.log("on click a" + _myAddress);
    _client.join(_myAddress);
}

function onClickB()
{
    console.log("on click b" + _myAddress);
    var message = goog.dom.$("send").value;
    var address = _toAddress.getValue();
    if(address == undefined || address == "" || address == "broadcast") {
	_client.broadcastMessage(_myAddress, message);
    } else {
	_client.unicastMessage(address, _myAddress, message);
    }
}



