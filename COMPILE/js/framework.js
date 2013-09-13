(function ($) {
	function frameNewDivOf(c) {
		return $("<div/>", {"class": c});
	}

	var
		frameCore = frameNewDivOf("frame_content"),
		frameMainbox = frameNewDivOf("frame_mainbox").append(frameCore),
		frame = frameNewDivOf("frame_frame")
			.append(frameNewDivOf("banner"))
			.append(frameMainbox),
		frameNav = frameNewDivOf("frame_nav"),
		frameNavRef = frameNewDivOf("frame_nav_ref")
			.attr("style", "position: absolute")
			.append(frameNav),
		frameNavOl = $("<ol/>").appendTo(frameNav),
		frameBot = frameNewDivOf("frame_bot"),
		frameBotRef = frameNewDivOf("frame_bot_ref")
			.attr("style", "position: relative")
			.append(frameBot)
			.appendTo(frame),
		framePrompt = frameNewDivOf("frame_prompt")
			.appendTo(frame);

	function framePrepareFrameNavAndBot() {
		$.ajax({
			url: "/frameworkdata.php",
			dataType: "json",
			cache: false,
			success: function (data) {
					var nav = data['top'];
					for (var item = 0; item != nav['link'].length; ++item) {
						var curr;
						frameNavOl
							.append(
								curr = $("<li/>")
									.data("openlink", nav['link'][item]['url'])
									.click(function () {
										window.location = $(this).data("openlink")
										})
									.append($("<a/>", {href: nav['link'][item]['url']})
									.append(nav['link'][item]['text'])));
						if (nav['link'][item]['url'] == window.location.pathname + window.location.search)
							curr.addClass("frame_nav_checked");
					}
					for (item in nav['decorator']) {
						frameNavRef.append($(nav['decorator'][item]));
					}
					var bottom = data['bottom'];
					for (var item = 0; item != bottom['content'].length; ++item) {
						frameBot.append($(bottom['content'][item]));
					}
					for (var item = 0; item != bottom['decorator'].length; ++item) {
						frameBotRef.append($(bottom['decorator'][item]));
					}
				}
			});
	}

	function framePreparePrompt() {
		var data = {};
		data.origin = document.location.href;
		$.ajax({
			url: "/system/user_info_prompt",
			dataType: "html",
			data: data,
			cache: false,
			success: function (data) {
					framePrompt.append(data);
				}
			});
	}

	function frameParallel(code) {
		setTimeout(code, 0);
	}

	function frameBarLayout() {
		frameMainbox.trigger("refresh_bar_position");
	}

	function frameBarLayoutLV() {
		frameBarLayout();
		setTimeout(function() {frameBarLayoutLV();}, 250);
	}

	function frameEnclose() {
		var body = $("body");
		if (!(body.hasClass("with_frame") || body.find("div.frame_prevent").length)) {
			var cookies = {};
			var cookie_pieces = (document.cookie? document.cookie : "").split(';');
			for (i = 0; i < cookie_pieces.length; ++i) {
				cookie_pieces[i] = cookie_pieces[i].trim();
				var eq = cookie_pieces[i].indexOf('=');
				if (eq === -1) {
					cookies[cookie_pieces[i]] = null;
				} else {
					cookies[cookie_pieces[i].substr(0, eq)] = cookie_pieces[i].substr(eq + 1);
				}
			}
			if (cookies['FWNG-ALPHA'] !== undefined) {
				var main = $('<div id="framework-main"></div>');
				main.append(body.contents());
				body.addClass('FWNG-ALPHA');
				body.append('<div id="framework-header">'
						+'<div id="framework-header-leftdec"></div>'
						+'<div id="framework-header-rightdec"></div>'
						+'<div id="framework-titlewrap">'
							+'<div id="framework-title">'
								+'<div id="framework-title-a"></div>'
								+'<div id="framework-title-b"></div>'
								+'<div id="framework-title-c"></div>'
							+'</div>'
						+'</div>'
					+'</div>');
				body.append($('<div id="framework-navi"></div>')
					.append(frameNavOl)
					.append($("<div/>", {"class": "frame_clearer"})));
				body.append($('<div id="framework-mainwrap"></div>')
					.append(main));
				body.append('<div id="framework-tail">'
						+'<div id="framework-tail-right"></div>'
						+'<div id="framework-tail-left"></div>'
						+'<div id="framework-tail-bar"></div>'
					+'</div>');
				return;
			}

			body.addClass("with_frame");
			var escaped = $(".frame_escape").detach();
			frameCore
				.append(body.contents())
				.append($("<div/>", {"class": "frame_clearer"}));
			body
				.addClass("frame")
				.append(frameNavRef)
				.append(frame)
				.append(escaped);
			frameMainbox.bind("refresh_bar_position", function () {
					frameNavRef.offset(frameMainbox.offset());
					frameBotRef.offset(function () {
							var o = frameMainbox.offset();
							o.top += frameMainbox.innerHeight();
							return o;
						});
				});
			frameBarLayout();
			frameMainbox.ready(frameBarLayout);
			frameMainbox.load(frameBarLayout);
			$(window).load(function () {
					frameBarLayout();
					if (!body.find("div.frame_static").length)
						frameBarLayoutLV();
				});
		}
	}

	frameParallel(framePrepareFrameNavAndBot);
	frameParallel(framePreparePrompt);

	$(function () {
			frameEnclose();
		})
})(window.jQuery);
