<?php
require_once 'siteauth.php';

function probe_organization_id ($input) {
	$n = false;
	$orgs = get_object_vars(get_info_of_organizations($input));
	if (! empty($orgs)) {
		return array($input, true);
	}
	$orgs = get_object_vars(find_organizations($input));
	if (! empty($orgs)) {
		foreach ($orgs as $oid => $oprof) {
			if ($oprof->full_name === $input) {
				return array($oid, true);
			} else {
				$pos = strpos($oprof->full_name, $input);
				if ($pos !== false) {
					$nx = array(strlen($oprof->full_name) - $pos - strlen($input), $pos, $oid);
					if ($n === false || $n > $nx) {
						$n = $nx;
					}
				}
			}
		}
	}
	$orgs = get_object_vars(list_organizations($input));
	if (! empty($orgs)) {
		$ainput = preg_replace('/[^[:alpha:]_]/', '', $input);
		foreach ($orgs as $oid => $oprof) {
			$aoid = preg_replace('/[^[:alpha:]_]/', '', $oid);
			if ($aoid === $ainput) {
				return array($oid, true);
			} else {
				$nx = array(strlen($ainput) - strlen($aoid), 0, $oid);
				if ($n === false || $n > $nx) {
					$n = $nx;
				}
			}
		}
	}
	if ($n === false) {
		return array($input, null);
	} else {
		return array($n[2], false);
	}
}
