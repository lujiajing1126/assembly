$.fn.collect = function () {
	return this.data("collector").call(this);
}

$.fn.inputable = function () {
	this.each(function() {
		var input = $("<input type='text'/>"),
		    span = $("<span/>");
		    updateWidth = function () {
				span.text(input.val())
				input.width(span.width() < 20? 20: span.width());
			};
		this.type = "inputable";
		$(this).addClass("inputable")
		$(this)
			.append(span)
			.append(input)
			.on("update-width-needed.inputable", updateWidth);
		input
			.focusin(function () {
					$(this).width(span.width() < 100? 100: span.width());
				})
			.focusout(updateWidth)
			.keypress(function (e) {
					if (e.which === 13) {
						$(this).blur();
						e.preventDefault();
						e.stopPropagation();
					}
				})
			.on(($.support.selectstart ? "selectstart" : "mousedown") + ".inputable",
				function (e) {
					e.stopPropagation();
				});
		updateWidth();
	});
	return this;
}

$.valHooks.inputable = {
	"get": function (elem) {
			return $(elem).find("> :text").val();
		},
	"set": function (elem, value) {
			return $(elem).find("> :text").val(value).trigger("update-width-needed");
		}};

var html_editor_save_callback = function (elem, html, body) {
}

function installTinyMCE(obj, options) {
	var origOptions = {
		script_url : '/js/tiny_mce/tiny_mce.js',

		mode : "textareas",
		theme : "advanced",
		plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink," +
		          "emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace," +
		          "print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars," +
			  "nonbreaking,xhtmlxtras,template,advlist",

		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|," +
		                          "justifyleft,justifycenter,justifyright,justifyfull,|," +
					  "styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,search," +
		                          "replace,|,bullist,numlist,|,outdent,indent,blockquote,|," +
					  "link,unlink,anchor,image,cleanup,help,code,|,insertdate," +
					  "inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|," +
		                          "charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|," +
					  "fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops," +
		                          "|,cite,abbr,acronym,del,ins,attribs,|,visualchars," +
					  "nonbreaking,pagebreak",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : false
	};
	obj.tinymce($.extend(origOptions, options));
}

function newRemover(item) {
	var ret = $("<div/>", {"class": "post-data-item-remover"});
	ret
		.append("删除")
		.click(function () {
			item.fadeOut(300, function () {
					item.remove();
				});
		})
		.disableSelection()
		.on("mousedown.post-data-item-remover",
			function (e) {
				e.stopPropagation();
			});
	return ret;
}

function newItemNameBox(item, value) {
	var ret = $("<span/>", {"class": "post-data-item-name-box"}).inputable().val(value);
	item.data("collector-name", function () { return ret.val(); });
	return ret;
}

function newItem(itemName) {
	var ret = $("<li/>", {"class": "post-data-item"});
	ret
		.data("collector", function () { return null; })
		.append($("<div/>", {"class": "post-data-item-content"})
			.append(newItemNameBox(ret, itemName))
			.append(": "))
		.append(newRemover(ret));
	return ret;
}

function newItemDescription(description) {
	return $("<div/>", {"class": "post-data-item-description"}).text(description);
}

function newKeywordItem(itemName, itemValue) {
	var ret = newItem(itemName),
	    value = $("<span/>", {"class": "post-data-item-value-keyword"}).inputable().val(itemValue);
	ret
		.data("collector", function () {
			return	{
					"name": ret.data("collector-name").call(ret),
					"data": value.val(),
					"desc": "keyword"
				};
			})
		.prepend(newItemDescription("关键字"))
		.find(".post-data-item-content")
		.append(value);
	return ret;
}

