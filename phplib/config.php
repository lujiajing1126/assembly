<?php
$DSN = array (
        'activity' => 'pgsql:host=localhost;user=su;password=sudb;dbname=su_main',
        'announcement' => 'pgsql:host=localhost;user=su;password=sudb;dbname=su_main'
);

$_SERVER['DOCUMENT_ROOT'] = rtrim($_SERVER['DOCUMENT_ROOT'], DIRECTORY_SEPARATOR);

$LIBDIR = $_SERVER['DOCUMENT_ROOT'] . '.lib';
?>
