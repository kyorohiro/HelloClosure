goog.require('goog.dom');
goog.require('hetima.signal.SignalClient');
goog.require('hetima.util.UUID');
goog.require('hetima.util.Encoder');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');


var mClient;//
var myAddress;//
var mToAddress;//

var clientObserver = new(function() 
{
    this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");};
    this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");};
    this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");};
    this.onJoinNetwork = function(v) {
	console.log("+++onJoinNetwork(si)\n");
	console.log("---" + v.content);
	putItem(v["from"]);
	console.log("======="+mToAddress.getValue());
    };
    this.onReceiveMessage = function(v) {
	console.log("+++onReceivceMessage("+v+")\n");
	putItem(v["from"]);
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
    myAddress = hetima.util.UUID.getID();
    mClient = new hetima.signal.SignalClient("ws://localhost:8080");
    mClient.setPeer(clientObserver);
}

function initialUI() 
{
    var btnJoin = goog.dom.createDom("input", {id:"button",type:"button",value:"join"},"");
    btnJoin.onclick = onPushJoinButton;
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
	mToAddress = cb;
	goog.dom.appendChild(document.body, goog.dom.createDom("br"));
	//
    }

    var fieldSend = goog.dom.createDom("textarea", {id:"send",width:"500px"},"");
    goog.dom.appendChild(document.body, fieldSend);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    var btnSend = goog.dom.createDom("input", {id:"button",type:"button",value:"send"},"");
    goog.dom.appendChild(document.body, btnSend);
    btnSend.onclick = onPushSendButton;
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, goog.dom.createDom("hr"));

    var fieldReceive = goog.dom.createDom("textarea", {id:"receive",width:"500px"},"");
    goog.dom.appendChild(document.body, fieldReceive);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
}


function putItem(itemName)
{
    if(myAddress == itemName) {
	return;
    }
    for(var i=0;i<mToAddress.getItemCount();i++)
    {
	var item = mToAddress.getItemAt(i);
	if(itemName == item.getContent()) {
	    return;
	}
    }
    mToAddress.addItem(new goog.ui.ComboBoxItem(itemName));
    mToAddress.addItem(new goog.ui.MenuSeparator());
}

function onPushJoinButton()
{
    console.log("on click a" + myAddress);
    mClient.join(myAddress);
}

function onPushSendButton()
{
    console.log("on click b" + myAddress);
    var message = goog.dom.$("send").value;
    var address = mToAddress.getValue();
    if(address == undefined || address == "" || address == "broadcast") {
	mClient.broadcastMessage(myAddress, message);
    } else {
	mClient.unicastMessage(address, myAddress, message);
    }
}

