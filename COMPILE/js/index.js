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
	"button-rt": "/post/index.html",
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
		for(var b in buttonMap)
			loadButton(b);
	});
