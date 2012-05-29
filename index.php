<html>
<head>
<title>有的地方还没做好，建议用chrome或者IE9.0浏览</title>
<link rel="stylesheet" type="text/css" href="css/default.css" />
<link rel="stylesheet" type="text/css" href="css/<?php
if($_GET[mod]!=Null)  {
echo $_GET[mod];
}
else
echo "index";
?>
.css" />
</head>
<body>
<div class="box">
<div class="banner">
<img src="images/topV1.png"/>
</div>
<div class="nav">
<?php
require_once "includes/nav.php";
?>
</div>
<div class="box2">
<?php
if($_GET[mod]!=Null)  {
include_once "includes/$_GET[mod].php";
}
else
include_once "includes/index.php";
?>
</div>
<div class="link">
<div id="cLink">
<a id="link">校内链接:</a><a class="link" href="Http://www.library.fudan.edu.cn">图书馆</a>&nbsp;<a class="link" href="Http://bbs.fudan.edu.cn">BBS</a>&nbsp;<a class="link" href="Http://mail.fudan.edu.cn">邮箱</a>&nbsp;&nbsp;
</div>
</div>

<div class="contact">
<a id="contact" href="emailto:lujiajing1126@163.com">联系我们</a>
</div>
</div>
</body>
</html>