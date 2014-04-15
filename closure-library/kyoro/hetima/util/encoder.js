goog.provide('hetima.util.Encoder');
goog.require('hetima.util.ArrayBuilder');
hetima.util.Encoder = function() {
};

//
// ref http://shorindo.com/research/1308637883
hetima.util.Encoder.text2Bytes = function(text) {
    var result = new hetima.util.ArrayBuilder();
    if (text == null) {
        return result;
    }   
    for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c <= 0x7f) {
            result.appendByte(c);
        } else if (c <= 0x07ff) {
            result.appendByte(((c >> 6) & 0x1F) | 0xC0);
            result.appendByte((c & 0x3F) | 0x80);
        } else {
            result.appendByte(((c >> 12) & 0x0F) | 0xE0);
            result.appendByte(((c >> 6) & 0x3F) | 0x80);
            result.appendByte((c & 0x3F) | 0x80);
        }
    }
    return result.toUint8Array();
};

hetima.util.Encoder.toText = function(buffer) {
    return hetima.util.Encoder.bytes2Text(buffer);
}

hetima.util.Encoder.bytes2Text = function(buffer) {
    if (buffer == null) {
        return null;
    }
    var result = "";
    var i;
    for( var j=0;j<buffer.length;j++) {
        i = buffer[j];
        if (i <= 0x7f) {
            result += String.fromCharCode(i);
        } else if (i <= 0xdf) {
            var c = ((i&0x1f)<<6);
            c += buffer.shift()&0x3f;
            result += String.fromCharCode(c);
        } else if (i <= 0xe0) {
            var c = ((buffer.shift()&0x1f)<<6)|0x0800;
            c += buffer.shift()&0x3f;
            result += String.fromCharCode(c);
        } else {
            var c = ((i&0x0f)<<12);
            c += (buffer.shift()&0x3f)<<6;
            c += buffer.shift() & 0x3f;
            result += String.fromCharCode(c);
        }
    }
    return result;
}

hetima.util.Encoder.subString = function(buffer, start, length) {
    var text = "";
    for(var i=start;i<start+length;i++) {
	text +=String.fromCharCode(buffer[i]);
    }
    return text;
};


hetima.util.Encoder.subBytes = function(buffer, start, length) {
    var ret = new Uint8Array(new ArrayBuffer(length));
    var j=0;
    for(var i=start;i<start+length;i++,j++) {
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

