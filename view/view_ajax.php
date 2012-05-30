<?php
	switch($_GET["routine"]) {
		case "get_host_prompt":
			echo json_encode(array($_GET["term"] . "_a", $_GET["term"] . "_b"));
			break;
		case "get_host_info":
			echo json_encode(array('found' => true, 'id' => $_GET["host"], 'name' => '"' . $_GET["host"] . '"'));
		break;
		case "get_result":
			echo json_encode(array(array('title' => "Test Title", 'content' => json_encode($_GET["query"]))));
		break;
	}
?>
