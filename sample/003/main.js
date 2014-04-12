goog.require('goog.dom');
goog.require('hetima.signal.SignalClient');
goog.require('hetima.util.UUID');


var _client;// = hetima.signal.SignalClient("ws://localhost:8080");
var _myAddress;// = hetima.util.UUID.getID();


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
}
function initialUI() 
{
    var btn = goog.dom.createDom("input", {id:"button",type:"button",value:"test"},"");
    goog.dom.appendChild(document.body, btn);
    btn.onclick = onClickA;
}

function onClickA()
{
    console.log("on click a" + _myAddress);
    _client.join(_myAddress);
}

