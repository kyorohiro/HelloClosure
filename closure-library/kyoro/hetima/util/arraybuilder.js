goog.provide("hetima.util.ArrayBuilder");

hetima.util.ArrayBuilder = function (size) {
    this.mRaw = new ArrayBuffer(size);
    this.mBuffer = new Uint8Array(this.mRaw);
    this.mLength = 0;
    
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
    
    this.update = function(appendLength) {
	if(this.mBuffer.byteLength < (appendLength+this.mLength)) {
	    var nextRaw = new ArrayBuffer((appendLength+this.mLength)*2);
	    var next = new Uint8Array(nextRaw);
	    next.mLength = (appendLength+this.mLength);
	    for(var i=0;i<this.mLength;i++) {
		next[i] = this.mBuffer[i];
	    }
	    this.mBuffer = next;
	    this.mRaw = nextRaw;
	    next = null;
	}
    };
    
    this.getLength = function() {
	return this.mLength;
    };
    
    this.getArrayBuffer = function() {
	return this.mRaw;
    };

    this.toUint8Array = function() {
	var raw = new ArrayBuffer(this.mLength);
	var buffer = new Uint8Array(raw);
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
