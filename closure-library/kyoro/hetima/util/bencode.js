goog.provide('hetima.util.Bencode');
goog.require('hetima.util.ArrayBuilder');

hetima.util.Bencode = function () {
    this.encodeObject = function(_obj) {
	var builder = new hetima.util.ArrayBuilder();
	this.__encode(_obj, builder)
	return builder;
    };
    
    this.__encode = function(_obj, builder) {
	var type = Object.prototype.toString.apply(_obj);
	if( type == "[object String]") {
	    builder.appendText(""+_obj.length+":"+_obj);
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
	else if( type == "[object Object]") {
	    builder.appendText("d");
	    for(key in _obj) {
		builder.appendText(""+key.length+":"+key);
		this.__encode(_obj[key],builder);
	    }
	    builder.appendText("e");
	}
    }	
};
