/** @const */
var ajaxAddr = "view_ajax.php";
/** @const */
var announcementServiceAjaxAddr = "/system/announcement_service";

var Path;
(function () {
  "use strict";
  var
    /** @const */
    TBCLASS = "type_button",
    /** @const */
    STBCLASS = "subtype_button",
    /** @const */
    STBBCLASS = "subtype_box",
    /** @const */
    TBCLASSX = "type_button_selected",
    /** @const */
    STBCLASSX = "subtype_button_selected",
    /** @const */
    SELECTOR_DELAY = 200;

  /**
   * @constructor
   */
  Path = function (structure, path) {
    this.typeButtons = {};
    this.structure = structure;
    this.path = [null, null];

    for (var type in this.structure) {
      $("#type").append(this.createTypeButton(type));
      $("#subtype_boxes").append(this.typeButtons[type].subtype_box);
      for(var subtype in this.structure[type]) {
        if (subtype == "_default") {
        } else {
          this.typeButtons[type].subtype_box.append(
            this.createSubtypeButton(type, subtype));
        }
        if (typeof this.structure[type][subtype].div == "function")
          this.structure[type][subtype].div = this.structure[type][subtype].div();
      }
    }
    this.select(path[0], path[1]);
  };

  Path.prototype.toggleTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
  };
  Path.prototype.selectTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
    this.typeButtons[type].subtype_box.fadeIn(500);
    if (typeof this.structure[type]._default.div != "undefined")
      this.structure[type]._default.div.show(SELECTOR_DELAY);
  };
  Path.prototype.deselectTypeButton = function (type) {
    this.typeButtons[type].button
      .toggleClass(TBCLASS + " " + TBCLASSX);
    this.typeButtons[type].subtype_box.fadeOut(500);
    if (typeof this.structure[type]._default.div != "undefined")
      this.structure[type]._default.div.hide(SELECTOR_DELAY);
  };
  Path.prototype.deselectSubtypeButton = function (type, subtype) {
    this.typeButtons[type].subtypes[subtype]
      .toggleClass(STBCLASS + " " + STBCLASSX);
    if (typeof this.structure[type][subtype].div != "undefined")
      this.structure[type][subtype].div.hide(SELECTOR_DELAY);
  };
  Path.prototype.selectSubtypeButton = function (type, subtype) {
    this.typeButtons[type].subtypes[subtype]
      .toggleClass(STBCLASS + " " + STBCLASSX);
    if (typeof this.structure[type][subtype].div != "undefined")
      this.structure[type][subtype].div.show(SELECTOR_DELAY);
  };
  Path.prototype.select = function (type, subtype) {
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
  Path.prototype.typeButtonSelect = function () {
    $(this).data("manager").select($(this).data("path_type"), null);
  };
  Path.prototype.subtypeButtonSelect = function () {
    $(this).data("manager").select($(this).data("path_type"), $(this).data("path_subtype"));
  };
  Path.prototype.createTypeButton = function (type) {
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
  Path.prototype.createSubtypeButton = function (type, subtype) {
    var stb = $("<li/>", {"class": STBCLASS})
      .append(subtype)
      .click(this.subtypeButtonSelect)
      .data("manager", this)
      .data("path_type", type)
      .data("path_subtype", subtype);
    this.typeButtons[type].subtypes[subtype] = stb;
    return stb;
  };
})();

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