function newDatetimeItem(itemName, itemValue) {
	var ret = newItem(itemName),
	    valueDate = $("<input/>", {"class": "post-data-item-value-date"}).datepicker(
	    	{
	    		"dateFormat": "yy-mm-dd",
	    		"onSelect": function () {
	    				valueDate.removeClass("post-data-item-value-date-unset");
	    			}
	    	}).val(itemValue.date),
	    valueTime = $("<input/>", {"class": "post-data-item-value-time"}),
	    desc = newItemDescription("日期");
	valueDate
		.addClass("post-data-item-value-date-unset")
		.focusin(function () {
				$(this).removeClass("post-data-item-value-date-unset");
			})
		.blur(function () {
				if ($(this).val() === "") {
					$(this).addClass("post-data-item-value-date-unset")
				}
			});
	valueTime
		.data("present", false)
		.addClass("post-data-item-value-time-unset")
		.val("时间")
		.focusin(function () {
				if (!$(this).data("present")) {
					$(this).val("");
					$(this).data("present", true);
					$(this).removeClass("post-data-item-value-time-unset")
				}
			})
		.focusout(function () {
				if (!/^(\d\d?:\d\d:\d\d)?$/.test($(this).val())) {
					alert("时间格式错误：请以“hh:mm:ss”格式填写时间");
					$(this).val("");
				}
				if ($(this).val() === "") {
					$(this).data("present", false);
					$(this).addClass("post-data-item-value-time-unset")
					$(this).val("时间");
				}
				if ($(this).data("present")) {
					desc.text("时间");
				} else {
					desc.text("日期");
				}
			});
	if ("time" in itemValue) {
		valueTime.focusin();
		valueTime.val(itemValue.time);
		valueTime.focusout();
	}
	ret
		.data("collector", function () {
			return	{
					"name": ret.data("collector-name").call(ret),
					"data": valueTime.data("present")?
						{"date": valueDate.val(), "time": valueTime.val()} :
						{"date":valueDate.val()},
					"desc": "date"
				};
			})
		.prepend(desc)
		.find(".post-data-item-content")
		.append(valueDate)
		.append(valueTime);
	return ret;
}

function newNumberItem(itemName, itemValue) {
	var ret = newItem(itemName),
	    value = $("<span/>", {"class": "post-data-item-value-number"}).inputable().val(itemValue),
	    desc = newItemDescription("数字");
	value
		.on("keydown.post-data-item-value-number", function (e) {
				if (e.which === 190) {
					if ($(this).val().indexOf(".") !== -1) {
						e.preventDefault();
						e.stopPropagation();
					}
				} else if (!(e.which == 8 || 48 <= e.which && e.which < 58)) {
					e.preventDefault();
				}
			})
		.on("keyup.post-data-item-value-number", function () {
				var v = $(this).val();
				if (v === "" || v === "0") {
					desc.text("数字");
				} else if (v.indexOf(".") === -1) {
					desc.text("整数");
				} else {
					desc.text("实数");
				}
			});
	ret
		.data("collector", function () {
				var v = value.val();
				if (v.indexOf(".") === -1)
					return	{
							"name": ret.data("collector-name").call(ret),
							"data": parseInt(value.val()),
							"desc": "integer"
						};
				else
					return	{
							"name": ret.data("collector-name").call(ret),
							"data": parseFloat(value.val()),
							"desc": "floatpoint"
						};
			})
		.prepend(desc)
		.find(".post-data-item-content")
		.append(value);
	return ret;
}

function newTextItem(itemName, itemValue, html) {
	var ret = newItem(itemName),
	    isHtml = $('<select><option value="plaintext">纯文本</option><option value="html">HTML</option></select>'),
	    openHtmlEditor = $("<button/>").append("高级编辑器"),
	    openHtmlEditorUpdater = function () {
	    		if (isHtml.val() === "html")
	    			openHtmlEditor.fadeIn(300);
	    		else
	    			openHtmlEditor.fadeOut(300);
	    	},
	    typeBox = $("<div/>").append(isHtml).append(openHtmlEditor).hide(),
	    value = $("<textarea/>", {"class": "post-data-item-value-text"})
	    	.val(itemValue)
	    	.focusin(function () {typeBox.show(300); value.addClass("logicalfocus");});
	openHtmlEditor.click(function () {
			$(".html_editor").show();
			$("#html_editor").val(value.val());
			html_editor_save_callback = function (elem, html, body) {
					value.val(html);
					html_editor_save_callback = function (elem, html, body) {console.log(arguments);};
				}
		});
	if (html) {
		isHtml.val("html");
	} else {
		isHtml.val("plaintext");
		openHtmlEditor.hide();
	}
	isHtml.change(function () {openHtmlEditorUpdater();});
	ret
		.data("collector", function () {
			return	{
					"name": ret.data("collector-name").call(ret),
					"data": value.val(),
					"desc": isHtml.val()
				};
			})
		.prepend(newItemDescription("文章"))
		.find(".post-data-item-content")
		.append(typeBox)
		.append($("<div/>").append(value))
		.focusout(function () {
				setTimeout(function () {
						if (!ret.is(":focus") && ret.find(":focus").length === 0) {
							typeBox.hide(300);
							value.prop("scrollTop", 0);
							value.removeClass("logicalfocus");
						}
					}, 300);
			});
	return ret;
}

