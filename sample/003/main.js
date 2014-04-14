goog.require('goog.dom');
goog.require('hetima.signal.SignalClient');
goog.require('hetima.util.UUID');
goog.require('hetima.util.Encoder');

var _client;// = hetima.signal.SignalClient("ws://localhost:8080");
var _myAddress;// = hetima.util.UUID.getID();


var _interSignalCL = new(function() 
{
    this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");};
    this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");};
    this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");};
    this.onJoinNetwork = function(v) {
	console.log("+++onJoinNetwork(si)\n");
	console.log("---" + v.content);
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
    _client.broadcastMessage(_myAddress, message);
}



