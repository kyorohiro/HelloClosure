goog.provide("hetima.util.ArrayBuilder");

hetima.util.ArrayBuilder = function (size) {
	this.mBuffer = new ArrayBuffer(size);
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
			var next = new ArrayBuffer(this.mLength*2);
			next.mLength = (appendLength+this.mLength);
			for(var i=0;i<next.mLength;i++) {
				next[i] = this.mBuffer[i];
			}
			this.mBuffer = next;
			next = null;
		}
	};

	this.getLength = function() {
		return this.mLength;
	};

	this.getArrayBuffer = function() {
		return this.mBuffer;
	};

	this.toByteBuffer = function() {
		var buffer = new ArrayBuffer(this.mLength);
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
