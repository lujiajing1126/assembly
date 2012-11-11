<?php 
function get_site_auth ($profiles = "userProfile") {
	$siteauth = 'http://localhost:8080/Login/GetUser';
	$uiscookies = array(
		'iPlanetDirectoryPro' => 0,
		'NAMESESSION' => 0,
		'SITESESSION' => 0
	);
	$ch = curl_init($siteauth . '?obtain=' . $profiles);
	$cookie_passthru = "";
	foreach (array_intersect_key($_COOKIE, $uiscookies) as $k => $v) {
		$cookie_passthru .= '; ' . urlencode($k) . '=' . urlencode($v);
	}
	curl_setopt($ch, CURLOPT_COOKIE, substr($cookie_passthru, 2));

	ob_start();
	curl_exec($ch);
	$jdoc = ob_get_clean();
	curl_close($ch);

	if ($jdoc) {
		$prof = json_decode($jdoc);
		if (isset($prof->login->nameSessionId))
			setcookie(
				'NAMESESSION',
				$prof->login->nameSessionId,
				time() + $prof->login->nameSessionLifetime / 1000,
				'/'
			);
		if (isset($prof->login->siteSessionId))
			setcookie(
				'SITESESSION',
				$prof->login->siteSessionId,
				$prof->login->lifetime > 0?
					time() + $prof->login->lifetime / 1000 :
					0,
				'/'
			);
		return $prof;
	} else {
		return null;
	}
}
?>
