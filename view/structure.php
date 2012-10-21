{
      "通知": {
        "_default": {},
        "会议": {},
        "工作": {}
        },
      "告示": {
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
    }
