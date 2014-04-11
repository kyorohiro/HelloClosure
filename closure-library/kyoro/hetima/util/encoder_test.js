goog.provide('hetima.util.EncoderTest');
goog.require('hetima.util.Encoder');
goog.require('goog.testing.jsunit');

function testS() {
    {
	var v = hetima.util.Encoder.toByte("hello");
	assertEquals(104, v[0]);
	assertEquals(101, v[1]);
	assertEquals(108, v[2]);
	assertEquals(108, v[3]);
	assertEquals(111, v[4]);
    }
    {
	assertEquals("hello", hetima.util.Encoder.toString(hetima.util.Encoder.toByte("hello")));
    }
    {
	console.log("%68%65%6C%6C%6F", hetima.util.Encoder.toURLEncode(hetima.util.Encoder.toByte("hello")));
    }
    {
	var v = hetima.util.Encoder.toURLDecode(hetima.util.Encoder.toURLEncode(hetima.util.Encoder.toByte("hello")));
	assertEquals(104, v[0]);
	assertEquals(101, v[1]);
	assertEquals(108, v[2]);
	assertEquals(108, v[3]);
	assertEquals(111, v[4]);
    }
}

