/**
 * @author megrez
 */
define(function(require, exports, module) {
	var $ = window.$;
	$('.unslider-banner').unslider({
		speed : 500,
		delay : 5000,
		keys : true,
		dots : true
		// arrows: true
	});
	$('#ca-container').contentcarousel();
	$('.ca-list-item').first().addClass("sel");
});
