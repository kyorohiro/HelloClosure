goog.provide('hetima.signal.UserInfo');

hetima.signal.UserInfo = function () {
    this.list = new Array();
    this.add = function (uuid, socket) {
	var v = {};
	v.uuid = uuid;
	v.socket = socket;
	this.list[uuid] = v;
    };

    this.get = function (uuid) {
	return this.list[uuid];
    }

    this.show = function() {
	for(key in this.list) {
	    var v = this.list[key];
	    console.log("["+key+"]="+v.type+","+v.sdp+","+v.name+","+v.socket+",")
	}
    };

    this.keys = function() {
	var _ret = [];
	for(key in this.list) {
	    _ret.push(""+key);
	}
	return _ret;
    };

};

