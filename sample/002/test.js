goog.require('goog.ui.HsvPalette');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');


var palette;
function _start() {
    console.log("start");

    var v = goog.dom.createDom('div',{id:"palette"},"test");
    goog.dom.appendChild(document.body, v);
    palette = new goog.ui.HsvPalette();
    palette.render(goog.dom.$('palette'));

    //
    // add button
    //
    var button = goog.dom.createDom('input',{type:"button",id:"btn",value:"test"},"");
    goog.dom.appendChild(document.body, button);
    button.onclick = onClickButton;//goog.bind(onClickButton);

}

function onClickButton(type) {
    console.log("-----"+palette.getColor());
}

