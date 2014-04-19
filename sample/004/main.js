goog.require('goog.dom');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.MenuSeparator');

//goog.require('hetima.signal.SignalClient');
//goog.require('hetima.util.UUID');
//goog.require('hetima.util.Encoder');


var mOfferButton;
var mAnswerButton;
var mLocalSDPField;
var mRemoteSDPField;

function appmain() 
{
    console.log("start app");
    initUI();
}


function initUI()
{
    mOfferButton      = goog.dom.createDom("input" ,{id:"offer" ,type:"button",value:"offer"});
    mAnswerButton     = goog.dom.createDom("input",{id:"answer",type:"button",value:"answer"});
    mLocalSDPField    = goog.dom.createDom("textarea", {id:"localsdp" ,width:"500px",placeholder:"localsdp" },"");
    mRemoteSDPField   = goog.dom.createDom("textarea", {id:"remotesdp",width:"500px",placeholder:"remotesdp"},"");

    goog.dom.appendChild(document.body, mOfferButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mAnswerButton);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mLocalSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));
    goog.dom.appendChild(document.body, mRemoteSDPField);
    goog.dom.appendChild(document.body, goog.dom.createDom("br"));

    mOfferButton.onclick = onClickOffer;
    mAnswerButton.onclick = onClickAnswer;
}

function onClickOffer() 
{
    console.log("click offer");
}

function onClickAnswer() 
{
    console.log("click answer");
}


