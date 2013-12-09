<?php
/**
 * header.php
 * 	theme name: FD.SU
 * 	version: 1.0
 */
?>

		</div><!-- #main -->
		<footer id="colophon" class="site-footer" role="contentinfo">
			<?php get_sidebar( 'main' ); ?>

			<nav id="footer-text">
				<p class="navbar-text" style="float:right;">复旦大学学生会 信息部 © 2013</p>
			</nav>
		</footer><!-- #colophon -->
	</div><!-- .container -->
	</div><!-- #page -->

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

	<?php wp_footer(); ?>
</body>
</html>