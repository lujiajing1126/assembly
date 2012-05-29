var ajaxAddr = "view_ajax.php";
function Path (structure, path) {
  var
    TBCLASS = "type_button",
    STBCLASS = "subtype_button",
    STBBCLASS = "subtype_box",
    TBCLASSX = "type_button_selected",
    STBCLASSX = "subtype_button_selected",
    SELECTOR_DELAY = 200;
  this.typeButtons = {};
  this.path = [null, null];
  this.structure = structure;
  this.toggleTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
  };
  this.selectTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
    this.typeButtons[type].subtype_box.fadeIn(500);
    if (typeof structure[type]._default.div != "undefined")
      structure[type]._default.div.show(SELECTOR_DELAY);
  };
  this.deselectTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
    this.typeButtons[type].subtype_box.fadeOut(500);
    if (typeof structure[type]._default.div != "undefined")
      structure[type]._default.div.hide(SELECTOR_DELAY);
  };
  this.deselectSubtypeButton = function (type, subtype) {
    this.typeButtons[type].subtypes[subtype]
      .toggleClass(STBCLASS + " " + STBCLASSX);
    if (typeof structure[type][subtype].div != "undefined")
      structure[type][subtype].div.hide(SELECTOR_DELAY);
  };
  this.selectSubtypeButton = function (type, subtype) {
    this.typeButtons[type].subtypes[subtype]
      .toggleClass(STBCLASS + " " + STBCLASSX);
    if (typeof structure[type][subtype].div != "undefined")
      structure[type][subtype].div.show(SELECTOR_DELAY);
  };
  this.select = function (type, subtype) {
    if (this.path[0] != type) {
      if (this.path[0] != null) {
        this.deselectTypeButton(this.path[0]);
      }
      this.selectTypeButton(type);
      if (this.path[1] != null) {
        this.deselectSubtypeButton(this.path[0], this.path[1]);
      }

      this.path[0] = type;
      this.path[1] = null;
      this.select(type, subtype);
    } else if (this.path[1] != subtype) {
      if (this.path[1] != null) {
        this.deselectSubtypeButton(this.path[0], this.path[1]);
      }
      if (subtype != null) {
        this.selectSubtypeButton(type, subtype);
        this.path[1] = subtype;
      } else {
        this.path[1] = subtype;
      }
      refreshResult();
    } else {
      refreshResult();
    }
  };
  this.typeButtonSelect = function () {
    $(this).data("manager").select($(this).data("path_type"), null);
  };
  this.subtypeButtonSelect = function () {
    $(this).data("manager").select($(this).data("path_type"), $(this).data("path_subtype"));
  };
  this.createTypeButton = function (type) {
    var tb = $("<li/>", {"class": TBCLASS})
      .append(type)
      .click(this.typeButtonSelect)
      .data("manager", this)
      .data("path_type", type);
    this.typeButtons[type] = {
      button: tb,
      subtypes:{},
      subtype_box: $("<ol/>", {"class": STBBCLASS}).hide()};
    return tb;
  };
  this.createSubtypeButton = function (type, subtype) {
    var stb = $("<li/>", {"class": STBCLASS})
      .append(subtype)
      .click(this.subtypeButtonSelect)
      .data("manager", this)
      .data("path_type", type)
      .data("path_subtype", subtype);
    this.typeButtons[type].subtypes[subtype] = stb;
    return stb;
  };
  this.initialize = function () {
    for (var type in structure) {
      $("#type").append(this.createTypeButton(type));
      $("#subtype_boxes").append(this.typeButtons[type].subtype_box);
      for(var subtype in structure[type]) {
        if (subtype == "_default") {
        } else {
          this.typeButtons[type].subtype_box.append(
            this.createSubtypeButton(type, subtype));
        }
        if (typeof structure[type][subtype].div == "function")
          structure[type][subtype].div = structure[type][subtype].div();
      }
    }
    this.select(path[0], path[1]);
  };
};

function timedPrompt(text, timeout) {
  var
    ok,
    of = $(document.activeElement);
    diag = 
      $("<div/>")
        .appendTo($(document))
        .dialog({
          close: function () {
            of.focus();
          }
          })
        .append(
          $("<p/>", {style: "text-align: center;"})
          .append(text))
        .append(
          $("<p/>", {style: "text-align: center;"})
            .append((ok =
              $("<button/>")
                .data("temporaryFocus", true)
                .append("确定")
                .click(
                  function () {
                    $(this).parent().parent().dialog("close").remove()
                  })))),
  ok.focus();
  setTimeout(function () {
    diag.dialog("close").remove();
  }, timeout);
}

