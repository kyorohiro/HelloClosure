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

    this.getList = function() {
	return this.mList;
    };

    this.add = function (uuid, content) {
	var v = {};
	v.uuid = uuid;
	v.content = content;

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

    this.contain = function(uuid) {
	var index = this.find(uuid);
	if(index == -1) {
	    return false;
	} else {
	    return true;
	}
    }

    this.find = function (uuid) {
	for(var i=0;i<this.mList.length;i++) {
	    console.log("----" + this.mList[i].uuid+","+uuid);
	    if(uuid == this.mList[i].uuid) {
		return i;
	    }
	}
	return -1;
    };

    this.get = function (index) {
	return this.mList[index];
    };

    this.findInfo = function(uuid) {
	var index = this.find(uuid);
	if(index>=0) {
	    return this.get(index);
	} else {
	    return undefined;
	}
    };
};
