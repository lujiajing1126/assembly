<?php 
define("SITEAUTH_GROUP_ADMINISTRATOR", "[administrator]");
define("SITEAUTH_GROUP_ANNOUNCER", "[announcer]");

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
		$jobj = json_decode($jdoc);
		if (isset($jobj->login->nameSessionId))
			setcookie(
				'NAMESESSION',
				$jobj->login->nameSessionId,
				time() + $jobj->login->nameSessionLifetime / 1000,
				'/'
			);
		if (isset($jobj->login->siteSessionId))
			setcookie(
				'SITESESSION',
				$jobj->login->siteSessionId,
				$jobj->login->lifetime > 0?
					time() + $jobj->login->lifetime / 1000 :
					0,
				'/'
			);
		return $jobj;
	} else {
		return null;
	}
}

function get_login_data () {
	$siteauth = 'http://localhost:8080/Login/login_data';
	$uiscookies = array(
		'iPlanetDirectoryPro' => 0,
		'NAMESESSION' => 0,
		'SITESESSION' => 0
	);
	$ch = curl_init($siteauth);
	$cookie_passthru = "";
	foreach (array_intersect_key($_COOKIE, $uiscookies) as $k => $v) {
		$cookie_passthru .= '; ' . urlencode($k) . '=' . urlencode($v);
	}
	curl_setopt($ch, CURLOPT_COOKIE, substr($cookie_passthru, 2));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc);
		if (isset($jobj->nameSessionId))
			setcookie(
				'NAMESESSION',
				$jobj->nameSessionId,
				time() + $jobj->nameSessionLifetime / 1000,
				'/'
			);
		if (isset($jobj->siteSessionId))
			setcookie(
				'SITESESSION',
				$jobj->siteSessionId,
				$jobj->lifetime > 0?
					time() + $jobj->lifetime / 1000 :
					0,
				'/'
			);
		return $jobj;
	} else {
		return null;
	}
}

function get_user_data ($username, $method = "get_profile, get_membership_profile, get_uis_profile") {
	$siteauth = 'http://localhost:8080/Login/user_data';
	$ch = curl_init($siteauth . '?uid=' . urlencode($username) . '&method=' . urlencode($method));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc);
		return $jobj;
	} else {
		return null;
	}
}

function list_organizations ($oid_prefix) {
	$siteauth = 'http://localhost:8080/Login/organization_data';
	$ch = curl_init($siteauth . '?method=list&oid_prefix=' . urlencode($oid_prefix));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc)->organizations;
		return $jobj;
	} else {
		return null;
	}
}

function find_organizations ($name) {
	$siteauth = 'http://localhost:8080/Login/organization_data';
	$ch = curl_init($siteauth . '?method=find&name=' . urlencode($name));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc)->organizations;
		return $jobj;
	} else {
		return null;
	}
}

function get_info_of_organizations ($oids) {
	if (! is_array($oids)) {
		$oids = array($oids);
	}

	$siteauth = 'http://localhost:8080/Login/organization_data';
	$ch = curl_init($siteauth . '?method=info&oid=' . implode("&oid=", array_map("urlencode", $oids)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc)->organizations;
		return $jobj;
	} else {
		return null;
	}
}

function get_organization_members ($oid, $group = null, $orderby = null) {
	if ($orderby === null) {
		$orderby = array("by_user", "by_group");
	}
	$orderby = array_intersect($orderby, array("by_user", "by_group"));

	$siteauth = 'http://localhost:8080/Login/organization_data';
	$ch = curl_init($siteauth . '?method=member&oid=' . urlencode($oid)
		. ($group === null? "" : "&group=" . urlencode($group))
		. (is_array($orderby) && ! empty($orderby)? "&" . implode("&", $orderby) : ""));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$jdoc = curl_exec($ch);
	curl_close($ch);

	if ($jdoc) {
		$jobj = json_decode($jdoc);
		return $jobj;
	} else {
		return null;
	}
}

// return an array of organization id
function represented_organizations ($user, $target_groups) {
	$ret = array();
	if (! is_array($target_groups)) {
		$target_groups = array($target_groups);
	}
	foreach (get_object_vars(get_user_data($user, "get_membership_profile")->membership) as $orgid => $groups) {
		if (count(array_intersect($target_groups, $groups))) {
			$ret[] = $orgid;
		}
	}
	return $ret;
}

function organization_id_to_name ($oid) {
	static $namemap = array();
	if (in_array($oid, $namemap)) {
		return $namemap[$oid];
	} else {
	}
}

if (isset($_GET['SITEAUTH_TEST']) && $_SERVER['REMOTE_ADDR'] === "127.0.0.1") {
	var_dump(get_login_data());
	if (isset($_GET['uid'])) var_dump(get_user_data($_GET['uid']));
	if (isset($_GET['org'])) var_dump(probe_organization_id($_GET['org']));
}
