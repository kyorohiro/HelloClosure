goog.provide('hetima.util.EncoderTest');
goog.require('hetima.util.Encoder');
goog.require('goog.testing.jsunit');

function testS() {
    {
	var v = hetima.util.Encoder.text2Bytes("hello");
	assertEquals(104, v[0]);
	assertEquals(101, v[1]);
	assertEquals(108, v[2]);
	assertEquals(108, v[3]);
	assertEquals(111, v[4]);
    }
    {
	var v = hetima.util.Encoder.toText(hetima.util.Encoder.text2Bytes("hello"));
	console.log("=="+ v +"==");
	assertEquals("hello", v);
    }
    {
	console.log("%68%65%6C%6C%6F", hetima.util.Encoder.toURLEncode(hetima.util.Encoder.text2Bytes("hello")));
    }
    {
	var v = hetima.util.Encoder.toURLDecode(hetima.util.Encoder.toURLEncode(hetima.util.Encoder.text2Bytes("hello")));
	assertEquals(104, v[0]);
	assertEquals(101, v[1]);
	assertEquals(108, v[2]);
	assertEquals(108, v[3]);
	assertEquals(111, v[4]);
    }
}

function testS() {
    var v = hetima.util.Encoder.text2Bytes("あい");
    assertEquals(0xe3, v[0]);
    assertEquals(0x81, v[1]);
    assertEquals(0x82, v[2]);
    assertEquals(0xe3, v[3]);
    assertEquals(0x81, v[4]);
    assertEquals(0x84, v[5]);
    assertEquals("あい", hetima.util.Encoder.toText(v));
}

