<?php
set_include_path($_SERVER['DOCUMENT_ROOT'] . '/phplib' . PATH_SEPARATOR . get_include_path());
require_once 'config.php';
require_once 'post.php';

$activity_db = new PDO($DSN['activity']);
$assnact_src = activity_query($activity_db, array('host' => 'assn', 'pagesize' => 5, 'offset' => 0));
$suact_src = activity_query($activity_db, array('host' => 'su', 'pagesize' => 5, 'offset' => 0));
unset($activity_db);

$announcement_db = new PDO($DSN['announcement']);
$post_src = announcement_query($announcement_db, array('category' => '公告', 'pagesize' => 5, 'offset' => 0));
$news_src = announcement_query($announcement_db, array('category' => '新闻', 'pagesize' => 5, 'offset' => 0));
unset($announcement_db);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>复旦大学学生会</title>
		<link type="text/css" href="/jquery/css/default/jquery-ui.css" rel="Stylesheet" />
		<script type="text/javascript" src="/jquery/js/jquery.js"></script>
		<script type="text/javascript" src="/jquery/js/jquery-ui.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/framework.css" />
		<script type="text/javascript" src="/js/framework.js"></script>

		<link rel="stylesheet" type="text/css" href="/css/index.css" />
		<script type="text/javascript" src="/js/index.js"></script>
	</head>
	<body>
		<div class="pav" style="background-image: url(/campstar-2013.jpg); cursor: pointer" onclick="javascript: window.location = '/misc/campstar-2013/'"></div>
		<div id="kjfw">
			<div class="button-center-ref">
				<div class="button-center"></div>
			</div>
			<div class="button-rt"></div>
			<div class="button-rb"></div>
			<div class="button-lt"></div>
			<div class="button-lb"></div>
		</div>
		<div class="clearer"></div>
		<div id="tzygs">
			<div class="title">
				<a>通知与告示</a>
				<div class="hr"></div>
				<div class="clearer"></div>
			</div>
			<ul>
<?php foreach($post_src as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
			</ul>
			<div class="more">
				<a href="/announcement.php?category=%E5%85%AC%E5%91%8A">更多</a>
			</div>
			<div class="clearer"></div>
		</div>
		<div id="sthd">
			<div class="title">
				<a>社团活动</a>
				<div class="hr"></div>
				<div class="clearer"></div>
			</div>
			<ul>
<?php foreach($assnact_src as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
			</ul>
			<div class="more">
				<a href="/activity.php?host=assn">更多</a>
			</div>
			<div class="clearer"></div>
		</div>
		<div class="clearer"></div>
		<div id="xwzx">
			<div class="title">
				<a>新闻中心</a>
				<div class="hr"></div>
				<div class="clearer"></div>
			</div>
			<ul>
<?php foreach($news_src as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
			</ul>
			<div class="more">
				<a href="/announcement.php?category=%E6%96%B0%E9%97%BB">更多</a>
			</div>
			<div class="clearer"></div>
		</div>
		<div id="xshhd">
			<div class="title">
				<a>学生会活动</a>
				<div class="hr"></div>
				<div class="clearer"></div>
			</div>
			<ul>
<?php foreach($suact_src as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
			</ul>
			<div class="more">
				<a href="/activity.php?host=su">更多</a>
			</div>
			<div class="clearer"></div>
		</div>
		<div class="clearer"></div>
	</body>
</html>