var Host;
(function () {
  "use strict";
  var
    /** @const */
    HBCLASS = "host_button",
    /** @const */
    HBPCLASS = "host_button_preparing",
    /** @const */
    HBCCLASS = "host_button_core",
    /** @const */
    HBCCLASSX = "host_button_core_selected",
    /** @const */
    HBRCLASS = "ui-icon ui-icon-close",
    /** @const */
    HBRBCLASS = "host_button_remover_box",
    /** @const */
    HACCLASS = "host_add_container",
    /** @const */
    HABCLASS = "host_add_button",
    /** @const */
    HAICLASS = "host_add_input_box";
  /**
   * @constructor
   */
  Host = function Host(hostList, select) {
    var _this = this;
    this.list = {};
    this.select = null;
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

    this.addWildButton();
    for (var hostId in hostList) {
      this.addHost(hostId, hostList[hostId][0], hostList[hostId][1]);
    }
    this.addCustomButton();
    for (var item in select) {
      this.selectHost(select[item]);
    }
  };
  
  Host.prototype.addHost = function (id, name, mandatory) {
    $("#host").append(this.createHostButton(id, name, mandatory));
  };
  Host.prototype.moveCustomButton = function () {
    this.customButton.offset(function () {
        var
          r = $("." + HBPCLASS).prev(),
          o = r.offset();
          o.left += r.width();
          return o;
      });
  }
  Host.prototype.addCustomButton = function () {
    $("." + HBPCLASS).removeClass(HBPCLASS);
    $("#host").append($("<li/>").addClass(HBPCLASS).addClass(HBCLASS));
    $("." + HBPCLASS).append(this.customButton);
    this.moveCustomButton();
  };
  Host.prototype.addWildButton = function (id, name, mandatory) {
    $("#host").append(this.createWildButton(id, name, mandatory));
  };
  Host.prototype.dropHost = function (id) {
    var _this = this;
    this.list[id].button.hide(300, function () {
      _this.list[id].button.remove();
      delete _this.list[id];
      refreshResult();
      _this.moveCustomButton();
    });
  };
  Host.prototype.selectHost = function (id) {
    if (this.list[id].selected != true) {
      this.list[id].core.toggleClass(HBCCLASS + " " + HBCCLASSX);
    }
    this.list[id].selected = true;
    refreshResult();
  };
  Host.prototype.deselectHost = function (id) {
    if (this.list[id].selected != false) {
      this.list[id].core.toggleClass(HBCCLASS + " " + HBCCLASSX);
    }
    this.list[id].selected = false;
    refreshResult();
  };
  Host.prototype.createHostButtonContent = function (hostButton, hostId, hostName, hostMandatory) {
    var _this = this;
    var hostButtonIn = function (ev) {
      var
        id = $(this).data("id");
      if (!_this.list[id].mandatory)
        _this.list[id].remover.fadeIn(300);
    };
    var hostButtonOut = function (ev) {
      var
        id = $(this).data("id");
      if (!_this.list[id].mandatory)
        _this.list[id].remover.fadeOut(300);
    };
    var hostButtonCoreClick = function () {
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
    var hostButtonRemoverClick = function () {
      var
        id = $(this).data("id");
        _this.dropHost(id);
    }

    var
      rm = $("<span/>", {"class": HBRCLASS})
        .data("id", hostId)
        .click(hostButtonRemoverClick)
        .hide(),
      rmBox = $("<span/>", {"class": HBRBCLASS})
        .append(rm),
      hostButtonCore = $("<span/>", {"class": HBCCLASS})
        .data("id", hostId)
        .append(hostName)
        .click(hostButtonCoreClick);

    hostButton
        .data("id", hostId)
        .append(hostButtonCore)
        .append(rmBox)
        .hover(hostButtonIn, hostButtonOut);
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
  Host.prototype.createHostButton = function (hostId, hostName, hostMandatory) {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), hostId, hostName, hostMandatory);
  };
  Host.prototype.createWildButton = function () {
    return this.createHostButtonContent($("<li/>", {"class": HBCLASS}), "#ALL#", "全部", true);
  };
})();

var lastRefresher = null,
 queryFrom = 0,
 querySize = 20;
function refreshResult(force) {
  if (typeof path === 'undefined'
   || typeof host === 'undefined')
    return;
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

var path, host;
function setup(structure_of_selector, default_path_of_selector, default_host_list, default_selected_host) {
  $(document).ready(function () {
    path = new Path(structure_of_selector, default_path_of_selector);
    host = new Host(default_host_list, default_selected_host);
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
}


