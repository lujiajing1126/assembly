function HttpClock(autosync) {
	this.sync();
	setInterval(function () {this.sync}, autosync);
}

HttpClock.prototype.sync = function () {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	t1 = new Date().getTime()
	xmlhttp.open("GET", "/srv/ajaxtime.php?_=" + new Date().getTime(), true);
	xmlhttp.send();
	var _this = this;
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			t2 = xmlhttp.responseText;
			if (_this.updator !== undefined)
				clearInterval(_this.updator);
			_this.current = parseInt((t1 / 1000 + parseInt(t2)) / 2);
			_this.updator = setInterval(function () {++ _this.current;}, 1000);
		}
	}
};
