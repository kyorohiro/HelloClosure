goog.provide('hetima.util.BencodeTest');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.ArrayBuilder');
goog.require('goog.testing.jsunit');

function testS() {
    var bencode = new hetima.util.Bencode();
    var _obj = {};
    _obj.test=10;
    _obj.test2=100;
    _obj.test3="abc";
    var arraybuilder = bencode.encodeObject(_obj);
    assertEquals("d4:testi10e5:test2i100e5:test33:abce", arraybuilder.toText());

    { //diction
	var decode = new hetima.util.Bdecode("text");
	var ret = decode.decodeArrayBuffer(arraybuilder.getUint8Array(), 0, arraybuilder.getLength());
	assertEquals(10, ret.test);
	assertEquals(100, ret.test2);
	assertEquals("abc", ret.test3);
    }
}

function testArray() {
    var bencode = new hetima.util.Bencode();
    var _obj = {};
    var builder = new hetima.util.ArrayBuilder();
    builder.appendText("abc");
    _obj.test3= builder.toUint8Array();
    var arraybuilder = bencode.encodeObject(_obj);
    assertEquals("d5:test33:abce", arraybuilder.toText());
}

function testS2() {
    var bencode = new hetima.util.Bencode();
    var _obj = {};
    _obj.test=10;
    _obj.test2=100;
    _obj.test3="abc";
    _obj.test4=[0,"efg"];
    var arraybuilder = bencode.encodeObject(_obj);
    assertEquals("d4:testi10e5:test2i100e5:test33:abc5:test4li0e3:efgee", arraybuilder.toText());

    var bdecode = new hetima.util.Bdecode("text");
    var ret = bdecode.decodeArrayBuffer(arraybuilder.getUint8Array(), 0, arraybuilder.getLength());
    assertEquals(10, ret.test);
    assertEquals(100, ret.test2);
    assertEquals("abc", ret.test3);
    
}

function testDecodeList() {
    var arraybuilder = new hetima.util.ArrayBuilder("text");
    arraybuilder.appendText("li0e3:efge", arraybuilder.toText());
    var bdecode = new hetima.util.Bdecode("text");
    var ret = bdecode.decodeArrayBuffer(arraybuilder.getUint8Array(), 0, arraybuilder.getLength());
    assertEquals(0, ret[0]);
    assertEquals("efg", ret[1]);
}

function testDecodeNumber() {
    { //number
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("i3e");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());	
	assertEquals(3,ret);
    }
    { //number
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("i30e");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());	
	assertEquals(30,ret);
    }
}


function testDecodeText() {
    { //text
	var decode = new hetima.util.Bdecode("text");
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("1:a");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());	
	assertEquals("a",ret);
    }
    { //text
	var decode = new hetima.util.Bdecode("text");
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("7:abcdefg");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());	
	assertEquals("abcdefg",ret);
    }
}

function testDecodeTextS() {
    { //text
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("1:a");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());
	assertEquals(0x61, ret[0]);
    }
    { //text
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("7:abcdefg");
	var ret = decode.decodeArrayBuffer(builder.getUint8Array(), 0, builder.getLength());	
	assertEquals(0x61, ret[0]);
	assertEquals(0x62, ret[1]);
	assertEquals(0x63, ret[2]);
	assertEquals(0x64, ret[3]);
	assertEquals(0x65, ret[4]);
	assertEquals(0x66, ret[5]);
    }
}