function addKeywordItem(itemName, itemValue) {
	var item = newKeywordItem(itemName, itemValue);
	$(".post-data").append(item);
	item.find(".inputable").trigger("update-width-needed");
}

function addNumberItem(itemName, itemValue) {
	var item = newNumberItem(itemName, itemValue);
	$(".post-data").append(item);
	item.find(".inputable").trigger("update-width-needed");
}

function addTextItem(itemName, itemValue, html) {
	var item = newTextItem(itemName, itemValue, html);
	$(".post-data").append(item);
	item.find(".inputable").trigger("update-width-needed");
}

function addDatetimeItem(itemName, itemValue) {
	var item = newDatetimeItem(itemName, itemValue);
	$(".post-data").append(item);
	item.find(".inputable").trigger("update-width-needed");
}

function addFromData(data) {
	var addFunc = {
			"keyword": [addKeywordItem],
			"plaintext": [addTextItem, false],
			"html": [addTextItem, true],
			"integer": [addNumberItem],
			"floatpoint": [addNumberItem],
			"date": [addDatetimeItem]
		};
	for (var i = 0; i != data.length; ++ i) {
		var
			cAddFunc = addFunc[data[i].desc],
			args = [data[i].name, data[i].data];
		for (var j = 1; j != cAddFunc.length; ++ j)
			args.push(cAddFunc[j]);
		cAddFunc[0].apply(this, args);
	}
}

function collectData() {
	var items = $(".post-data > *"), data = [];
	for (var i = 0; i != items.length; ++i) {
		data.push($(items[i]).collect());
	}
	return data;
}

function prepareTemplates() {
	$.ajax({
			url: "templates.js",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
					for (var id in data) {
						var option =
							$('<option/>', {value: id})
								.append(data[id].name);
						$('#template_list').append(option);
					}
					$('#template_add').click(function () {
							addFromData(data[$('#template_list').val()].data);
						});
					$('#template_list').change(function () {
							$('#template_description')
								.contents()
								.remove();
							$('#template_description')
								.append(data[$('#template_list').val()].description);
						}).change();
				}
		});
}

