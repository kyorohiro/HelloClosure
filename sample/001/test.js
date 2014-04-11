goog.require('goog.dom');
goog.require('goog.graphics');
var graphics = null;
var stroke = null;
var fill = null;

function hello() {
    console.log("init()");
    var _label = goog.dom.createDom("h1", {"style":"background-color:#EEE"},"hello");
    var _canvas = goog.dom.createDom("div", {"id":"canvas","style":"border: solid 1px black;"},"");
    goog.dom.appendChild(document.body, _label);
    goog.dom.appendChild(document.body, _canvas);

    graphics = goog.graphics.createGraphics(512, 512);
    stroke = new goog.graphics.Stroke(2, '#000000');
    fill = new goog.graphics.SolidFill('#ffff00');
    graphics.drawCircle(256, 256, 100, stroke, fill);
    graphics.render(goog.dom.$('canvas'));
}