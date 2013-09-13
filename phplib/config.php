<?php
$DSN = array (
        'activity' => 'pgsql:host=localhost;user=su;password=sudb;dbname=su_main',
        'announcement' => 'pgsql:host=localhost;user=su;password=sudb;dbname=su_main'
);

$SERVER['DOCUMENT_ROOT'] = rtrim($SERVER['DOCUMENT_ROOT'], DIRECTORY_SEPARATOR);

$LIBDIR = $SERVER['DOCUMENT_ROOT'] . '.lib';
?>
