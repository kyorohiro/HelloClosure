goog.provide('hetima.util.ArrayBuilderTest');
goog.require('hetima.util.ArrayBuilder');
goog.require('goog.testing.jsunit');

function testS() {
    var builder = new hetima.util.ArrayBuilder(1024);
    builder.appendText("helio");
    assertEquals(5, builder.getLength());
    assertEquals(104, builder.toByteBuffer()[0]);
    assertEquals(101, builder.toByteBuffer()[1]);
    assertEquals(108, builder.toByteBuffer()[2]);
    assertEquals(105, builder.toByteBuffer()[3]);
    assertEquals(111, builder.toByteBuffer()[4]);
    assertEquals(5, builder.toByteBuffer().byteLength);
}

function testM(){
    var builder = new hetima.util.ArrayBuilder(3);
    builder.appendText("helio");
    assertEquals(5, builder.getLength());
    assertEquals(104, builder.toByteBuffer()[0]);
    assertEquals(101, builder.toByteBuffer()[1]);
    assertEquals(108, builder.toByteBuffer()[2]);
    assertEquals(105, builder.toByteBuffer()[3]);
    assertEquals(111, builder.toByteBuffer()[4]);
    assertEquals(5, builder.toByteBuffer().byteLength);
}

function testN(){
    var builder = new hetima.util.ArrayBuilder(1024);
    builder.appendText("helio");
    assertEquals("li", builder.subString(2,2));
}

