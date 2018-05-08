<?php
header('Content-type: text/html; charset=utf-8');
include 'api/index.php';
include 'api/inc/db.php';


$res = mysqli_query($db, "SELECT id_event,size,area,text,url_img FROM events WHERE state=true");
$row = mysqli_fetch_assoc($res);

$main = new FindToys($db);


ob_start();
include('build/index.html');
ob_end_flush();

?>
