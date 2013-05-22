<?php
set_include_path($_SERVER['DOCUMENT_ROOT'] . '/phplib' . PATH_SEPARATOR . get_include_path());
require_once 'config.php';
require_once 'siteauth.php';
require_once 'post.php';
require_once 'completion.php';

$query = request_to_announcement_query();
if (! empty($query['host'])) {
	list($query['host'], ) = probe_organization_id($query['host']);
}
$source = announcement_query(new PDO($DSN['activity']), $query);

function render_item ($item, $orginfo) {
?>
	<div class="announcement-item" onclick="javascript: window.open('<?php echo htmlentities($item["url"]);?>', '_blank')">
		<div class="announcement-inner">
			<div class="announcement-description">
				<div class="announcement-name">
					<strong><?php echo htmlentities($item["name"]);?></strong><br/>
				</div>
				<div class="announcement-abstract">
					<?php echo htmlentities($item["abstract"]);?><br/>
				</div>
				<div class="announcement-info">
					<div>发布方：<?php $host = $item["host"]; echo htmlentities(isset($orginfo->$host)? $orginfo->$host->full_name : $item["host"]);?></div>
					<div>发布时间：<?php echo htmlentities($item["time"]);?></div>
				</div>
			</div>
		</div>
	</div>
<?php
}

function DoString($offset,$pageSize,$pageCount,$url) {
	$pageString = null;
	$page = floor($offset / $pageSize)+1;
	if( $page == 1 ){
		$pageString .= '首页|上一页|';
	}
	else{
		$pageString .= '<a href='.$url.'&offset=0>第一页</a>|<a href='.$url.'&offset='.($page-2)*$pageSize.'>上一页</a>|';
	}
	if( ($page == $pageCount) || ($pageCount == 0) ){
		$pageString .= '下一页|尾页';
	}
	else{
		$pageString .= '<a href='.$url.'&offset='.($page)*$pageSize.'>下一页</a>|<a href='.$url.'&offset='.($pageCount-1)*$pageSize.'>尾页</a>';
	}
	return $pageString;
}

function ArrUrl($para1,$para2,$para3,$para4,$para5,$para6,$para7)  {
	$url = "?name=".$para1."&location=".$para2."&host=".$para3."&series=".$para4."&category=".$para5."&time=".$para6."&pagesize=".$para7;
	return $url;
}

function render_textbox ($name) {
	?><input type="text" name="<?php echo $name;?>" value="<?php echo isset($_GET[$name])? $_GET[$name] : "";?>"/><?php
}

function render_option ($name, $value, $label) {
	?><option value="<?php echo $value; ?>" <?php if (isset($_GET[$name]) && $_GET[$name] === $value) echo "selected"; ?>><?php echo $label; ?></option><?php
}

?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>活动信息 - 复旦大学学生会</title>
		<script type="text/javascript" src="jquery/js/jquery.js"></script>
		<link rel="stylesheet" type="text/css" href="css/framework.css" />
		<link rel="stylesheet" type="text/css" href="css/announcement.css" />
		<script type="text/javascript" src="js/framework.js"></script>
	</head>
	<body>
		<form method="GET">
			名称：<?php render_textbox("name"); ?>
			地点：<?php render_textbox("location"); ?>
			发布方：<?php render_textbox("host"); ?>
			系列：<?php render_textbox("series"); ?>
			类型：
				<select name="category">
					<option value="">所有</option>
					<?php render_option("category", "公告", "公示"); ?>
					<?php render_option("category", "新闻", "新闻"); ?>
				</select>
			<input type="submit" value="检索" />
		</form>
		<div>
<?php
if ($source !== false) {
	$page_count = ceil($source['count'] / $source['pagesize']);
?>
			第<?php echo floor($source['offset'] / $source['pagesize']) + 1?>页 共<?php echo ceil($page_count)?>页 检索到<?php echo $source['count']?>条活动
<?php 
	$orginfo = get_info_of_organizations(array_filter(array_unique(array_map(function ($rec) { return $rec['host']; }, $source['data']))));
	foreach ($source['data'] as $item) {
		render_item($item, $orginfo);
	}

	echo DoString($source['offset'],$source['pagesize'],$page_count,ArrUrl(@$_GET['name'],@$_GET['location'], @$_GET['host'], @$_GET['series'], @$_GET['category'], @$_GET['time'],@$_GET['pagesize']));
} else {
?>
			系统错误
<?php
}
?>
		</div>
	</body>
</html>