function html_editor_save_callback_wrapper() {
	html_editor_save_callback.apply(this, arguments);
	$(".html_editor").hide();
	return true;
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

var editingId;
function getEditingId() {
	return editingId? editingId : editingId = getURLParameter("id");
}

function loadFromRemote(id) {
	$.ajax({url: '/system/post_service',
	        data: {'action': 'load',
		       'id':     id},
		dataType: 'json',
	        success: function (data, textStatus, jqXHR) {
	        		if (data.status == 'ok') {
					addFromData(data.data);
					sessionStorage.announcement_post_data_id = getEditingId();
	        		} else if (data.status == 'permission denied') {
	        			alert('权限不足（' + data.reason + '）');
	        		} else if (data.status == 'not found') {
	        			alert('没有该公告');
	        		} else {
	        			alert('未知问题');
	        		}
	        	},
	        error: function error(jqXHR, textStatus, errorThrown) {
	        		alert('通信问题导致未能加载公告（' + textStatus + '）');
	        	}})
}

var autoSave;

function saveDataToSession() {
	if (typeof sessionStorage !== "undefined")
		sessionStorage.announcement_post_data = JSON.stringify(collectData());
}

function setupStorage() {
	if (typeof localStorage === "undefined") {
		$('#storage').hide();
	} else {
		if (!localStorage.announcement_post_data) {
			$('#storage_load').hide();
			$('#storage_clear').hide();
		}
		$('#storage_load').click(function () {
				$('.post-data').contents().remove();
				addFromData(JSON.parse(localStorage.announcement_post_data));
			});
		$('#storage_clear').click(function () {
				localStorage.removeItem("announcement_post_data");
				$('#storage_load').fadeOut(300);
				$('#storage_clear').fadeOut(300);
			});
		$('#storage_save').click(function () {
				localStorage.announcement_post_data = JSON.stringify(collectData());
				$('#storage_load').fadeIn(300);
				$('#storage_clear').fadeIn(300);
			});
	}

	if (getEditingId() && getEditingId() != sessionStorage.announcement_post_data_id) {
		loadFromRemote(getEditingId());
	} else {
		if (typeof sessionStorage !== "undefined"
		 && sessionStorage.announcement_post_data)
			addFromData(JSON.parse(sessionStorage.announcement_post_data));
	}

	autoSave = setInterval(function () {
			saveDataToSession();
		}, 30000);
	window.onbeforeunload = function () {
			if (autoSave)
				saveDataToSession();
		}
}

function setupSaveButton () {
	$('#do_post').click(function () {
			var data = {"action": "post",
				    "data": JSON.stringify(collectData())},
			    id = getEditingId();

			if (id)
				data["id"] = id;

			$.ajax({url: "/system/post_service",
				type: "POST",
				data: data,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
						if (data.status == 'ok') {
							clearInterval(autoSave);
							sessionStorage.removeItem("announcement_post_data_id");
							sessionStorage.removeItem("announcement_post_data");
							autoSave = null;
							location = '/e' + data.id;
						} else if (data.status == 'permission denied') {
							alert('权限不足（' + data.reason + '）');
						} else {
							alert('格式问题（' + data.reason + '）');
						}
					},
				error: function error(jqXHR, textStatus, errorThrown) {
						alert('通信问题（' + textStatus + '）');
					}});
		});
}

function setupUtil() {
	if (getEditingId()) {
		$('#util_edit_info').append('正在编辑：' + getEditingId());
		$('#util_edit_drop').click(function() {
				$.ajax({url: '/system/post_service',
					dataType: 'json',
					data: {action:     'drop',
					       id: getEditingId()},
					success: function (data, textStatus, jqXHR) {
							if (data.status == 'ok') {
								location = '/post/post.html';
							}
						}});
			});
	} else {
		$('#util_edit').hide();
	}
	$('#util_clear').click(function () {
			$('.post-data').contents().remove();
			saveDataToSession();
		});
	$("#util_sign").hide();
	$("#util_sign_select").hide();
	$.ajax({url: '/system/post_service',
		dataType: 'json',
	        data: {action:     'util',
		       sub_action: 'get_signatures'},
		success: function (data, textStatus, jqXHR) {
				if (!$.isEmptyObject(data)) {
					for (var orgId in data) {
						$("#util_sign_select").append($('<option/>', {value: orgId}).append(data[orgId]));
					}
					$("#util_sign").show();
					$("#util_sign_select").show();
				}
			}});
	$("#util_sign").click(function () {
			var orgId = $("#util_sign_select").val();
			if (orgId && orgId !== "") {
				addFromData([{desc: "keyword", name: "发布机构", data: orgId}]);
			}
		});
}

$(document).ready(function () {
		$(".post-data").sortable();
		$(".post-add").disableSelection();
		installTinyMCE($(".html_editor_real"), {width: 720, height: 434, save_callback: "html_editor_save_callback_wrapper"});

		$("#post-add-keyword").click(function () { addFromData([{desc: "keyword", name: "关键字类型", data: "关键字"}]); });
		$("#post-add-text").click(function () { addFromData([{desc: "plaintext", name: "条目名称", data: "文本"}]); });
		$("#post-add-number").click(function () { addFromData([{desc: "integer", name: "条目名称", data: 0}]); });
		$("#post-add-datetime").click(function () { addFromData([{desc: "date", name: "条目名称", data: {"date": "1970-1-1"}}]); });

		prepareTemplates();

		setupStorage();
		setupSaveButton();
		setupUtil();
	});
