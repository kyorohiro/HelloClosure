goog.require('goog.dom');
goog.require('goog.graphics');
goog.require('goog.events');
var graphics = null;
var stroke = null;
var fill = null;
var shape = null;

function hello() {
    console.log("init()");
    var _label = goog.dom.createDom("h1", {"style":"background-color:#EEE"},"hello");
    var _canvas = goog.dom.createDom("div", {"id":"canvas","style":"border: solid 1px black;"},"");
    goog.dom.appendChild(document.body, _label);
    goog.dom.appendChild(document.body, _canvas);

    graphics = goog.graphics.createGraphics(512, 512);
    stroke = new goog.graphics.Stroke(2, '#000000');
    fill = new goog.graphics.SolidFill('#ffff00');
    shape = graphics.drawCircle(0, 0, 10, stroke, fill);
    graphics.render(goog.dom.$('canvas'));
    goog.events.listen(goog.dom.$('canvas'), goog.events.EventType.MOUSEDOWN, onMouseDown);
}

function clientToCanvas(x, y) {
    var s = goog.dom.getDocumentScroll();
    var b = goog.dom.$('canvas').getBoundingClientRect();
    console.log(""+s.x+","+b.left+","+s.y+","+b.top);
    //    return {"x":x+s.x-b.left,"y":(y+s.y-b.top)};
    return {"x":x-b.left,"y":(y-b.top)};
}

function onMouseDown(e) {
    var pt = clientToCanvas(e.clientX, e.clientY);
    console.log("~"+pt.x+","+pt.y);
    shape.setTransformation(pt.x, pt.y,0,0,0);
}
