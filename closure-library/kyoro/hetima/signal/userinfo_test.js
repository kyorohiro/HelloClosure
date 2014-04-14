goog.provide('hetima.signal.UserInfoTest');
goog.require('hetima.signal.UserInfo');
goog.require('goog.testing.jsunit');
function testA()
{
    var info = new hetima.signal.UserInfo(3);
    assertEquals(0, info.length());
    info.add("xx1_key","xx1_body");
    assertEquals(1, info.length());
    info.add("xx2_key","xx1_body");
    assertEquals(2, info.length());
    info.add("xx3_key","xx1_body");
    assertEquals(3, info.length());
    info.add("xx4_key","xx1_body");
    assertEquals(3, info.length());

    assertEquals("xx2_key", info.get(0).uuid); 
    assertEquals("xx3_key", info.get(1).uuid);
    assertEquals("xx4_key", info.get(2).uuid);

    assertEquals(0, info.find("xx2_key"));
    assertEquals(1, info.find("xx3_key"));
    assertEquals(2, info.find("xx4_key"));

    info.add("xx3_key","xx3_body");
    assertEquals(0, info.find("xx2_key"));
    assertEquals(1, info.find("xx4_key"));
    assertEquals(2, info.find("xx3_key"));
}


