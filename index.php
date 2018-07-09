<?php
header('Content-type: text/html; charset=utf-8');
include 'api/index.php';
include 'api/inc/db.php';


$main = new FindToys($db);


ob_start();
include('build/index.html');
ob_end_flush();

?>
