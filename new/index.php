<?php
//set_include_path($_SERVER['DOCUMENT_ROOT'] . '/phplib' . PATH_SEPARATOR . get_include_path());
require_once '../phplib/config.php';
require_once '../phplib/post.php';
require_once '../phplib/siteauth.php';


$toplistactivity=array();
$toplistannouncement=array();

$activity_db = new PDO($DSN['activity']);
$assnact_src = activity_query($activity_db, array('host' => 'assn', 'pagesize' => 5, 'offset' => 0));
$suact_src = activity_query($activity_db, array('host' => 'su', 'pagesize' => 5, 'offset' => 0));

$assnact_srcq = activity_query($activity_db, array('host' => 'assn', 'pagesize' => 100, 'offset' => 0));
$suact_srcq = activity_query($activity_db, array('host' => 'su', 'pagesize' => 100, 'offset' => 0));

foreach($assnact_srcq['data'] as $item){
	if( strlen($item['introduction'])>0&&strlen($item['introduction'])<600&&strlen($item['image_url'])>0&&strlen($item['name'])>0&&strlen($item['name'])<60)
		array_push($toplistactivity,$item);
	else if(strlen($item['introduction'])==0&&strlen($item['image_url'])>0&&strlen($item['name'])>0&&strlen($item['name'])<60){
		$item['introduction']="暂缺";
		array_push($toplistactivity,$item);
	}
}
foreach($suact_srcq['data'] as $item){
	if( strlen($item['introduction'])>0&&strlen($item['introduction'])<600&&strlen($item['image_url'])>0&&strlen($item['name'])>0&&strlen($item['name'])<60)
		array_push($toplistactivity,$item);
	else if(strlen($item['introduction'])==0&&strlen($item['image_url'])>0&&strlen($item['name'])>0&&strlen($item['name'])<60){
		$item['introduction']="暂缺";
		array_push($toplistactivity,$item);
	}
}
unset($activity_db);

$announcement_db = new PDO($DSN['announcement']);
$post_src = announcement_query($announcement_db, array('category' => '公告', 'pagesize' => 5, 'offset' => 0));
$news_src = announcement_query($announcement_db, array('category' => '新闻', 'pagesize' => 5, 'offset' => 0));

$post_srca = announcement_query($announcement_db, array('category' => '公告', 'pagesize' => 100, 'offset' => 0));
$news_srca = announcement_query($announcement_db, array('category' => '新闻', 'pagesize' => 100, 'offset' => 0));

foreach($post_srca['data'] as $item){
	if( strlen($item['abstract'])>0&&strlen($item['abstract'])<600&&strlen($item['name'])>0&&strlen($item['name'])<60)
		array_push($toplistannouncement,$item);
	else if(strlen($item['abstract'])==0&&strlen($item['name'])>0&&strlen($item['name'])<60){
		$item['abstract']="暂缺";
		array_push($toplistannouncement,$item);
	}
		
}

