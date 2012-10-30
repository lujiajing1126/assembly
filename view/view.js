var ajaxAddr = "view_ajax.php";
var announcementServiceAjaxAddr = "/system/announcement_service";

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
    HBPCLASS = "host_button_preparing",
    HBCCLASS = "host_button_core",
    HBCCLASSX = "host_button_core_selected",
    HBRCLASS = "ui-icon ui-icon-close",
    HBRBCLASS = "host_button_remover_box",
    HACCLASS = "host_add_container",
    HABCLASS = "host_add_button",
    HAICLASS = "host_add_input_box";
  var _this = this;
  this.list = {};
  this.addHost = function (id, name, mandatory) {
    $("#host").append(this.createHostButton(id, name, mandatory));
  };
  this.moveCustomButton = function () {
    this.customButton.offset(function () {
        var
          r = $("." + HBPCLASS).prev(),
          o = r.offset();
          o.left += r.width();
          return o;
      });
  }
  this.addCustomButton = function () {
    $("." + HBPCLASS).removeClass(HBPCLASS);
    $("#host").append($("<li/>").addClass(HBPCLASS).addClass(HBCLASS));
    $("." + HBPCLASS).append(_this.customButton);
    this.moveCustomButton();
  };
  this.addWildButton = function (id, name, mandatory) {
    $("#host").append(this.createWildButton(id, name, mandatory));
  };
  var customButtonStatus = false;
  this.customButtonInputBox = $("<input type=\"text\"/>")
    .addClass(HAICLASS)
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
              _this.customButtonCore.trigger("expandmode");
              customButtonStatus = false;
              _this.customButtonInputWidget.hide(300);
            }
          }, 200);
      })
  this.customButtonInputWidget = $("<div/>")
    .addClass("ui-widget")
    .append(this.customButtonInputBox)
    .hide();
  this.customButtonInputBox.autocomplete({
      appendTo: this.customButtonInputWidget,
      source: ajaxAddr + "?routine=get_host_prompt"
    });
  this.customButtonCore = $("<div/>", {"class": HABCLASS})
    .click(
      function () {
        if (customButtonStatus) {
          $.ajax({
            url: ajaxAddr,
            data: {
              routine: "get_host_info",
              host: _this.customButtonInputBox.val()
            },
            dataType: "json",
            context: _this,
            success: function (data) {
              if (!data.found) {
                timedPrompt("未找到该组织", 2500);
              } else if (data.id in this.list) {
                timedPrompt("该组织已经添加", 2000);
              } else {
                this.createHostButtonContent($("." + HBPCLASS), data.id, data.name, false);
                this.selectHost(data.id);
                this.addCustomButton();
                this.customButtonInputBox.focus().val("");
              }
            }
          });
        } else {
          $(this).trigger("entermode");
          _this.customButtonInputWidget.show(300,
            function () {
              _this.customButtonInputBox.focus();
            });
          customButtonStatus = true;
        }
      });
  this.customButton = $("<table/>", {style: "float: left; display: inline-block;"})
    .addClass(HACCLASS)
    .append(
      $("<tr/>")
        .append($("<td/>").append(this.customButtonInputWidget))
        .append($("<td/>").append(this.customButtonCore)));
  this.dropHost = function (id) {
    this.list[id].button.hide(300, function () {
      _this.list[id].button.remove();
      delete _this.list[id];
      refreshResult();
      _this.moveCustomButton();
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
      id = $(this).data("id");
    if (_this.list[id].selected) {
      _this.deselectHost(id);
    } else {
      if (id == "#ALL#") {
        for (var ID in _this.list)
          if (ID != id)
            _this.deselectHost(ID);
      } else {
         _this.deselectHost("#ALL#");
      }
      _this.selectHost(id);
    }
  };
  this.hostButtonIn = function (ev) {
    var
      id = $(this).data("id");
    if (!_this.list[id].mandatory)
      _this.list[id].remover.fadeIn(300);
  }
  this.hostButtonOut = function (ev) {
    var
      id = $(this).data("id");
    if (!_this.list[id].mandatory)
      _this.list[id].remover.fadeOut(300);
  }
  this.hostButtonRemoverClick = function () {
    var
      id = $(this).data("id");
      _this.dropHost(id);
  }
  this.createHostButtonContent = function (hostButton, hostId, hostName, hostMandatory) {
    var
      rm = $("<span/>", {"class": HBRCLASS})
        .data("id", hostId)
        .click(this.hostButtonRemoverClick)
        .hide(),
      rmBox = $("<span/>", {"class": HBRBCLASS})
        .append(rm),
      hostButtonCore = $("<span/>", {"class": HBCCLASS})
        .data("id", hostId)
        .append(hostName)
        .click(this.hostButtonCoreClick);
    hostButton
        .data("id", hostId)
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
    this.moveCustomButton();
    return hostButton;
  };
  this.createHostButton = function (hostId, hostName, hostMandatory) {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), hostId, hostName, hostMandatory);
  };
  this.createWildButton = function () {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), "#ALL#", "全部", true);
  };
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

var lastRefresher = null,
 queryFrom = 0,
 querySize = 20;
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
  query.from = queryFrom;
  query.size = querySize;
  if (lastRefresher != null)
    clearTimeout(lastRefresher);
  if (force == true)
    REFRESHINT = 0;
  lastRefresher = setTimeout(
    function () {
      $.ajax({
        url: announcementServiceAjaxAddr,
        dataType: "json",
        cache: false,
        data: {
          routine: "get_result",
          query: JSON.stringify(query)
          },
        success: function (data) {
          var result = $("#result");
          result.contents().remove();
          for(var i in data) {
            (function (item) {
              $("<div/>", {"class": RBCLASS})
                .append(
                  $("<div/>", {"class": RTCLASS})
                    .append(item.title.length > 38? item.title.substr(0, 35) + "……" : item.title))
                .append(
                  $("<div/>", {"class": RCCLASS})
                    .append(item.abs.length > 58? item.abs.substr(0, 55) + "……" : item.abs))
                .click(function () {
                    window.open("/e" + item.id);
                  })
                .appendTo(result);
            }) (data[i]);
          }
          host.moveCustomButton();
        }
      });
    }, REFRESHINT);
}

function styleCheckboxAndRadio() {
  var
    SSS = "special_styled";
  $("." + SSS).find("li").buttonset();
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
  $(".host_add_button").bind("expandmode",
    function () {
      var b = $(this);
      b.find("*").fadeOut(300,
        function () {
          $(this).remove();
        });
      b.append($("<div/>", {"class": "ui-icon ui-icon-circle-plus"}).hide().fadeIn(300))
    }).trigger("expandmode");
  $(".host_add_button").bind("entermode",
    function () {
      var b = $(this);
      b.find("*").fadeOut(300,
        function () {
          $(this).remove();
        });
      b.append($("<div/>", {"class": "ui-icon ui-icon-circle-check"}).hide().fadeIn(300));
    });
  styleCheckboxAndRadio();
  moniterResultRelatedObject();
  refreshResult(true);
});


