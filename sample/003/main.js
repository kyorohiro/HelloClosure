goog.require('goog.dom');
goog.require('hetima.signal.SignalClient');
goog.require('hetima.util.UUID');


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
    goog.dom.appendChild(document.body, btnJoin);
    btnJoin.onclick = onClickA;

    var btnSend = goog.dom.createDom("input", {id:"button",type:"button",value:"send"},"");
    goog.dom.appendChild(document.body, btnSend);
    btnSend.onclick = onClickB;
}

function onClickA()
{
    console.log("on click a" + _myAddress);
    _client.join(_myAddress);
}

function onClickB()
{
    console.log("on click b" + _myAddress);
    _client.broadcastMessage("hello world!!");
}



