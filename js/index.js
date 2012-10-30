var map = {
	tzygs: "通知与告示",
	sthd: "社团活动",
	xwzx: "新闻",
	xshhd: "学生会活动"
};

function loadList(n) {
	$.ajax({
		url: "/system/announcement_service",
		dataType: "json",
		cache: false,
		data: {
			routine: "gettop",
			type: map[n],
			size: 5
			},
		success: function (data) {
				if (data != null)
					for (var i = 0; i != data.length; ++i) {
						$("#" + n + " ul").append($("<li/>").append($("<a/>", {href: "/e" + data[i].id}).append(data[i].title)));
					}
			}
		});
};
(function($) {
	$.fn.customButton = function (normalClass, hoverClass, pushClass) {
		this.addClass(normalClass);
		this.hover(
			function (event) {
				$(this).removeClass(normalClass);
				$(this).addClass(hoverClass);
				$(this).data("in", true);
			},
			function (event) {
				$(this).removeClass(pushClass);
				$(this).removeClass(hoverClass);
				$(this).addClass(normalClass);
				$(this).data("in", false);
			});
		this.mousedown(function (event) {
				$(this).removeClass(normalClass);
				$(this).removeClass(hoverClass);
				$(this).addClass(pushClass);
			});
		this.mouseup(function (event) {
				$(this).removeClass(normalClass);
				$(this).removeClass(pushClass);
				if ($(this).data("in")) {
					$(this).addClass(hoverClass);
				} else {
					$(this).addClass(normalClass);
				}
			});
		return this;
	}
}) (jQuery);

var buttonMap = {
	"button-center": "/index.php",
	"button-rt": "/post/post.html",
	"button-rb": "/index.php",
	"button-lt": "/index.php",
	"button-lb": "/wiki/su/assn"
};

function loadButton(b) {
	$("div." + b)
		.customButton(b + "-normal", b + "-hover", b + "-push")
		.click(function () {
				window.location.assign(buttonMap[b]);
			});
}

$(document).ready(function () {
		for(var n in map)
			loadList(n);
		for(var b in buttonMap)
			loadButton(b);
		$.ajax({
			url: "/index_pav.php",
			dataType: "json",
			cache: false,
			success: function (data) {
					$("div.pav").css("background-image", data.image[0]);
				}});
	});
