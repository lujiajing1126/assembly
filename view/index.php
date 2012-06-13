<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <link type="text/css" href="/jquery/css/default/jquery-ui.css" rel="Stylesheet" />
    <script type="text/javascript" src="/jquery/js/jquery.js"></script>
    <script type="text/javascript" src="/jquery/js/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/framework.css" />
    <script type="text/javascript" src="/js/framework.js"></script>

    <link type="text/css" href="view.css" rel="Stylesheet" />
    <script type="text/javascript" src="view.js"></script>
    <title>查看 - 复旦大学学生会</title>

    <script type="text/javascript">
var structure = <?php include("structure.php"); ?>;

var
  path = new Path(
      structure,
<?php
	switch ($_GET["type"]) {
	case "news":
		?>["新闻", null]<?php
		break;
	case "activity":
	default:
		?>["活动", null]<?php
		break;
	case "announce":
	default:
		?>["公告", null]<?php
		break;
	}
?>
    ),
  host = new Host(
    {
      "su": ["学生会", true],
      "college": ["学院", true],
      "asso": ["社团", true],
      "asso/test": ["测试社团", false]
    },
    [<?php echo isset($_GET["host"])? $_GET["host"] : '"#ALL#"'; ?>]),
  range = [0, 10],
  pageSize = 5;

    </script>
  </head>
  <body>
    <div>
      <div id="header"></div>
      <div id="lead"></div>
      <div id="content">
        <div id="type_box">
          <div id="prompt_type">类型<div class="hr"></div></div>
          <div class="clearer"></div>
          <ol id="type"></ol>
          <div id="subtype_boxes"></div>
          <div id="selector_box">
            <div id="selector_box_upper">
              <div id="selector_event" class="special_styled result_related">
                <form>
                  <ul>
                    <li>时间范围：
                      <input type="radio" name="timerange" id="_event_timerange_all" checked="checked" value="all"/>
                        <label for="_event_timerange_all">不限</label>
                      <input type="radio" name="timerange" id="_event_timerange_7" value="week"/>
                        <label for="_event_timerange_7">一周</label>
                      <input type="radio" name="timerange" id="_event_timerange__special" value="__special__"/>
                        <label for="_event_timerange__special">
                          <input type="text"/> 天内
                        </label>
                    </li>
                    <li>时间：
                      <input type="checkbox" name="day" id="_event_day_sun" checked="checked" value="0"/><label for="_event_day_sun">周日</label>
                      <input type="checkbox" name="day" id="_event_day_mon" checked="checked" value="1"/><label for="_event_day_mon">周一</label>
                      <input type="checkbox" name="day" id="_event_day_tue" checked="checked" value="2"/><label for="_event_day_tue">周二</label>
                      <input type="checkbox" name="day" id="_event_day_wed" checked="checked" value="3"/><label for="_event_day_wed">周三</label>
                      <input type="checkbox" name="day" id="_event_day_thu" checked="checked" value="4"/><label for="_event_day_thu">周四</label>
                      <input type="checkbox" name="day" id="_event_day_fri" checked="checked" value="5"/><label for="_event_day_fri">周五</label>
                      <input type="checkbox" name="day" id="_event_day_sat" checked="checked" value="6"/><label for="_event_day_sat">周六</label>
                    </li>
                  </ul>
                <form>
              </div>
            </div>
            <div id="selector_box_lower">
              <div id="selector_event_lecture" class="special_styled result_related">
                <form>
                  <ul>
                    <li>系列：
                      <input type="checkbox" name="series" id="_event_teacher_a" checked="checked" value="名企讲堂"/><label for="_event_teacher_a">名企讲堂</label>
                      <input type="checkbox" name="series" id="_event_teacher_b" checked="checked" value="星空讲堂"/><label for="_event_teacher_b">星空讲堂</label>
                      <input type="checkbox" name="series" id="_event_teacher__special" value="__special__"/>
                        <label for="_event_teacher__special">
                          <input type="text"/>
                        </label>
                    </li>
                  </ul>
                <form>
              </div>
              </div>
            </div>
          </div>
          <div class="clearer"></div>
          <div id="host_box">
            <div id="prompt_host">主办方<div class="hr"></div></div>
            <div class="clearer"></div>
              <ol id="host"></ol>
          </div>
          <div id="result_box">
            <div id="result_pref"></div>
            <div id="result">
              <div id="result_list_left"></div>
              <div id="result_list_right"></div>
            </div>
            <div class="clearer"/>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