function Host(hostList, select) {
  var
    HBCLASS = "host_button",
    HBCCLASS = "host_button_core",
    HBCCLASSX = "host_button_core_selected",
    HBRCLASS = "host_button_remover",
    HBRBCLASS = "host_button_remover_box",
    HABCLASS = "host_add_button",
    HAICLASS = "host_add_input_box";
  var _this = this;
  this.list = {};
  this.addHost = function (id, name, mandatory) {
    $("#host").append(this.createHostButton(id, name, mandatory));
  };
  this.addCustomButton = function () {
    $("#host").append(this.createHostPreparingButton());
  };
  this.addWildButton = function (id, name, mandatory) {
    $("#host").append(this.createWildButton(id, name, mandatory));
  };
  this.customButtonInputBox = $("<input type=\"text\"/>", {"class": HAICLASS})
    .keypress(
      function(event) {
        if (event.keyCode == 13) {
          _this.customButtonCore.click();
        }
      })
    .focusout(
      function () {
        var t = this;
        setTimeout(
          function () {
            if ( document.activeElement != t
              && !$(document.activeElement).data("temporaryFocus")
              && document.activeElement != _this._customButtonCore) {
              $(t).hide(300);
              _this.customButton.data("status", false);
            }
          }, 200);
      })
    .css("display", "inline")
    .hide();
  this.customButtonInputBoxWrap = $("<div/>", {style: "display: inline-block;"})
    .append(this.customButtonInputBox);
  this.customButtonCore = $("<span/>", {"class": HABCLASS})
    .click(
      function () {
        if ($(this).parent().data("status")) {
          $.ajax({
            url: ajaxAddr,
            data: {
              routine: "get_host_info",
              host: _this.customButtonInputBox.val()
            },
            dataType: "json",
            context: $(this).parent().data("manager"),
            success: function (data) {
              if (!data.found) {
                timedPrompt("未找到该组织", 2500);
              } else if (data.id in this.list) {
                timedPrompt("该组织已经添加", 2000);
              } else {
                this.createHostButtonContent(this.customButton.parent(), data.id, data.name, false);
                this.selectHost(data.id);
                this.addCustomButton();
                _this.customButtonInputBox.focus().val("");
              }
            }
          });
        } else {
          _this.customButtonInputBox.show(300,
            function () {
              _this.customButtonInputBox.focus();
            });
          _this.customButton.data("status", true);
        }
      });
  this.customButton = $("<span/>")
    .data("status", false)
    .data("manager", this)
    .append($.browser.mozilla? this.customButtonInputBoxWrap : this.customButtonInputBox)
    .append(this.customButtonCore);
  this.createHostPreparingButton = function () {
    var hpb = $("<li/>", {"class": HBCLASS})
      .append(this.customButton);
    return hpb;
  };
  this.dropHost = function (id) {
    this.list[id].button.hide(300, function () {
      _this.list[id].button.remove();
      delete _this.list[id];
      refreshResult();
    });
  };
  this.selectHost = function (id) {
    if (this.list[id].selected != true) {
      this.list[id].core.toggleClass(HBCCLASS + " " + HBCCLASSX);
    }
    this.list[id].selected = true;
    refreshResult();
  };
  this.deselectHost = function (id) {
    if (this.list[id].selected != false) {
      this.list[id].core.toggleClass(HBCCLASS + " " + HBCCLASSX);
    }
    this.list[id].selected = false;
    refreshResult();
  };
  this.uploadHostList = function () {};
  this.hostButtonCoreClick = function () {
    var
      manager = $(this).data("manager"),
      id = $(this).data("id");
    if (manager.list[id].selected) {
      manager.deselectHost(id);
    } else {
      if (id == "#ALL#") {
        for (var ID in manager.list)
          if (ID != id)
            manager.deselectHost(ID);
      } else {
         manager.deselectHost("#ALL#");
      }
      manager.selectHost(id);
    }
  };
  this.hostButtonIn = function (ev) {
    var
      manager = $(this).data("manager"),
      id = $(this).data("id");
    if (!manager.list[id].mandatory)
      manager.list[id].remover.fadeIn(300);
  }
  this.hostButtonOut = function (ev) {
    var
      manager = $(this).data("manager"),
      id = $(this).data("id");
    if (!manager.list[id].mandatory)
      manager.list[id].remover.fadeOut(300);
  }
  this.hostButtonRemoverClick = function () {
    var
      manager = $(this).data("manager"),
      id = $(this).data("id");
      manager.dropHost(id);
  }
  this.createHostButtonContent = function (hostButton, hostId, hostName, hostMandatory) {
    var
      rm = $("<span/>", {"class": HBRCLASS})
        .data("id", hostId)
        .data("manager", this)
        .click(this.hostButtonRemoverClick)
        .hide(),
      rmBox = $("<span/>", {"class": HBRBCLASS})
        .append(rm),
      hostButtonCore = $("<span/>", {"class": HBCCLASS})
        .data("id", hostId)
        .data("manager", this)
        .append(hostName)
        .click(this.hostButtonCoreClick);
    hostButton
        .data("id", hostId)
        .data("manager", this)
        .append(hostButtonCore)
        .append(rmBox)
        .hover(this.hostButtonIn, this.hostButtonOut);
    this.list[hostId] = {
      core: hostButtonCore,
      button: hostButton,
      name: hostName,
      selected: false,
      mandatory: hostMandatory,
      remover: rm
    };
    return hostButton;
  };
  this.createHostButton = function (hostId, hostName, hostMandatory) {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), hostId, hostName, hostMandatory);
  };
  this.createWildButton = function () {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), "#ALL#", "全部", true);
  };
  this.customButtonInputBox.autocomplete({
    source: ajaxAddr + "?routine=get_host_prompt",
    appendTo: this.customButton
    });
  this.initialize = function () {
    this.addWildButton();
    for (var hostId in hostList) {
      this.addHost(hostId, hostList[hostId][0], hostList[hostId][1]);
    }
    this.addCustomButton();
    for (var item in select) {
      this.selectHost(select);
    }
  };
};

