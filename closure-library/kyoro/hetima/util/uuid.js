goog.provide("hetima.util.UUID");

hetima.util.UUID = function(){};
hetima.util.UUID.s4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

hetima.util.UUID.getID = function() {
    var s4 = hetima.util.UUID.s4;
    return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4();
};