foreach($news_srca['data'] as $item){
	if( strlen($item['abstract'])>0&&strlen($item['abstract'])<600&&strlen($item['name'])>0&&strlen($item['name'])<60)
		array_push($toplistannouncement,$item);
	else if(strlen($item['abstract'])==0&&strlen($item['name'])>0&&strlen($item['name'])<60){
		$item['abstract']="暂缺";
		array_push($toplistannouncement,$item);
	}
}
unset($announcement_db);
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="zh-CN"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="zh-CN"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="zh-CN"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="zh-CN">
	<!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>复旦大学学生会</title>
		<meta name="description" content="">

		<!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/bootstrap-theme.min.css" />
		
		
		<script src="js/vendor/modernizr-2.6.2.min.js"></script>

		<link rel="stylesheet" href="css/index.css" />
		<link rel="shortcut icon" href="../favicon.ico">
		<link rel="stylesheet" type="text/css" href="fd_su/style.css" />
		<link rel="stylesheet" type="text/css" href="css/style.css" />
		<link rel="stylesheet" type="text/css" href="css/jquery.jscrollpane.css" media="all" />
	</head>
	<body>
		<!--[if lt IE 7]>
		<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->

		<!-- Add your site or application content here -->

		<!-- header -->

		<div class="container">
			<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">Su.FD</a>
				</div>

				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="nav-bar-collapse-1">
					<ul class="nav navbar-nav">
						<li class="active">
							<a href="index.html">首页</a>
						</li>
						<li>
							<a href="post.html">新闻中心</a>
						</li>
						<li>
							<a href="post2.html">校会简介</a>
						</li>
						<li>
							<a href="post3.html">资源文档</a>
						</li>
						<li>
							<a href="assn.html">社团在线</a>
						</li>
						<li>
							<a href="activity.html">品牌活动</a>
						</li>
					</ul>
					<!-- <form class="navbar-form navbar-left" role="search">
					<div class="form-group">
					<input type="text" class="form-control" placeholder="Search">
					</div>
					<button type="submit" class="btn btn-default">
					Submit
					</button>
					</form> -->
					<ul class="nav navbar-nav navbar-right">
						<li>
							<a href="#">RSS</a>
						</li>
					
  						<li class="dropdown">
							<a data-toggle="dropdown" href="#">用户操作 <b class="caret"></b></a>
							<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
								<?php
								
								function curPageURL() 
								{
									$pageURL = 'http';
									if ($_SERVER["HTTPS"] == "on") 
									{
										$pageURL .= "s";
									}
									$pageURL .= "://";
								
									if ($_SERVER["SERVER_PORT"] != "80") 
									{
										$pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
									} 
									else 
									{
										$pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
									}
									return $pageURL;
								}

								if(get_login_data()){
								echo '
								<li>
									<a href="http://su.fudan.edu.cn/system/home">办公页面</a>
								</li>
								<li>
									<a href="http://su.fudan.edu.cn/system/user">个人设置</a>
								</li>
								<li class="divider"></li>
								<li>
									<a href="http://su.fudan.edu.cn/system/login?logout=site">登出</a>
								</li>';
								}
								else
								{
								echo '
								
								<li>
									<a href="http://su.fudan.edu.cn/system/login?continue='.urlencode(curPageURL()).'">请登录</a>
								</li>';
								}
								?>
							</ul>
						</li>
					</ul>
				</div><!-- /.navbar-collapse -->
			</nav>

			<!-- begin su-banner -->
			<div class="su-banner">
				<div id="su-banner-search">
					<form class="form-search">
						<div class="input-group">
							<input class="form-control" placeholder="Search" type="text" id="search-input"/>
							<span class="input-group-btn">
								<button class="btn btn-default" type="submit">
									搜索
								</button> </span>
						</div>
					</form>
				</div>
			</div>
			<!-- end su-banner -->
			<!-- begin function bar -->
			<ul class="categories">
				<li class="cat-item cat-item-1">
					<a href="http://su.fudan.edu.cn/wiki/su_aac/download" title="教室借用">教室借用</a>
				</li>
				<li class="cat-item cat-item-1">
					<a href="http://su.fudan.edu.cn/post/index.html" title="信息发布">信息发布</a>
				</li>
				<li class="cat-item cat-item-1">
					<a href="http://su.fudan.edu.cn/wiki/su/assn" title="精品社团">精品社团</a>
				</li>
				<li class="cat-item cat-item-1">
					<a href="http://su.fudan.edu.cn/wiki/su_aac/download" title="横幅出借">横幅出借</a>
				</li>
				<li class="cat-item cat-item-1">
					<a href="http://su.fudan.edu.cn/wiki/su/intro" title="快捷服务">快捷服务</a>
				</li>
			</ul>
			<!-- end function bar -->
			<!-- begin slide -->
			<!--
			<div id="slide" class="row su-slide">
				<div class="col-md-8">
					<div id="unslider" class="unslider-banner">
						<ul>
							<li style="background-image: url('./img/test/1.jpg');"></li>
							<li style="background-image: url('./img/test/2.jpg');"></li>
							<li style="background-image: url('./img/test/3.jpg');"></li>
							<li style="background-image: url('./img/test/4.jpg');"></li>
						</ul>
					</div>
				</div>
			</div>
			<!-- end slide -->

		<!-- end of header -->

		<!-- content -->
		<div class="content">
			<div id="ca-container" class="ca-container">
				<div class="ca-wrapper">
					<?php
					foreach($toplistactivity as $item) 
					echo "<div class=\"ca-item ca-item-".$item['id']."\">
						<div class=\"ca-item-main\">
							<div class=\"ca-icon\"></div>
							<h3>".$item['name']."</h3>
							<h4><span>".$item['introduction']."</span></h4>
							<a href=\"".$item['url']."\" class=\"ca-more\">详情</a>
						</div>
						<div class=\"ca-content-wrapper\">
							<div class=\"ca-content\">
								<h3>复旦大学学生会介绍</h3>
								<a href=\"#\" class=\"ca-close\">关闭</a>
								<div class=\"ca-content-text\">
									<p>
										复旦大学学生会是中国共产党复旦大学委员会领导下的复旦大学全体具有正式学籍的全日制本科生和专科生的群众团体。《复旦大学学生会章程》依据《中华全国学生联合会章程》，根据民主集中制原则对复旦大学各学生组织机构进行职权界定，旨在建立一个民主化、规范化、效率化的机制。
									</p>
									<h6>信息部</h6>
									<p>
										信息部着力为学生会建设网络媒体，打造信息平台，基于学生会网站、OA系统、信息发布平台等，对内提供技术与新闻支持，对外推广学生会形象，让干事在工作中学习一技之长。信息引领时代，我们引领信息！
									</p>
								</div>
								<ul>
									<li>
										<a href=\"#\">专题页面</a>
									</li>
									<li>
										<a href=\"#\">分享此新闻</a>
									</li>
								</ul>
							</div>
						</div>
					</div>";
					
					
					
					foreach($toplistannouncement as $item) 
					echo "<div class=\"ca-item ca-item-".$item['id']."\">
						<div class=\"ca-item-main\">
							<div class=\"ca-icon\"></div>
							<h3>".$item['name']."</h3>
							<h4><span>".$item['abstract']."</span></h4>
							<a href=\"".$item['url']."\" class=\"ca-more\">详情</a>
						</div>
						<div class=\"ca-content-wrapper\">
							<div class=\"ca-content\">
								<h3>复旦大学学生会介绍</h3>
								<a href=\"#\" class=\"ca-close\">关闭</a>
								<div class=\"ca-content-text\">
									<p>
										复旦大学学生会是中国共产党复旦大学委员会领导下的复旦大学全体具有正式学籍的全日制本科生和专科生的群众团体。《复旦大学学生会章程》依据《中华全国学生联合会章程》，根据民主集中制原则对复旦大学各学生组织机构进行职权界定，旨在建立一个民主化、规范化、效率化的机制。
									</p>
									<h6>信息部</h6>
									<p>
										信息部着力为学生会建设网络媒体，打造信息平台，基于学生会网站、OA系统、信息发布平台等，对内提供技术与新闻支持，对外推广学生会形象，让干事在工作中学习一技之长。信息引领时代，我们引领信息！
									</p>
								</div>
								<ul>
									<li>
										<a href=\"#\">专题页面</a>
									</li>
									<li>
										<a href=\"#\">分享此新闻</a>
									</li>
								</ul>
							</div>
						</div>
					</div>";
					?>
									
				</div>
				
				<div class="ca-list">
				
				
				
					<?php
					$itemnum=0;
					foreach($toplistactivity as $item) {
						if($itemnum==0)	echo "<a href=\"#\" class=\"ca-list-item sel\"><h4>".$item['name']."</h4></a>";
						else echo  "<a href=\"#\" class=\"ca-list-item\"><h4>".$item['name']."</h4></a>";
						$itemnum++;
					}
					foreach($toplistannouncement as $item) 
						echo "<a href=\"#\" class=\"ca-list-item\"><h4>".$item['name']."</h4></a>";
					
					?>
				</div>
			</div>
			
			<div class="row">
				<div id="tzygs" class="col-6 col-sm-6 col-lg-6">
					<div class="newstitle">
						<a>通知与告示</a>
						<div class="hr"></div>
						<div class="clearer"></div>
					</div>
					<ul>
		<?php foreach($post_src['data'] as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
					</ul>
					<div class="more">
						<a href="/announcement.php?category=%E5%85%AC%E5%91%8A"><button type="button" class="btn btn-sm btn-primary">更多</button></a>
					</div>
					<div class="clearer"></div>
				</div>
					
				
				<div id="sthd" class="col-6 col-sm-6 col-lg-6">
					<div class="newstitle">
						<a>社团活动</a>
						<div class="hr"></div>
						<div class="clearer"></div>
					</div>
					<ul>
		<?php foreach($assnact_src['data'] as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
					</ul>
					<div class="more">
						<a href="/activity.php?host=assn"><button type="button" class="btn btn-sm btn-primary">更多</button></a>
					</div>
					<div class="clearer"></div>
				</div>
				
				
				
				
				<div id="xwzx" class="col-6 col-sm-6 col-lg-6">
					<div class="newstitle">
						<a>新闻中心</a>
						<div class="hr"></div>
						<div class="clearer"></div>
					</div>
					<ul>
		<?php foreach($news_src['data'] as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
					</ul>
					<div class="more">
						<a href="/announcement.php?category=%E6%96%B0%E9%97%BB"><button type="button" class="btn btn-sm btn-primary">更多</button></a>
					</div>
					<div class="clearer"></div>
				</div>
				
				
				<div id="xshhd" class="col-6 col-sm-6 col-lg-6">
					<div class="newstitle">
						<a>学生会活动</a>
						<div class="hr"></div>
						<div class="clearer"></div>
					</div>
					<ul>
		<?php foreach($suact_src['data'] as $item) echo '<li><a href="' . htmlentities($item['url']) . '">' . htmlentities($item['name']) . '</a></li>'; ?>
					</ul>
					<div class="more">
						
						<a href="/activity.php?host=su"><button type="button" class="btn btn-sm btn-primary">更多</button></a>
						
					</div>
			</div>
				
	
				
			</div>
		
		</div>

<script type="text/javascript">document.write('<iframe id="weibo" width="260" height="489" frameborder="0" scrolling="no" src="http://widget.weibo.com/relationship/bulkfollow.php?language=zh_cn&uids=1729332983,1949791100&wide=1&color=FFFFFF,FFFFFF,0082CB,666666&showtitle=1&showinfo=1&sense=1&verified=1&count=2&refer='+encodeURIComponent(location.href)+'&dpc=1" id="weibo"></iframe>')</script>
		<!-- end of content -->

		<!-- footer -->
		
		
				<div class="share">
					<!-- JiaThis Button BEGIN -->
					<div class="jiathis_style_24x24">
						<a class="jiathis_button_renren"></a>
						<a class="jiathis_button_tsina"></a>
						<a class="jiathis_button_tqq"></a>
						<a class="jiathis_button_qzone"></a>
						<a class="jiathis_button_weixin"></a>
						<a class="jiathis_button_douban"></a>
						<a class="jiathis_button_t163"></a>
						<a class="jiathis_button_email"></a>
						<a class="jiathis_button_copy"></a>
						<a class="jiathis_button_fav"></a>
						<a class="jiathis_button_print"></a>
					</div>
					<script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js" charset="utf-8"></script>
					<!-- JiaThis Button END -->
				</div>
				<br/>
		<nav id="footer-text">
			<p class="navbar-text">
				复旦大学学生会 信息部 © 2013
			</p>
		</nav>
	
		<!-- end of footer -->
<script>
<?php 
//change background
	
	foreach($toplistactivity as $item) 
		
		echo "$(\".ca-item-".$item['id']."\").find(\"div.ca-icon\").css(\"background-image\",\"url('".$item['image_url']."')\");\n";
		 ?>
	

</script>
			<script type="text/javascript">
				Modernizr.load([{
					load : ['js/vendor/jquery-1.10.2.min.js'],
					complete : function() {
						if (!window.jQuery) {
							Modernizr.load('js/vendor/jquery-1.10.2.min.js');
						}
					}
				}, {
					// This will wait for the fallback to load and
					// execute if it needs to.
					load : ['js/jquery.contentcarousel.js','js/jquery.easing.1.3.js', 'js/vendor/bootstrap.min.js', 'js/unslider.js']
				}, {
					load : ['js/vendor/sea.js', 'js/sea-modules/config.js'],
					complete : function() {
						seajs.use('common');
						seajs.use('index/main');
					}
				}]);
			</script>
		<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
		<script>
			( function(b, o, i, l, e, r) {
					b.GoogleAnalyticsObject = l;
					b[l] || (b[l] = function() {
						(b[l].q = b[l].q || []).push(arguments)
					});
					b[l].l = +new Date;
					e = o.createElement(i);
					r = o.getElementsByTagName(i)[0];
					e.src = '//www.google-analytics.com/analytics.js';
					r.parentNode.insertBefore(e, r)
				}(window, document, 'script', 'ga'));
			ga('create', 'UA-XXXXX-X');
			ga('send', 'pageview');
		</script>
	</body>
</html>