var lastRefresher = null;
function refreshResult(force) {
  var
    query = {hosts: []},
    RTCLASS = "result_title",
    RCCLASS = "result_content",
    RBCLASS = "result_block",
    REFRESHINT = 500;
  if (path.path[0] != null)
    query.type = path.path[0];
  if (path.path[1] != null)
    query.subtype = path.path[1];
  if (typeof path.structure[path.path[0]]._default.getSelector == "function")
    query.typeSelector = path.structure[path.path[0]]._default.getSelector();
  if (typeof path.structure[path.path[0]][path.path[1]] != "undefined"
   && typeof path.structure[path.path[0]][path.path[1]].getSelector == "function")
    query.subtypeSelector = path.structure[path.path[0]][path.path[1]].getSelector();
  for (var item in host.list)
    if (host.list[item].selected)
      query.hosts.push(item);
  if (lastRefresher != null)
    clearTimeout(lastRefresher);
  if (force == true)
    REFRESHINT = 0;
  lastRefresher = setTimeout(
    function () {
      $.ajax({
        url: ajaxAddr,
        dataType: "json",
        cache: false,
        data: {
          routine: "get_result",
          query: query
          },
        success: function (data) {
          $("#result_list_left *, #result_list_right *").remove();
          for(var i in data) {
            var tl, item = data[i];
            if (i < pageSize / 2) {
              tl = $("#result_list_left");
            } else {
              tl = $("#result_list_right");
            }
            $("<div/>", {"class": RBCLASS})
              .append(
                $("<div/>", {"class": RTCLASS})
                  .append(item.title))
              .append(
                $("<div/>", {"class": RCCLASS})
                  .append(item.content))
              .appendTo(tl);
          }
        }
      });
    }, REFRESHINT);
}

function styleCheckboxAndRadio() {
  var
    SSS = "special_styled",
    SSR = "special_styled_radio",
    SSRC = "special_styled_radio_checked",
    SSC = "special_styled_checkbox",
    SSCC = "special_styled_checkbox_checked";
  $("." + SSS + " label").each(
    function () {
      $(this).find(":text")
        .data("label", $(this))
        .click(
          function () {
            $(this).data("label").click();
          })
      updator =
        function () {
          var label = $(this).data("label");
          if ($(this).is(":radio")) {
            var allLabels = $("." + SSS + " label");
            if ($(this).is(":checked")) {
              allLabels.removeClass(SSRC);
              label.addClass(SSRC);
            } else {
              label.removeClass(SSRC);
            }
          } else {
            if ($(this).is(":checked"))
              label.addClass(SSCC);
            else
              label.removeClass(SSCC);
          }
        };
      var b = $("#" + $(this).attr("for"))
        .hide()
        .data("label", $(this))
        .change();
      updator.call(b);
      $(this).click(
        function (event) {
          event.preventDefault();
          b.click();
          updator.call(b);
          b.change();
        });
      if (b.is(":radio"))
        $(this).addClass(SSR);
      else
        $(this).addClass(SSC);
    });
}

function moniterResultRelatedObject() {
  var RRCLASS = "result_related";
  $("." + RRCLASS + " :text, " + "." + RRCLASS + " :radio, " + "." + RRCLASS + " :checkbox")
    .change(refreshResult).change();
};

function collectOptionFor(s) {
  var
    form = $(s),
    result = {};
  form.find(":checked").each(
    function () {
      var nm = $(this).attr("name");
      if (!(nm in result))
        result[nm] = [];
      var val = $(this).val();
      if (val == "__special__")
        val = $('label[for="' + $(this).attr("id") + '"]').find(":text").val();
      result[nm].push(val);
    });
  return result;
};

$(document).ready(function () {
  path.initialize();
  host.initialize();
  styleCheckboxAndRadio();
  moniterResultRelatedObject();
  refreshResult(true);
});

var
  path = new Path(
     {
      "通知": {
        "_default": {},
        "会议": {},
        "工作": {}
        },
      "公告": {
        "_default": {}
        },
      "活动": {
        "_default": {
          getSelector:
            function () {
              return collectOptionFor("#selector_event");
            },
          div: function () {
              return $('#selector_event').hide();
            }},
        "讲座": {
          getSelector:
            function () {
              return collectOptionFor("#selector_event_lecture");
            },
          div: function () {
              return $('#selector_event_lecture').hide();
            }},
        "聚会": {},
        "比赛": {}
        },
      "新闻": {
        "_default": {}
        }
    },
    ["活动", null])
  host = new Host(
    {
      "su": ["学生会", true],
      "college": ["学院", true],
      "asso": ["社团", true],
      "asso/test": ["测试社团", false]
    },
    ["su"]),
  range = [0, 10],
  pageSize = 5;


