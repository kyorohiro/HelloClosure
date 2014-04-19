goog.provide("hetima.util.ArrayBuilder");

hetima.util.ArrayBuilder = function (size, mode) {
    if(mode == undefined || mode == "client") {
	this.mMode = "client";
	this.mBuffer = new Uint8Array(new ArrayBuffer(size));
    } else {
	this.mMode = mode;//server
	this.mBuffer = new Buffer(size);
    }
    
    this.mLength = 0;
    var _this = this;
    this.appendText = function(text) {
	this.update(text.length);
	for(var i=0;i<text.length;i++) {
	    this.mBuffer[this.mLength] = text.charCodeAt(i);
	    this.mLength++;
	}
    };
    
    this.appendBytes = function(bytes) {
	this.update(bytes.byteLength);
	for(var i=0;i<bytes.byteLength;i++) {
	    this.mBuffer[this.mLength] = bytes[i];
	    this.mLength++;
	}
    };
    
    this.appendByte = function(datam) {
	this.update(1);
	this.mBuffer[this.mLength] = datam;
	this.mLength++;
    };
    
    this.update = function(appendLength) {
	if(this.mBuffer.length < (appendLength+this.mLength)) {
	    var next;
	    if(_this.mMode == "client") {
		next = new Uint8Array(new ArrayBuffer((appendLength+this.mBuffer.length)*2));
	    } else {
		next = new Buffer((appendLength+this.mBuffer.length)*2);
	    }
	    for(var i=0;i<this.mLength;i++) {
		next[i] = this.mBuffer[i];
	    }
	    this.mBuffer = next;
	}
    };
    
    this.getLength = function() {
	return this.mLength;
    };
    
    this.getUint8Array = function() {
	return this.mBuffer
    };
    
    this.toUint8Array = function() {
	var buffer = new Uint8Array(new ArrayBuffer(this.mLength));
	buffer.mLength = this.mLength;
	for (var i=0;i<buffer.byteLength;i++) {
	    buffer[i] = this.mBuffer[i];
	}
	return buffer;
    };
    
    this.toText = function() {
	var text = "";
	for(var i=0;i<this.mLength;i++) {
	    text +=String.fromCharCode(this.mBuffer[i]);
	}
	return text;
    };
    
    this.subString = function(start, length) {
	var text = "";
	for(var i=start;i<this.mLength&&i<(start+length);i++) {
	    text +=String.fromCharCode(this.mBuffer[i]);
	}
	return text;
    }
}
