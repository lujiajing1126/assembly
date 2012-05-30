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
		.attr("style", "position: absolute")
		.append(frameBot);

function framePrepareFrameNav() {
	$.ajax({
		url: "/index_bar.php",
		dataType: "json",
		cache: false,
		success: function (data) {
				for (item in data.link) {
					var curr;
					frameNavOl
						.append(
							curr = $("<li/>")
								.append(data.link[item].text)
								.data("openlink", data.link[item].url)
								.click(function () {
										window.location = $(this).data("openlink")
									}));
					if (data.link[item].url == window.location.pathname + window.location.search)
						curr.addClass("frame_nav_checked");
				}
				for (item in data.decorator) {
					frameNavRef.append($(data.decorator[item]));
				}
			}
		});
}

function framePrepareframeBot() {
	$.ajax({
		url: "/index_bottom.php",
		dataType: "json",
		cache: false,
		success: function (data) {
				for (item in data.content) {
					frameBot.append($(data.content[item]));
				}
				for (item in data.decorator) {
					frameBotRef.append($(data.decorator[item]));
				}
			}
		});
}

function frameBarLayout() {
	frameMainbox.trigger("refresh_bar_position");
}

function frameBarLayoutLV() {
	frameBarLayout();
	setTimeout(function() {frameBarLayoutLV();}, 500);
}

function frameEnclose() {
	var body = $("body");
	if (!body.find("div.frame_prevent").length) {
		framePrepareFrameNav();
		framePrepareframeBot();
		body.find("> *").appendTo(frameCore);
		body
			.addClass("frame")
			.append(frameNavRef)
			.append(frameBotRef)
			.append(frame);
		frameMainbox.bind("refresh_bar_position", function () {
				frameNavRef.offset(frameMainbox.offset());
				frameBotRef.offset(function () {
						var o = frameMainbox.offset();
						o.top += frameMainbox.height();
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

$(function () {
		frameEnclose();
	})
