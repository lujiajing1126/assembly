<?php
use PFBC\Form;
use PFBC\Element;
use PFBC\Validation;

set_include_path($_SERVER['DOCUMENT_ROOT'] . '/phplib' . PATH_SEPARATOR . get_include_path());
require_once 'config.php';
require_once 'siteauth.php';
require_once 'PFBC/Form.php';

$login_data = get_login_data();
if ($login_data && $login_data->level === 'SITE_SESSION') {
	$user = $login_data->user_id;
} else {
	render_error("尚未登录");
}

$available_organizations = array();

foreach (get_object_vars(get_info_of_organizations(represented_organizations($user, SITEAUTH_GROUP_ANNOUNCER))) as $orgid => $orgprof) {
	$available_organizations[$orgid] = $orgprof->full_name;
}

if (! count($available_organizations)) {
	render_error("您不具有发布权限（只有当您为某一组织“[发布组]”成员时方可发布信息）");
}

$availcat = array("公告", "新闻");

session_start();

if(isset($_POST["form"]) && $_POST["form"] === 'create') {
	if(Form::isValid('create')) {
		$pdo = new PDO($DSN['announcement']);

		// get data from $_POST
		$data = array_intersect_key($_POST, array(
			"name" => 0,
			"abstract" => 0,
			"url" => 0,
			"time" => 0,
			"series" => 0,
			"host" => 0,
			"category" => 0
		));
		$data = array_filter($data, function ($val) {return !empty($val);});

		// adjust format
		if (isset($data['time'])) {
			$data['time'] = $data['time'] . ' +8';
		} else {
			$data['time'] = "now";
		}

		$data['hidden'] = "false";

		// set arbitory data
		$data['signature'] = $user;
		$data['timestamp'] = "now";

		$stmt = $pdo->prepare("INSERT INTO announcement ("
			. implode(",", array_map(function ($k) {return "\"$k\"";}, array_keys($data)))
			. ") VALUES ("
			. implode(",", array_map(function ($k) {return ":$k";}, array_keys($data)))
			. ")");
		if ($stmt === FALSE)
			render_error("数据库错误！");
		if ($stmt->execute($data) === FALSE)
			render_error("数据库错误！");
		header("Location: /announcement.php", 302);
	}
}

$form = new Form("create", array("prevent" => array('jquery')));

$form->addElement(new Element\HTML('<legend>创建布告</legend>'));
$form->addElement(new Element\Hidden("form", "create"));
$form->addElement(new Element\Textbox("标题:", "name", array(
		"required" => 1
)));
$form->addElement(new Element\Textarea("摘要:", "abstract"));
$form->addElement(new Element\Url("详情页面地址:","url",array(
		"required" => 1
)));
$form->addElement(new Element\BootstrapDateTime("时间:", "time", array("language" => "zh-CN")));
$form->addElement(new Element\Radio("类型:", "category", $availcat, array(
		"value" => $availcat[0],
		"required" => 1,
		"limited" => 1
)));
$form->addElement(new Element\Textarea("系列:", "series"));
$form->addElement(new Element\Select("发布机构:", "host", $available_organizations, array(
		"required" => 1,
		"limited" => 1
)));
$form->addElement(new Element\Button("发布"));
$form->addElement(new Element\Button("取消", "button", array(
		"onclick" => "history.go(-1);"
)));

render(function () use ($form) {$form->render();});

function render($content) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html" charset="utf-8" />
		<title>布告发布 - 复旦大学学生会</title>
		<script type="text/javascript" src="/jquery/js/jquery.js"></script>

		<link rel="stylesheet" type="text/css" href="/css/framework.css" />
		<script type="text/javascript" src="/js/framework.js"></script>
	</head>
	<body>
<?php
$content();
?>
	</body>
</html>
<?php
}

function render_error($msg) {
	render(function () use ($msg) {
		echo htmlentities($msg);
		?><a href="javascript:history.go(-1);">返回</a><?php
	});
	exit;
}
