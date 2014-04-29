goog.provide('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.ArrayBuilder');


hetima.util.Bencode = function (mode) {
    if(mode == undefined) {
	this.mMode = "client";
    } else {
	this.mMode = mode;
    }
    
    this.encodeObject = function(_obj) {	
	var builder = new hetima.util.ArrayBuilder(100, this.mMode);
	this.__encode(_obj, builder)
	return builder;
    };
    
    this.__encode = function(_obj, builder) {
	var type = Object.prototype.toString.apply(_obj);
	if( type == "[object String]") {
	    builder.appendText(""+_obj.length+":"+_obj);
	}
	else if( type == "[object Uint8Array]") {
	    builder.appendText(""+_obj.length+":");
	    builder.appendBytes(_obj);
	}
	else if( type == "[object Buffer]") {
	    builder.appendText(""+_obj.length+":");
	    builder.appendBytes(_obj);
	}
	else if( type == "[object Number]") {
	    builder.appendText("i"+_obj+"e");
	}
	else if( type == "[object Array]") {
	    builder.appendText("l");
	    for(key in _obj) {
		this.__encode(_obj[key],builder);
	    }
	    builder.appendText("e");
	}
	else {// if( type == "[object Object]") {
	    builder.appendText("d");
	    for(key in _obj) {
		builder.appendText(""+key.length+":"+key);
		this.__encode(_obj[key],builder);
	    }
	    builder.appendText("e");
	} 

    }	
};



hetima.util.Bencode.sMode  = "client";
hetima.util.Bencode.sType  = "binary";
hetima.util.Bencode.sEinst = undefined;
hetima.util.Bencode.sDinst = undefined;
hetima.util.Bencode.sCash  = undefined;

hetima.util.Bencode.encode = function(_obj) {
    if(hetima.util.Bencode.sEinst == undefined) {
	hetima.util.Bencode.sEinst = new hetima.util.Bencode(
	    hetima.util.Bencode.sMode,
	    hetima.util.Bencode.sType);
    }
    var ret = hetima.util.Bencode.sEinst.encodeObject(_obj)
    return ret.getBuffer();
};


hetima.util.Bencode.decode = function(_obj) {
    if(hetima.util.Bencode.sDinst == undefined) {
	hetima.util.Bencode.sDinst = new hetima.util.Bdecode(
	    hetima.util.Bencode.sMode,
	    hetima.util.Bencode.sType);
    }
    if(hetima.util.Bencode.sCash == undefined) {
	hetima.util.Bencode.sCash = new hetima.util.ArrayBuilder(100, hetima.util.Bencode.sMode);
    }
    var type = Object.prototype.toString.apply(_obj);
    if( type == "[object String]") {
	hetima.util.Bencode.sCash.clear();
	hetima.util.Bencode.sCash.appendText(_obj);
	var ret = hetima.util.Bencode.sDinst.decodeArrayBuffer(hetima.util.Bencode.sCash.getBuffer(), 0, hetima.util.Bencode.sCash.getLength());
	return ret
    } else {
	var ret = hetima.util.Bencode.sDinst.decodeArrayBuffer(_obj, 0, _obj.length);
	return ret
    };
}

