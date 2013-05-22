<?php

function escape_like_clause ($pattern) {
	return preg_replace("/[_%]/", "\\\\\\0", $pattern);
}

/**
 * 从数据库中查询符合约束条件的活动
 *
 * @param DBO $db 数据库
 * @param Array $query 约束条件
 *
 * @return Array 活动信息
 */
function activity_query ($db, $query) {
	$clause = array(); // SQL WHERE 语句的子语句（最终会用“AND”进行连接）
	$data = array(); // 用于绑定进入 SQL 语句的参数（相当于 PDOStatement::bindParam 的第二个参数）

	// 以活动名称为约束条件
	// 限制列: name
	if (! empty($query['name'])) {
		$clause[] = 'name ~~ :name';
		$data['name'] = '%' . escape_like_clause($query['name']) . '%';
	}

	// 以活动地点为约束条件
	// 限制列: location
	if (! empty($query['location'])) {
		if (preg_match('/^"(.*)"$/', $query['location'], $match)) {
			$clause[] = 'location = :location';
			$data['location'] = $match[1];
		} else {
			$clause[] = 'location ~~ :location';
			$data['location'] = '%' . escape_like_clause($query['location']) . '%';
		}
	}

	// 以活动主办方为约束条件
	// 限制列: host
	if (! empty($query['host'])) {
		$clause[] = 'host = :host OR host ~~ :hostextent';
		$cnhost = $query['host'];
		$cnhost = preg_replace('#[^[:alpha:]_/]+#', '', $cnhost);
		$cnhost = preg_replace('#/+#', '/', $cnhost);
		$cnhost = preg_replace('#^/|/$#', '', $cnhost);
		$data['host'] = $cnhost;
		$data['hostextent'] = escape_like_clause($cnhost) . '/%';
	}

	// 以活动所属系列为约束条件
	// 限制列: series
	if (! empty($query['series'])) {
		$clause[] = 'series ~~ :series';
		$data['series'] = escape_like_clause($query['series']) . '%';
	}

	// 以活动类型为约束条件
	// 限制列: category
	if (! empty($query['category'])) {
		$clause[] = 'category = :category';
		$data['category'] = $query['category'];
	}

	// 以活动发生时间为约束条件
	// 限制列: time_begin time_end
	if (! empty($query['time'])) {
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

	// 以处理页面大小约束条件（使函数只会返回不超过页面大小个活动）
	$data['pagesize'] = (empty($query['pagesize']) || $query['pagesize'] > 100 || $query['pagesize'] < 1)? 20 : $query['pagesize'];
	// 以处理分页约束条件（使函数返回从第 offset 个开始的活动）
	$data['offset'] = (empty($query['offset']) || $query['offset'] < 0)? 0 : $query['offset'];

	// 构建 WHERE 语句
	$clause = implode(' AND ', $clause);
	if ($clause != "") {
		$clause = " WHERE " . $clause;
	}
	// 构建完整 SQL 语句（_count 列为符合限制条件的活动总数）
	$stmt = $db->prepare("SELECT *, count(*) OVER () as _count FROM activity" . $clause
		. " ORDER BY"
		. " CASE"
		. " WHEN time_begin <= now() AND now() < time_end"
		. " THEN ROW(0, time_end)"

		. " WHEN now() < time_begin AND"
		. "      time_end IS NULL AND"
		. "      extract(week from time_begin) = extract(week from now())"
		. " THEN ROW(0, time_begin)"

		. " WHEN now() < time_begin"
		. " THEN ROW(1, time_begin)"

		. " WHEN time_end <= now()"
		. " THEN ROW(2, now() - time_end)"

		. " ELSE ROW(2, now() - time_begin)"
		. " END"
		. " LIMIT :pagesize OFFSET :offset"
	);

	if ($stmt->execute($data) === false) {
		return false;
	}

	// 因为 pagesize 与 offset 可能与参数要求不同，所以还作为返回值的一部分
	$ret = array('pagesize' => $data['pagesize'], 'offset' => $data['offset']);

	// 返回从数据库里查到的活动列表
	$ret['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// 得到活动总数（从_count列）
	$ret['count'] = isset($ret['data'][0])? $ret['data'][0]['_count'] : 0;

	// 删除不需要的列（_count）
	foreach($ret['data'] as &$item) unset($item['_count']);

	return $ret;
}

/**
 * 从 $_GET 中生成能够作为第二个参数传给 activity_query 函数的数组
 *
 * @return Array activity_query 函数的第二个参数所需数据
 */
function request_to_activity_query () {
	$available = array('name', 'location', 'host', 'series', 'category', 'time', 'offset', 'pagesize');
	$ret = array();
	foreach ($available as $item) {
		if (isset($_GET[$item])) {
			$ret[$item] = $_GET[$item];
		}
	}
	return $ret;
}

/**
 * 从数据库中查询符合约束条件的布告
 *
 * @param DBO $db 数据库
 * @param Array $query 约束条件
 *
 * @return Array 活动信息
 */
function announcement_query ($db, $query) {
	$clause = array(); // SQL WHERE 语句的子语句（最终会用“AND”进行连接）
	$data = array(); // 用于绑定进入 SQL 语句的参数（相当于 PDOStatement::bindParam 的第二个参数）

	// 以活动名称为约束条件
	// 限制列: name
	if (! empty($query['name'])) {
		$clause[] = 'name ~~ :name';
		$data['name'] = '%' . escape_like_clause($query['name']) . '%';
	}

	// 以活动主办方为约束条件
	// 限制列: host
	if (! empty($query['host'])) {
		$clause[] = 'host = :host OR host ~~ :hostextent';
		$cnhost = $query['host'];
		$cnhost = preg_replace('#[^[:alpha:]_/]+#', '', $cnhost);
		$cnhost = preg_replace('#/+#', '/', $cnhost);
		$cnhost = preg_replace('#^/|/$#', '', $cnhost);
		$data['host'] = $cnhost;
		$data['hostextent'] = escape_like_clause($cnhost) . '/%';
	}

	// 以活动所属系列为约束条件
	// 限制列: series
	if (! empty($query['series'])) {
		$clause[] = 'series ~~ :series';
		$data['series'] = escape_like_clause($query['series']) . '%';
	}

	// 以活动类型为约束条件
	// 限制列: category
	if (! empty($query['category'])) {
		$clause[] = 'category = :category';
		$data['category'] = $query['category'];
	}

	// 以是否显示隐藏为约束条件
	// 限制列: hidden
	if (! (isset($query['showhidden']) && $query['showhidden'])) {
		$clause[] = 'hidden = FALSE';
	}

	// 以活动发生时间为约束条件
	// 限制列: time
	if (! (isset($query['fore']) && $query['fore'])) {
		$clause[] = 'time < now()';
	}

	// 以处理页面大小约束条件（使函数只会返回不超过页面大小个活动）
	$data['pagesize'] = (empty($query['pagesize']) || $query['pagesize'] > 100 || $query['pagesize'] < 1)? 20 : $query['pagesize'];
	// 以处理分页约束条件（使函数返回从第 offset 个开始的活动）
	$data['offset'] = (empty($query['offset']) || $query['offset'] < 0)? 0 : $query['offset'];

	// 构建 WHERE 语句
	$clause = implode(' AND ', $clause);
	if ($clause != "") {
		$clause = " WHERE " . $clause;
	}
	// 构建完整 SQL 语句（_count 列为符合限制条件的活动总数）
	$stmt = $db->prepare("SELECT *, count(*) OVER () as _count FROM announcement" . $clause
		. " ORDER BY time DESC"
		. " LIMIT :pagesize OFFSET :offset"
	);

	if ($stmt->execute($data) === false) {
		return false;
	}

	// 因为 pagesize 与 offset 可能与参数要求不同，所以还作为返回值的一部分
	$ret = array('pagesize' => $data['pagesize'], 'offset' => $data['offset']);

	// 返回从数据库里查到的活动列表
	$ret['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// 得到活动总数（从_count列）
	$ret['count'] = isset($ret['data'][0])? $ret['data'][0]['_count'] : 0;

	// 删除不需要的列（_count）
	foreach($ret['data'] as &$item) unset($item['_count']);

	return $ret;
}

/**
 * 从 $_GET 中生成能够作为第二个参数传给 announcement_query 函数的数组
 *
 * @return Array announcement_query 函数的第二个参数所需数据
 */
function request_to_announcement_query () {
	$available = array('name', 'location', 'host', 'series', 'category', 'offset', 'pagesize');
	$ret = array();
	foreach ($available as $item) {
		if (isset($_GET[$item])) {
			$ret[$item] = $_GET[$item];
		}
	}
	return $ret;
}
