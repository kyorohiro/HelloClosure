goog.provide('hetima.util.BencodeHelper');
goog.require('hetima.util.Encoder');
goog.require('hetima.util.ArrayBuilder');


hetima.util.BencodeHelper.buffer2Text = function(_obj) {
    var type = Object.prototype.toString.apply(_obj);
    if( type == "[object String]") {
	return _obj;
    }
    else if( type == "[object Number]") {
	return _obj;
    }
    else if( type == "[object Uint8Array]") {
	return hetima.util.Encoder.toText(_obj);
    }
    else if( type == "[object Buffer]") {
	return hetima.util.Encoder.toText(_obj);
    }
    else if( type == "[object Array]") {
	for(key in _obj) {
	    _obj[key] = hetima.util.BencodeHelper.buffer2Text(_obj[key]);
	}
	return _obj;
    }
    else {// if( type == "[object Object]") {
	for(key in _obj) {
	    _obj[key] = hetima.util.BencodeHelper.buffer2Text(_obj[key]);
	}
	return _obj;
    }
};
