<?php

function escape_like_clause ($pattern) {
	return preg_replace("/[_%]/", "\\\\\\0", $pattern);
}

function activity_query ($db, $query) {
	$clause = array();
	$data = array();

	if (isset($query['name']) && $query['name'] != "") {
		$clause[] = 'name ~~ :name';
		$data['name'] = '%' . escape_like_clause($query['name']) . '%';
	}

	if (isset($query['location']) && $query['location'] != "") {
		if (preg_match('/^"(.*)"$/', $query['location'], $match)) {
			$clause[] = 'location = :location';
			$data['location'] = $match[1];
		} else {
			$clause[] = 'location ~~ :location';
			$data['location'] = '%' . escape_like_clause($query['location']) . '%';
		}
	}

	if (isset($query['host']) && $query['host'] != "") {
		$clause[] = 'host = :host';
		$data['host'] = $query['name'];
		$clause[] = 'host ~~ :hostextent';
		$data['hostextent'] = escape_like_clause($query['host']) . '/%';
	}

	if (isset($query['serial']) && $query['serial'] != "") {
		$clause[] = 'serial ~~ :serial';
		$data['serial'] = escape_like_clause($query['serial']) . '%';
	}

	if (isset($query['category']) && $query['category'] != "") {
		$clause[] = 'category = :category';
		$data['category'] = $query['category'];
	}

	if (isset($query['time']) && $query['time'] != "") {
		switch ($query['time']) {
		case 'ended':
			$clause[] = '(time_end IS NULL AND time_begin < now()) OR time_end < now()';
		break;
		case 'running':
			$clause[] = 'time_begin =< now()';
			$clause[] = 'now < time_end';
		break;
		case 'thisweek':
			$clause[] = 'now() < time_begin';
			$clause[] = 'extract(week from time_begin) = extract(week from now())';
		break;
		case 'nextweek':
			$clause[] = 'now() < time_begin';
			$clause[] = 'extract(week from time_begin) = extract(week from now()) + 1';
		break;
		case 'followingmonth':
			$clause[] = 'time_begin < current_date + interval \'30 days\'';
		break;
		case '0': case '1': case '2': case '3':
		case '4': case '5': case '6':
			$clause[] = 'now() < time_begin';
			$clause[] = 'extract(dow from time_begin) = :timedow';
			$clause[] = 'time_begin < current_date + interval \'30 days\'';
			$data['timedow'] = $query['time'];
		break;
		}
	}

	$data['pagesize'] = (! isset($query['pagesize']) || ! is_numeric($query['pagesize']) || $query['pagesize'] > 100 || $query['pagesize'] < 1)? 20 : $query['pagesize'];
	$data['offset'] = (! isset($query['offset']) || ! is_numeric($query['offset']) || $query['offset'] < 0)? 0 : $query['offset'];

	$clause = implode(' AND ', $clause);
	if ($clause != "") {
		$clause = " WHERE " . $clause;
	}
	$stmt = $db->prepare("SELECT *, count(*) OVER () as _count FROM activity" . $clause
		. " ORDER BY"
			. " least(time_end, now()) DESC, "
			. " CASE WHEN time_begin <= now() AND now() < time_end THEN time_end "
				. " WHEN extract(week from time_begin) = extract(week from now()) AND time_end IS NULL THEN '-infinity'"
				. " ELSE '-infinity' END,"
			. " time_begin"
		. " LIMIT :pagesize OFFSET :offset"
	);

	if ($stmt->execute($data) === false) {
		var_dump($stmt->errorInfo());
		return false;
	}

	$ret = array('pagesize' => $data['pagesize'], 'offset' => $data['offset']);
	$ret['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$ret['count'] = isset($ret['data'][0])? $ret['data'][0]['_count'] : 0;
	foreach($ret['data'] as &$item) unset($item['_count']);
	return $ret;
}

function request_to_activity_query () {
	$available = array('name', 'location', 'host', 'serial', 'category', 'time', 'offset', 'pagesize');
	$ret = array();
	foreach ($available as $item) {
		if (isset($_GET[$item])) {
			$ret[$item] = $_GET[$item];
		}
	}
	return $ret;
}

?>

