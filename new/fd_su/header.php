<?php
/**
 * header.php
 * 	theme name: FD.SU
 * 	version: 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
	<![endif]-->
	
	<!-- css -->
		<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/bootstrap-theme.min.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/style.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/jquery.jscrollpane.css"/>
		
	<!-- other -->
		<link rel="shortcut icon" href="../favicon.ico">
		
	<!-- js -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script type="text/javascript">if(!window.jQuery){document.write('<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/js/jquery-1.10.2.min.js"><\/script>');}</script>
		<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/js/bootstrap.min.js"></script>

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
		<!--[if lt IE 7]>
			<p >You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->

	<div id="page" class="hfeed site">
	<div class="container">
		<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="<?php echo home_url()?>">Su.FD</a>
			</div>
			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="nav-bar-collapse-1">
				<ul class="nav navbar-nav">
				<li class="active"><a href="<?php echo home_url()?>">首页</a></li>
				<li><a href="post.html">新闻中心</a></li>
				<li><a href="post.html">校会简介</a></li>
				<li><a href="post.html">资源文档</a>	</li>
				<li><a href="post.html">社团在线</a></li>
				<li><a href="/post.html">品牌活动</a></li>
			</ul>
				<ul class="nav navbar-nav navbar-right">
				<li><a href="#">RSS</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">用户操作 <b class="caret"></b></a>
							<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
								<li>
									<a href="#">办公页面</a>
								</li>
								<li>
									<a href="#">个人设置</a>
								</li>
								<li class="divider"></li>
								<li>
									<a href="#">登出</a>
								</li>
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
							<input class="form-control" placeholder="搜索内容" type="text" id="search-input"/>
							<span class="input-group-btn">
								<button class="btn btn-default" type="submit">搜索</button></span>
						</div>
					</form>
				</div>
			</div>
			<!-- end su-banner -->
			
			<!-- begin function bar -->
			<ul class="categories">
				<li class="cat-item cat-item-1">
					<a href="<?php echo home_url()?>" title="首页">首页</a>
				</li>
				<?php wp_list_pages('sort_column=menu_order&title_li='); ?> 
			</ul>
			<!-- end function bar -->
		
		<div id="main" class="site-main">
