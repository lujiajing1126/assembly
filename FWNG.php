<?php
if (isset($_COOKIE['FWNG-ALPHA'])) {
	setcookie('FWNG-ALPHA', "", time() - 3600);
} else {
	setcookie('FWNG-ALPHA', "true");
}

header('Location: /', 302);
