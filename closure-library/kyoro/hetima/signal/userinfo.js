goog.provide('hetima.signal.UserInfo');

hetima.signal.UserInfo = function (num) {
    if(num == undefined) {
	this.mMax = 25;
    } else {
	this.mMax = num;
    }
    
    this.mList = new Array();
    this.length = function() {
	return this.mList.length;
    };
    
    this.add = function (uuid, socket) {
	var v = {};
	v.uuid = uuid;
	v.socket = socket;

	var index = this.find(uuid);
	if(index >=0) {
	    this.mList.splice(index,1);
	} 
	if(this.length() < this.mMax) {
	    this.mList.push(v);
	} else {
	    this.mList.splice(0,1);
	    this.mList.push(v);
	}
    };
    
    this.find = function (uuid) {
	for(var i=0;i<this.mList.length;i++) {
	    if(uuid == this.mList[i].uuid) {
		return i;
	    }
	}
	return -1;
    };

    this.get = function (index) {
	return this.mList[index];
    };
};

