goog.provide('hetima.util.ArrayBuilderTest');
goog.require('hetima.util.ArrayBuilder');
goog.require('goog.testing.jsunit');

function testS() {
    var builder = new hetima.util.ArrayBuilder(1024);
    builder.appendText("helio");
    assertEquals(5, builder.getLength());
    assertEquals(104, builder.toUint8Array()[0]);
    assertEquals(101, builder.toUint8Array()[1]);
    assertEquals(108, builder.toUint8Array()[2]);
    assertEquals(105, builder.toUint8Array()[3]);
    assertEquals(111, builder.toUint8Array()[4]);
    assertEquals(5, builder.toByteBuffer().byteLength);
}

function testM(){
    var builder = new hetima.util.ArrayBuilder(3);
    builder.appendText("helio");
    assertEquals(5, builder.getLength());
    assertEquals(104, builder.toUint8Array()[0]);
    assertEquals(101, builder.toUint8Array()[1]);
    assertEquals(108, builder.toUint8Array()[2]);
    assertEquals(105, builder.toUint8Array()[3]);
    assertEquals(111, builder.toUint8Array()[4]);
    assertEquals(5, builder.toByteBuffer().byteLength);
}

function testN(){
    var builder = new hetima.util.ArrayBuilder(1024);
    builder.appendText("helio");
    assertEquals("li", builder.subString(2,2));
}

