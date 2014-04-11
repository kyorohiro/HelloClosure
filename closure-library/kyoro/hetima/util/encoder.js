goog.provide('hetima.util.Encoder');

hetima.util.Encoder = function() {
};

hetima.util.Encoder.toByte = function(message) {
	var buffer = [];
	for(var i=0;i<message.length;i++) {
		buffer.push(message.charCodeAt(i))
	}
	return buffer;
};

hetima.util.Encoder.toString = function(buffer) {
	var message = "";
	for(var i=0;i<buffer.length;i++) {
	    message+=String.fromCharCode(buffer[i]);
	}
	return message;
};


hetima.util.Encoder.subString = function(buffer, start, length) {
	var text = "";
	for(var i=start;i<start+length;i++) {
		text +=String.fromCharCode(buffer[i]);
	}
	return text;
};

hetima.util.Encoder.subBytes = function(buffer, start, length) {
	var ret = new ArrayBuffer(length);
	var j=0;
	for(var i=start;i<start+length;i++) {
		ret[j]= buffer[i];
	}
	return ret;
};

hetima.util.Encoder.toURLEncode = function(buffer) {
	var message = "";
	var pattern = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
	for(var i=0;i<buffer.length;i++) {
	    message+="%";
	    message+=pattern[(0xF&buffer[i]>>4)];
	    message+=pattern[(0xF&buffer[i])];
	}
	return message;
}

hetima.util.Encoder.toURLDecode = function(message) {
	var buffer = [];
	var pattern = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"A":10,"B":11,"C":12,"D":13,"E":14,"F":15};
	for(var i=0,j=0;i<message.length;j++) {
		i++;//%
		buffer[j] = pattern[message[i]];i++;
		buffer[j] = buffer[j]<<4|pattern[message[i]];i++;
	}
	return buffer;
}
//try{module.exports = Encoder;}catch(e){;}
/*
console.log(toByte("hello"));
console.log(toString(toByte("hello")));
console.log(toURLEncode(toByte("hello")));
console.log(toURLDecode(toURLEncode(toByte("hello"))));
*/
